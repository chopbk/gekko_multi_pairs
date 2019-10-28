const _ = require('lodash');
const util = require('../../core/util.js');
const config = util.getConfig();
const dirs = util.dirs();
const moment = require('moment');

const log = require(dirs.core + 'log');
const Broker = require(dirs.broker + '/gekkoBroker');

require(dirs.gekko + '/exchange/dependencyCheck');

/*tsuperprince START add variable for fix amount feature*/
enable_fix_amount = false;
first_currency_buy = 0; //use in first buy, amount = first_currency_buy / price
var amount_sold_temp;
amount_sold = 0; //amount currency (like USDT) sold in previous
amount_bought = 0;
var amount_bought_temp;
first_asset_sell = 0; //use in first sell, amount = max_amount_asset 
first_time = true;
/*tsuperprince END add variable for fix amount feature*/

const Trader = function (next) {

  _.bindAll(this);

  this.brokerConfig = {
    ...config.trader,
    ...config.watch,
    private: true
  }
  /*tsuperprince START check config variable for fix amount feature*/
  log
  if (config.watch.enable_fix_amount) {
    enable_fix_amount = config.watch.enable_fix_amount;
    first_currency_buy = config.watch.first_currency_buy;
    first_asset_sell = config.watch.first_asset_sell;
    log.debug('enable_fix_amount: ' + enable_fix_amount);
    log.debug('first time Gekko will buy  :  ' + first_currency_buy + ' ' + config.watch.currency);
    log.debug('first time Gekko will sell : ' + first_asset_sell + ' ' + config.watch.asset);
  }
  /*tsuperprince END check config variable for fix amount feature*/
  this.propogatedTrades = 0;
  this.propogatedTriggers = 0;

  try {
    this.broker = new Broker(this.brokerConfig);
  } catch (e) {
    util.die(e.message);
  }

  if (!this.broker.capabilities.gekkoBroker) {
    util.die('This exchange is not yet supported');
  }

  this.sync(() => {
    log.info('\t', 'Portfolio:');
    log.info('\t\t', this.portfolio.currency, this.brokerConfig.currency);
    log.info('\t\t', this.portfolio.asset, this.brokerConfig.asset);
    log.info('\t', 'Balance:');
    log.info('\t\t', this.balance, this.brokerConfig.currency);
    log.info('\t', 'Exposed:');
    log.info('\t\t',
      this.exposed ? 'yes' : 'no',
      `(${(this.exposure * 100).toFixed(2)}%)`
    );
    next();
  });

  this.cancellingOrder = false;
  this.sendInitialPortfolio = false;

  setInterval(this.sync, 1000 * 60 * 10);
}

// teach our trader events
util.makeEventEmitter(Trader);

Trader.prototype.sync = function (next) {
  //log.debug('syncing private data');
  this.broker.syncPrivateData(() => {
    if (!this.price) {
      this.price = this.broker.ticker.bid;
    }

    const oldPortfolio = this.portfolio;

    this.setPortfolio();
    this.setBalance();

    if (this.sendInitialPortfolio && !_.isEqual(oldPortfolio, this.portfolio)) {
      this.relayPortfolioChange();
    }

    // balance is relayed every minute
    // no need to do it here.

    if (next) {
      next();
    }
  });
}

Trader.prototype.relayPortfolioChange = function () {
  this.deferredEmit('portfolioChange', {
    asset: this.portfolio.asset,
    currency: this.portfolio.currency
  });
}

Trader.prototype.relayPortfolioValueChange = function () {
  this.deferredEmit('portfolioValueChange', {
    balance: this.balance
  });
}

Trader.prototype.setPortfolio = function () {
	  if (first_time) {
		      if(enable_fix_amount)
			      {
			            this.portfolio = {
					            currency: first_currency_buy,
					            asset: first_asset_sell
					          }
			            first_time = false;
			          }
		    }
	  else {
		      this.portfolio = {
			            currency: _.find(
					            this.broker.portfolio.balances,
					            b => b.name === this.brokerConfig.currency
					          ).amount,
			            asset: _.find(
					            this.broker.portfolio.balances,
					            b => b.name === this.brokerConfig.asset
					          ).amount
			          }
		    }
}
Trader.prototype.setPortfolio_bak = function () {
  this.portfolio = {
    currency: _.find(
      this.broker.portfolio.balances,
      b => b.name === this.brokerConfig.currency
    ).amount,
    asset: _.find(
      this.broker.portfolio.balances,
      b => b.name === this.brokerConfig.asset
    ).amount
  }
}

Trader.prototype.setBalance = function () {
  this.balance = this.portfolio.currency + this.portfolio.asset * this.price;
  this.exposure = (this.portfolio.asset * this.price) / this.balance;
  // if more than 10% of balance is in asset we are exposed
  this.exposed = this.exposure > 0.1;
}

Trader.prototype.processCandle = function (candle, done) {
  this.price = candle.close;
  const previousBalance = this.balance;
  this.setPortfolio();
  this.setBalance();

  if (!this.sendInitialPortfolio) {
    this.sendInitialPortfolio = true;
    this.deferredEmit('portfolioChange', {
      asset: this.portfolio.asset,
      currency: this.portfolio.currency
    });
  }

  if (this.balance !== previousBalance) {
    // this can happen because:
    // A) the price moved and we have > 0 asset
    // B) portfolio got changed
    this.relayPortfolioValueChange();
  }

  done();
}
/*tsuperprince START function log for fix amount feature*/
Trader.prototype.log_error_buy = function () {
  return log.info(
    'Wanted to buy but gekko has not sold yet'
  );
};
Trader.prototype.log_error_sell = function () {
  return log.info(
    'Wanted to sell but gekko has not bought yet'
  );
};
/*tsuperprince END function log for fix amount feature*/

Trader.prototype.processAdvice = function (advice) {
  let direction;

  if (advice.recommendation === 'long') {
    direction = 'buy';
  } else if (advice.recommendation === 'short') {
    direction = 'sell';
  } else {
    log.error('ignoring advice in unknown direction');
    return;
  }

  const id = 'trade-' + (++this.propogatedTrades);

  if (this.order) {
    if (this.order.side === direction) {
      return; //log.info('ignoring advice: already in the process to', direction);
    }

    if (this.cancellingOrder) {
      return; //log.info('ignoring advice: already cancelling previous', this.order.side, 'order');
    }

    /*log.info('Received advice to', direction, 'however Gekko is already in the process to', this.order.side);
    log.info('Canceling', this.order.side, 'order first');*/
    return this.cancelOrder(id, advice, () => this.processAdvice(advice));
  }

  let amount;

  if (direction === 'buy') {

/*  if (this.exposed) {
      log.info('NOT buying, already exposed');
      return this.deferredEmit('tradeAborted', {
        id,
        adviceId: advice.id,
        action: direction,
        portfolio: this.portfolio,
        balance: this.balance,
        reason: "Portfolio already in position."
      });
    } */

    amount = this.portfolio.currency / this.price * 0.99;
    /*tsuperprince START calculate amount for fix amount feature*/
    if (enable_fix_amount) {

    amount = this.portfolio.currency / this.price;
      /*if enable for trade with fix amount*/
      /**if advice buy but we want sell first */
      if (amount_bought != 0) {
        log.debug('error:  amount_bought' + amount_bought);
        return this.log_error_buy();
      }
      /*if we have sold in the previous*/
      if (amount_sold != 0) {
        amount_temp = amount_sold / this.price;
        log.info(
          'BUY amount_sold: ',
          amount_sold,
          this.brokerConfig.currency,
          'with',
          amount_temp,
          this.brokerConfig.asset,
        );
      } else if (first_currency_buy != 0) {
        /* this config use when first trade */
        amount_temp = first_currency_buy / this.price;
        first_asset_sell = amount_temp;
        log.info(
          'BUY first_currency_buy: ',
          first_currency_buy,
          this.brokerConfig.currency,
          'with',
          amount_temp,
          this.brokerConfig.asset,
        );
      } else {
        log.debug('error:  no config for first_currency_buy');
        return this.log_error_buy(); /*if not sell and first_currency_buy = 0*/
      }
      if (amount > amount_temp)
        amount = amount_temp;
      amount_bought_temp = amount;
      amount_sold_temp = 0;
    }
    /*tsuperprince END calculate amount for fix amount feature*/

    log.info(
      'Trader',
      'Received advice to go long.',
      'Buying ', this.brokerConfig.asset
    );

  } else if (direction === 'sell') {

/*    if (!this.exposed) {
      log.info('NOT selling, already no exposure');
      return this.deferredEmit('tradeAborted', {
        id,
        adviceId: advice.id,
        action: direction,
        portfolio: this.portfolio,
        balance: this.balance,
        reason: "Portfolio already in position."
      });
    } */

    // clean up potential old stop trigger
    if (this.activeStopTrigger) {
      this.deferredEmit('triggerAborted', {
        id: this.activeStopTrigger.id,
        date: advice.date
      });

      this.activeStopTrigger.instance.cancel();

      delete this.activeStopTrigger;
    }

    amount = this.portfolio.asset;
    /*tsuperprince START calculate amount for fix amount feature*/
    if (enable_fix_amount) {
      /*if enable for trade with fix amount*/
      /* if advice sell but config buy first*/
      if (amount_sold != 0) {
        log.debug('error:  amount_sold' + amount_sold);
        return this.log_error_sell();
      }
      /*if gekko buy in previous */
      if (amount_bought != 0) {
        first_asset_sell = amount_bought;
        amount_temp = amount_bought;
        log.info(
          'SELL amount_bought: ',
          amount_bought,
          this.brokerConfig.asset,
        );
      }
      /* if first time sell*/
      else if (first_asset_sell != 0) {
        log.info(
          'SELL first_asset_sell: ',
          first_asset_sell,
          this.brokerConfig.asset,
        );
        amount_temp = first_asset_sell;
        first_currency_buy = amount_temp * this.price;
      } else {
        log.debug('error:  no config for first_asset_sell');
        return this.log_error_sell(); /*if not sell and first_asset_sell = 0*/
      }
      if (amount > amount_temp)
        amount = amount_temp;
      amount_sold_temp = amount * this.price;
      amount_bought_temp = 0;

    }
    /*tsuperprince END calculate amount for fix amount feature*/
    log.info(
      'Trader',
      'Received advice to go short.',
      'Selling ', this.brokerConfig.asset
    );
  }

  this.createOrder(direction, amount, advice, id);
}

Trader.prototype.createOrder = function (side, amount, advice, id) {
  const type = 'sticky';

  // NOTE: this is the best check we can do at this point
  // with the best price we have. The order won't be actually
  // created with this.price, but it should be close enough to
  // catch non standard errors (lot size, price filter) on
  // exchanges that have them.
  const check = this.broker.isValidOrder(amount, this.price);

  if (!check.valid) {
    // log.warn('NOT creating order! Reason:', check.reason);
    return this.deferredEmit('tradeAborted', {
      id,
      adviceId: advice.id,
      action: side,
      portfolio: this.portfolio,
      balance: this.balance,
      reason: check.reason
    });
  }

  log.debug('Creating order to', side, amount, this.brokerConfig.asset);

  this.deferredEmit('tradeInitiated', {
    id,
    adviceId: advice.id,
    action: side,
    portfolio: this.portfolio,
    balance: this.balance
  });

  this.order = this.broker.createOrder(type, side, amount);

  this.order.on('fill', f => log.info('[ORDER] partial', side, 'fill, total filled:', f));
  //this.order.on('statusChange', s => log.debug('[ORDER] statusChange:', s));

  this.order.on('error', e => {
    //log.error('[ORDER] Gekko received error from GB:', e.message);
    log.debug(e);
    this.order = null;
    this.cancellingOrder = false;

    this.deferredEmit('tradeErrored', {
      id,
      adviceId: advice.id,
      date: moment(),
      reason: e.message
    });

  });
  this.order.on('completed', () => {
    amount_bought = amount_bought_temp;
    amount_sold = amount_sold_temp;
    this.order.createSummary((err, summary) => {
      if (!err && !summary) {
        err = new Error('GB returned an empty summary.')
      }

      if (err) {
        //log.error('Error while creating summary:', err);
        return this.deferredEmit('tradeErrored', {
          id,
          adviceId: advice.id,
          date: moment(),
          reason: err.message
        });
      }

      log.info('[ORDER] summary:', summary);
      this.order = null;
      this.sync(() => {

        let cost;
        if (_.isNumber(summary.feePercent)) {
          cost = summary.feePercent / 100 * summary.amount * summary.price;
        }

        let effectivePrice;
        if (_.isNumber(summary.feePercent)) {
          if (side === 'buy') {
            effectivePrice = summary.price * (1 + summary.feePercent / 100);
          } else {
            effectivePrice = summary.price * (1 - summary.feePercent / 100);
          }
        } else {
          //log.warn('WARNING: exchange did not provide fee information, assuming no fees..');
          effectivePrice = summary.price;
        }

        this.deferredEmit('tradeCompleted', {
          id,
          adviceId: advice.id,
          action: summary.side,
          cost,
          amount: summary.amount,
          price: summary.price,
          portfolio: this.portfolio,
          balance: this.balance,
          date: summary.date,
          feePercent: summary.feePercent,
          effectivePrice
        });

        if (
          side === 'buy' &&
          advice.trigger &&
          advice.trigger.type === 'trailingStop'
        ) {
          const trigger = advice.trigger;
          const triggerId = 'trigger-' + (++this.propogatedTriggers);

          this.deferredEmit('triggerCreated', {
            id: triggerId,
            at: advice.date,
            type: 'trailingStop',
            properties: {
              trail: trigger.trailValue,
              initialPrice: summary.price,
            }
          });

          //   log.info(`Creating trailingStop trigger "${triggerId}"! Properties:`);
          //  log.info(`\tInitial price: ${summary.price}`);
          //  log.info(`\tTrail of: ${trigger.trailValue}`);

          this.activeStopTrigger = {
            id: triggerId,
            adviceId: advice.id,
            instance: this.broker.createTrigger({
              type: 'trailingStop',
              onTrigger: this.onStopTrigger,
              props: {
                trail: trigger.trailValue,
                initialPrice: summary.price,
              }
            })
          }
        }
      });
    })
  });
}

Trader.prototype.onStopTrigger = function (price) {
  log.info(`TrailingStop trigger "${this.activeStopTrigger.id}" fired! Observed price was ${price}`);

  this.deferredEmit('triggerFired', {
    id: this.activeStopTrigger.id,
    date: moment()
  });

  const adviceMock = {
    recommendation: 'short',
    id: this.activeStopTrigger.adviceId
  }

  delete this.activeStopTrigger;

  this.processAdvice(adviceMock);
}

Trader.prototype.cancelOrder = function (id, advice, next) {

  if (!this.order) {
    return next();
  }

  this.cancellingOrder = true;

  this.order.removeAllListeners();
  this.order.cancel();
  this.order.once('completed', () => {
    this.order = null;
    this.cancellingOrder = false;
    this.deferredEmit('tradeCancelled', {
      id,
      adviceId: advice.id,
      date: moment()
    });
    this.sync(next);
  });
}

module.exports = Trader;

