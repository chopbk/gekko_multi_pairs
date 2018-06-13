/*

  The portfolio manager is responsible for making sure that
  all decisions are turned into orders and make sure these orders
  get executed. Besides the orders the manager also keeps track of
  the client's portfolio.

  NOTE: Execution strategy is limit orders (to not cross the book)

*/

var _ = require('lodash');
var util = require('../../core/util');
var dirs = util.dirs();
var events = require('events');
var log = require(dirs.core + 'log');
var async = require('async');
var checker = require(dirs.core + 'exchangeChecker.js');
var moment = require('moment');
var enable_fix_amount = false;
max_amount_currency_buy =0; //use in first buy, amount = max_amount_currency_buy / price
var amount_currency_sold_temp;
amount_currency_sold =0;
amount_asset_bought= 0;
price_original = 0;
var amount_asset_bought_temp;
max_amount_asset_sell = 0; //use in first sell, amount = max_amount_asset 
var Manager = function (conf) {
  _.bindAll(this);

  var error = checker.cantTrade(conf);
  if (error)
    util.die(error);

  this.exchangeMeta = checker.settings(conf);

  // create an exchange
  var Exchange = require(dirs.exchanges + this.exchangeMeta.slug);
  this.exchange = new Exchange(conf);
  max_amount_currency_buy = conf.max_amount_currency_buy;
  max_amount_asset_sell = conf.max_amount_asset_sell;
  this.enable_fix_amount = conf.enable_fix_amount;
  amount_asset_bought = 0;
  amount_currency_sold = 0;
  log.debug('max_amount_currency_buy:  ' + max_amount_currency_buy);
  log.debug('max_amount_asset_sell: ' + max_amount_asset_sell);
  log.debug('enable_fix_amount: ' + this.enable_fix_amount);
  this.conf = conf;
  this.portfolio = {};
  this.fee;
  this.action;

  this.marketConfig = _.find(this.exchangeMeta.markets, function (p) {
    return _.first(p.pair) === conf.currency.toUpperCase() && _.last(p.pair) === conf.asset.toUpperCase();
  });
  this.minimalOrder = this.marketConfig.minimalOrder;

  this.currency = conf.currency;
  this.asset = conf.asset;
  this.keepAsset = 0;

  if (_.isNumber(conf.keepAsset)) {
    log.debug('Keep asset is active. Will try to keep at least ' + conf.keepAsset + ' ' + conf.asset);
    this.keepAsset = conf.keepAsset;
  }

  // resets after every order
  this.orders = [];
};

// teach our trader events
util.makeEventEmitter(Manager);

Manager.prototype.init = function (callback) {
  log.debug('getting ticker, balance & fee from', this.exchange.name);
  var prepare = function () {
    this.starting = false;

    log.info('trading at', this.exchange.name, 'ACTIVE');
    log.info(this.exchange.name, 'trading fee will be:', this.fee * 100 + '%');
    this.logPortfolio();

    callback();
  };

  async.series([
    this.setTicker,
    this.setPortfolio,
    this.setFee
  ], _.bind(prepare, this));
}

Manager.prototype.setPortfolio = function (callback) {
  var set = function (err, fullPortfolio) {
    if (err)
      util.die(err);

    // only include the currency/asset of this market
    const portfolio = [this.conf.currency, this.conf.asset]
      .map(name => {
        let item = _.find(fullPortfolio, {
          name
        });

        if (!item) {
          log.debug(`Unable to find "${name}" in portfolio provided by exchange, assuming 0.`);
          item = {
            name,
            amount: 0
          };
        }

        return item;
      });

    if (_.isEmpty(this.portfolio))
      this.emit('portfolioUpdate', this.convertPortfolio(portfolio));

    this.portfolio = portfolio;

    if (_.isFunction(callback))
      callback();

  }.bind(this);

  this.exchange.getPortfolio(set);
};

Manager.prototype.setFee = function (callback) {
  var set = function (err, fee) {
    this.fee = fee;

    if (err)
      util.die(err);

    if (_.isFunction(callback))
      callback();
  }.bind(this);
  this.exchange.getFee(set);
};

Manager.prototype.setTicker = function (callback) {
  var set = function (err, ticker) {
    this.ticker = ticker;

    if (err)
      util.die(err);

    if (_.isFunction(callback))
      callback();
  }.bind(this);
  this.exchange.getTicker(set);
};

// return the [fund] based on the data we have in memory
Manager.prototype.getFund = function (fund) {
  return _.find(this.portfolio, function (f) {
    return f.name === fund
  });
};
Manager.prototype.getBalance = function (fund) {
  return this.getFund(fund).amount;
};
Manager.prototype.log_error_buy = function () {
  return log.info(
    'Wanted to buy but gekko has not sold yet'
  );
};
Manager.prototype.log_error_sell = function () {
  return log.info(
    'Wanted to sell but gekko has not bought yet'
  );
};
// This function makes sure the limit order gets submitted
// to the exchange and initiates order registers watchers.
Manager.prototype.trade = function (what, retry) {
  // if we are still busy executing the last trade
  // cancel that one (and ignore results = assume not filled)
  if (!retry && _.size(this.orders))
    return this.cancelLastOrder(() => this.trade(what));

  this.action = what;

  var act = function () {
    var amount, price;
    var amount_temp;
    var blance_currency;

    if (what === 'BUY') {
      blance_currency = this.getBalance(this.currency); //get blance of currency
      amount = blance_currency / this.ticker.ask; //calculate max amount
      
      /*start calculate plugin multil pairt*/      
      if (this.enable_fix_amount) { /*if enable for trade with fix amount*/
        if (amount_asset_bought != 0) {
          log.debug('error:  amount_asset_bought'+amount_asset_bought);
          return this.log_error_buy();
        }
        if (amount_currency_sold != 0) {
          if(max_amount_currency_buy != 0 && amount_currency_sold > max_amount_currency_buy*1.25){
            amount_currency_sold = max_amount_currency_buy*1.12; /*don't want use more 20% currency profit*/
          }
          amount_temp = amount_currency_sold / this.ticker.ask;            
          log.info(
            'BUY amount_currency_sold: ',
            amount_currency_sold,
            this.currency,
            'with',
            amount_temp,
            this.asset,
            'at',
            this.exchange.name,
          );
        } else if (max_amount_currency_buy != 0) { /* this config use when first trade */
          amount_temp = max_amount_currency_buy / this.ticker.ask;
          max_amount_asset_sell = amount_temp;
          price_original =  this.ticker.ask;
          log.info(
            'BUY max_amount_currency_buy: ',
            max_amount_currency_buy,
            this.currency,
            'with',
            amount_temp,
            this.asset,
            'at',
            this.exchange.name,
          );
        } else {
          log.debug('error:  no config for max_amount_currency_buy');
          return this.log_error_buy(); /*if not sell and max_amount_currency_buy = 0*/
        }
        if (amount > amount_temp)
          amount = amount_temp;
      }
      /*end calculate plugin multil pairt*/

      if (amount > 0) {
        price = this.ticker.bid;
        this.buy(amount, price);
      }
    } else if (what === 'SELL') {

      amount = this.getBalance(this.asset) - this.keepAsset;

      /*start calculate plugin multil pairt*/
      if (this.enable_fix_amount) { /*if enable for trade with fix amount*/
        if (amount_currency_sold != 0) {
          log.debug('error:  amount_currency_sold'+amount_currency_sold);
          return this.log_error_sell();
        }

        if (amount_asset_bought != 0) {
          if(amount_asset_bought/max_amount_asset_sell > 1.15)
            amount_asset_bought = max_amount_asset_sell*1.05; /*protect 10% profit*/
          amount_temp = amount_asset_bought;
          log.info(
            'SELL amount_asset_bought: ',
            amount_asset_bought,
            this.asset,
            'at',
            this.exchange.name,
          );
        } else if (max_amount_asset_sell != 0) {
          log.info(
            'SELL max_amount_asset_sell: ',
            max_amount_asset_sell,
            this.asset,
            'at',
            this.exchange.name,
          );
          price_original =  this.ticker.ask;
          amount_temp = max_amount_asset_sell;
          max_amount_currency_buy = amount_temp*this.ticker.ask;          
        } else {
          log.debug('error:  no config for max_amount_asset_sell');
          return this.log_error_sell(); /*if not sell and max_amount_asset_sell = 0*/
        }
        if (amount > amount_temp)
          amount = amount_temp;
      }
      /*end calculate plugin multil pairt*/

      if (amount > 0) {
        price = this.ticker.ask;
        this.sell(amount, price);
      }
    }
  };
  async.series([
    this.setTicker,
    this.setPortfolio,
    this.setFee
  ], _.bind(act, this));

};

Manager.prototype.getMinimum = function (price) {
  if (this.minimalOrder.unit === 'currency')
    return minimum = this.minimalOrder.amount / price;
  else
    return minimum = this.minimalOrder.amount;
};

// first do a quick check to see whether we can buy
// the asset, if so BUY and keep track of the order
// (amount is in asset quantity)
Manager.prototype.buy = function (amount, price) {
  let minimum = 0;
  let process = (err, order) => {
    // if order to small
    if (!order.amount || order.amount < minimum) {
      return log.warn(
        'Wanted to buy',
        this.asset,
        'but the amount is too small ',
        '(' + parseFloat(amount).toFixed(8) + ' @',
        parseFloat(price).toFixed(8),
        ') at',
        this.exchange.name
      );
    }

    log.info(
      'Attempting to BUY',
      order.amount,
      this.asset,
      'at',
      this.exchange.name,
      'price:',
      order.price
    );

    this.exchange.buy(order.amount, order.price, this.noteOrder);
  }

  if (_.has(this.exchange, 'getLotSize')) {
    this.exchange.getLotSize('buy', amount, price, _.bind(process));
  } else {
    minimum = this.getMinimum(price);
    process(undefined, {
      amount: amount,
      price: price
    });
  }
  amount_asset_bought_temp = amount;
  amount_currency_sold_temp = 0;
};

// first do a quick check to see whether we can sell
// the asset, if so SELL and keep track of the order
// (amount is in asset quantity)
Manager.prototype.sell = function (amount, price) {
  let minimum = 0;
  let process = (err, order) => {
    // if order to small
    if (!order.amount || order.amount < minimum) {
      return log.warn(
        'Wanted to sell',
        this.currency,
        'but the amount is too small ',
        '(' + parseFloat(amount).toFixed(8) + ' @',
        parseFloat(price).toFixed(8),
        ') at',
        this.exchange.name
      );
    }

    log.info(
      'Attempting to SELL',
      order.amount,
      this.asset,
      'at',
      this.exchange.name,
      'price:',
      order.price
    );
    this.exchange.sell(order.amount, order.price, this.noteOrder);
  }

  if (_.has(this.exchange, 'getLotSize')) {
    this.exchange.getLotSize('sell', amount, price, _.bind(process));
  } else {
    minimum = this.getMinimum(price);
    process(undefined, {
      amount: amount,
      price: price
    });
  }
  amount_currency_sold_temp = amount * price;
  amount_asset_bought_temp = 0;
};

Manager.prototype.noteOrder = function (err, order) {
  if (err) {
    util.die(err);
  }

  this.orders.push(order);

  // If unfilled, cancel and replace order with adjusted price
  let cancelDelay = this.conf.orderUpdateDelay || 1;
  setTimeout(this.checkOrder, util.minToMs(cancelDelay));
};


Manager.prototype.cancelLastOrder = function (done) {
  this.exchange.cancelOrder(_.last(this.orders), alreadyFilled => {
    if (alreadyFilled)
      return this.relayOrder(done);

    this.orders = [];
    done();
  });
}

// check whether the order got fully filled
// if it is not: cancel & instantiate a new order
Manager.prototype.checkOrder = function () {
  var handleCheckResult = function (err, filled) {
    if (!filled) {
      log.info(this.action, 'order was not (fully) filled, cancelling and creating new order');
      this.exchange.cancelOrder(_.last(this.orders), _.bind(handleCancelResult, this));
      return;
    }

    log.info(this.action, 'was successfull');
    amount_asset_bought = amount_asset_bought_temp;
    amount_currency_sold = amount_currency_sold_temp;
    this.relayOrder();
  }

  var handleCancelResult = function (alreadyFilled) {
    if (alreadyFilled)
      return;

    if (this.exchangeMeta.forceReorderDelay) {
      //We need to wait in case a canceled order has already reduced the amount
      var wait = 10;
      log.debug(`Waiting ${wait} seconds before starting a new trade on ${this.exchangeMeta.name}!`);

      setTimeout(
        () => this.trade(this.action, true), +moment.duration(wait, 'seconds')
      );
      return;
    }

    this.trade(this.action, true);
  }

  this.exchange.checkOrder(_.last(this.orders), _.bind(handleCheckResult, this));
}

// convert into the portfolio expected by the performanceAnalyzer
Manager.prototype.convertPortfolio = function (portfolio) {
  var asset = _.find(portfolio, a => a.name === this.asset).amount;
  var currency = _.find(portfolio, a => a.name === this.currency).amount;

  return {
    currency,
    asset,
    balance: currency + (asset * this.ticker.bid)
  }
}

Manager.prototype.relayOrder = function (done) {
  // look up all executed orders and relay average.
  var relay = (err, res) => {

    var price = 0;
    var amount = 0;
    var date = moment(0);

    _.each(res.filter(o => !_.isUndefined(o) && o.amount), order => {
      date = _.max([moment(order.date), date]);
      price = ((price * amount) + (order.price * order.amount)) / (order.amount + amount);
      amount += +order.amount;
    });

    async.series([
      this.setPortfolio,
      this.setTicker
    ], () => {
      const portfolio = this.convertPortfolio(this.portfolio);

      this.emit('trade', {
        date,
        price,
        portfolio: portfolio,
        balance: portfolio.balance,

        // NOTE: within the portfolioManager
        // this is in uppercase, everywhere else
        // (UI, performanceAnalyzer, etc. it is
        // lowercase)
        action: this.action.toLowerCase()
      });

      this.orders = [];

      if (_.isFunction(done))
        done();
    });

  }

  var getOrders = _.map(
    this.orders,
    order => next => this.exchange.getOrder(order, next)
  );

  async.series(getOrders, relay);
}

Manager.prototype.logPortfolio = function () {
  log.info(this.exchange.name, 'portfolio:');
  _.each(this.portfolio, function (fund) {
    log.info('\t', fund.name + ':', parseFloat(fund.amount).toFixed(12));
  });
};

module.exports = Manager;

