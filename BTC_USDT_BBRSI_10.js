var config = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                          GENERAL SETTINGS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.debug = true; // for additional logging / debugging

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                         WATCHING A MARKET
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.watch = {

  // see https://gekko.wizb.it/docs/introduction/supported_exchanges.html
  exchange: 'binance',
  currency: 'USDT',
  asset: 'BTC',
  enable_fix_amount: true,
  max_amount_currency_buy: 0,
  max_amount_asset_sell: 0.003,
  // You can set your own tickrate (refresh rate).
  // If you don't set it, the defaults are 2 sec for
  // okcoin and 20 sec for all other exchanges.
  // tickrate: 20
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING TRADING ADVICE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.tradingAdvisor = {
  enabled: true,
  method: 'BBRSI',
  candleSize: 10,
  historySize: 16,
  adapter: 'sqlite'
}
config.gforms = {
  enabled: true,
  botTag: 'btc_usdt_bbrsi', //Add a custom tag here. This will be included in the name of the spreadsheet tab for this bot.
  // Get a prefilled link of your google for, each question answered with a single space and paste here.
  // It should resemble: https://docs.google.com/forms/d/e/1FAIp-My-Form-ID-K6PaOg3bPLg/viewform?usp=pp_url&entry.852051357=+&entry.1346916648=+&entry.1743858251=+&entry.105864059=+&entry.68010386=+&entry.3616735=+&entry.1463011579=+&entry.433943481=+&entry.620326103=+&entry.1202282384=+&entry.1415514787=+
  prefill: 'https://docs.google.com/forms/d/e/1FAIpQLSfZ_tIHuR3bZk7rtoOsP19Z4G7pzMIVokPjjLtprqYEL-vNew/viewform?usp=pp_url&entry.844370847=+&entry.1283504820=+&entry.1362807661=+&entry.821554856=+&entry.1419081390=+&entry.1130305640=+&entry.944005728=+&entry.1281633778=+&entry.774419284=+&entry.1710928960=+&entry.1153600456=+',
};
config.BBRSI = {
  interval : 14,

  thresholds: {
  low : 40,
  high : 40,
  persistence : 9,
  },
  bbands : {
  TimePeriod : 20,
  NbDevUp : 2,
  NbDevDn : 2,
  }
}

config.BitBankStrategy = {
  apiKey : "1AjN4AyhVgKCLLH7eWiu6H4AHDpxcNXmKK",
  pair : "USDT_BTC",
  maxFeatureSetAgeInSeconds : 60,
  candlePeriodInMinutes : 1
}
config.RsiStopLoss = {
  interval: 14,
  thresholds: {
    low: 30,
    high: 70,
    persistence: 1,
  },
  stoploss: {
    loss: 5,
    gain: 8,
    progressive: true,
    progressivegain: 2
  }
}
config.RSI_BB_ADX_Peak = {
  SMA_long: 1000,
  SMA_short: 50,
  BULL_RSI: 10,
  BULL_RSI_high: 80,
  BULL_RSI_low: 60,
  BEAR_RSI: 15,
  BEAR_RSI_high: 50,
  BEAR_RSI_low: 20,
  BULL_MOD_high: 5,
  BULL_MOD_low: -5,
  BEAR_MOD_high: 15,
  BEAR_MOD_low: -5,
  ADX: 3,
  ADX_high: 70,
  ADX_low: 50,
}
config.NEO = {
  SMA_long: 150,
  SMA_short: 40,
  BULL_RSI: 10,
  BULL_RSI_high: 80,
  BULL_RSI_low: 50,
  IDLE_RSI: 12,
  IDLE_RSI_high: 65,
  IDLE_RSI_low: 39,
  BEAR_RSI: 15,
  BEAR_RSI_high: 50,
  BEAR_RSI_low: 25,
  ROC: 6,
  ROC_lvl: 0
}
config.RSI_Bull_Bear_Adx_Stop = {
  SMA_long: 1000,
  SMA_short: 50,
  BULL_RSI: 10,
  BULL_RSI_high: 80,
  BULL_RSI_low: 60,
  BEAR_RSI: 15,
  BEAR_RSI_high: 50,
  BEAR_RSI_low: 20,
  BULL_MOD_high: 5,
  BULL_MOD_low: -5,
  BEAR_MOD_high: 15,
  BEAR_MOD_low: -5,
  ADX: 3,
  ADX_high: 70,
  ADX_low: 50,
  Stop_Loss_Percent: 75
}
config.neuralnet = {
  threshold_buy: 1.0, // the treshold for buying into a currency. e.g.: The predicted price is 1% above the current candle.close
  threshold_sell: -1.0, // the treshold for selling a currency. e.g.: The predicted price is 1% under the current candle.close
  method: 'adadelta',
  price_buffer_len: 100, // The length of the candle.close price buffer. It's used to train the network on every update cycle.
  learning_rate: 1.2, // The learning rate of net
  momentum: 0.9, // learning speed
  decay: 0.10,
  min_predictions: 600, //minimum number of predictions until the network is considered 'trained'. History size should be equal
  hodl_threshold: 1, //enables stoploss function
  stoploss_enabled: false, //trigger stoploss 5% under last buyprice
  stoploss_threshold: 0.9, // Exponential Moving Averages settings:
};
config.neuralnet1 = {
  threshold_buy: 1.0, // the treshold for buying into a currency. e.g.: The predicted price is 1% above the current candle.close
  threshold_sell: -1.0, // the treshold for selling a currency. e.g.: The predicted price is 1% under the current candle.close
  method: 'adadelta',
  price_buffer_len: 100, // The length of the candle.close price buffer. It's used to train the network on every update cycle.
  learning_rate: 1.2, // The learning rate of net
  momentum: 0.9, // learning speed
  decay: 0.10,
  min_predictions: 600, //minimum number of predictions until the network is considered 'trained'. History size should be equal
  hodl_threshold: 1, //enables stoploss function
  stoploss_enabled: false, //trigger stoploss 5% under last buyprice
  stoploss_threshold: 0.9, // Exponential Moving Averages settings:
};
config.neuralnet_v2 = {
  threshold_buy: 1.0, // the treshold for buying into a currency. e.g.: The predicted price is 1% above the current candle.close
  threshold_sell: -1.0, // the treshold for selling a currency. e.g.: The predicted price is 1% under the current candle.close
  price_buffer_len: 100, // The length of the candle.close price buffer. It's used to train the network on every update cycle.
  learning_rate: 0.01, // The learning rate of net
  momentum: 0.1, // learning speed
  decay: 0.01,
  min_predictions: 1000, //minimum number of predictions until the network is considered 'trained'. History size should be equal
  hodl_threshold: 1, //enables stoploss function
  stoploss_enabled: false, //trigger stoploss 5% under last buyprice
  stoploss_threshold: 0.9, // Exponential Moving Averages settings:
};
config.RSI_BULL_BEAR = {
  SMA_long: 800, // SMA Trends
  SMA_short: 40,
  BULL_RSI: 10, // BULL
  BULL_RSI_high: 80,
  BULL_RSI_low: 50,
  BEAR_RSI: 15, // BEAR
  BEAR_RSI_high: 50,
  BEAR_RSI_low: 25
}
config.RSI_BULL_BEAR_ADX = {
  SMA_long: 1000, //# SMA INDICATOR
  SMA_short: 50,
  BULL_RSI: 10, //# RSI BULL / BEAR
  BULL_RSI_high: 80,
  BULL_RSI_low: 60,
  BEAR_RSI: 15,
  BEAR_RSI_high: 50,
  BEAR_RSI_low: 20,
  BULL_MOD_high: 5, //# MODIFY RSI (depending on ADX)
  BULL_MOD_low: -5,
  BEAR_MOD_high: 15,
  BEAR_MOD_low: -5,
  ADX: 3, //# ADX
  ADX_high: 70,
  ADX_low: 50,
}
config.ThreeCandles = {
  number_of_candles: 3,
  stoploss_threshold: 0.85
}
config.filewriter = {
  nnfilepath: "result_trade"
}; //encure you have created gekko/nn_files folder
config.zuki_nn = {
  threshold_buy: 1.0,
  threshold_sell: -1.0,
  learning_rate: 0.01,
  momentum: 0.1,
  decay: 0.01,
  stoploss_enabled: true,
  stoploss_threshold: 0.9,
  hodl_threshold: 1,
  price_buffer_len: 100,
  min_predictions: 1000
};

// Exponential Moving Averages settings:
config.DEMA = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 10,
  long: 21,
  // amount of candles to remember and base initial EMAs on
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025
  }
};
// RSI settings:
config.RSI = {
  interval: 2,
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 10
  }
};
// MACD settings:
config.MACD = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 10,
  long: 21,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// PPO settings:
config.PPO = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 12,
  long: 26,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2
  }
};

// Uses one of the momentum indicators but adjusts the thresholds when PPO is bullish or bearish
// Uses settings from the ppo and momentum indicator config block
config.varPPO = {
  momentum: 'TSI', // RSI, TSI or UO
  thresholds: {
    // new threshold is default threshold + PPOhist * PPOweight
    weightLow: 120,
    weightHigh: -120,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 0
  }
};



// TSI settings:
config.TSI = {
  short: 13,
  long: 25,
  thresholds: {
    low: -25,
    high: 25,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// Ultimate Oscillator Settings
config.UO = {
  first: {weight: 4, period: 7},
  second: {weight: 2, period: 14},
  third: {weight: 1, period: 28},
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// CCI Settings
config.CCI = {
    constant: 0.015, // constant multiplier. 0.015 gets to around 70% fit
    history: 90, // history size, make same or smaller than history
    thresholds: {
        up: 100, // fixed values for overbuy upward trajectory
        down: -100, // fixed value for downward trajectory
        persistence: 0 // filter spikes by adding extra filters candles
    }
};

// StochRSI settings
config.StochRSI = {
  interval: 3,
  thresholds: {
    low: 20,
    high: 80,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 3
  }
};
// StochRSI_MACD_BB Settings
config.StochRSI_MACD_BB = {
  interval: 14,
  short: 12,
  long: 26,
  signal: 9, 
  bbands: {
    TimePeriod: 20,
    NbDevDn: 2,
    NbDevUp: 2,
    persistence_upper: 10,
    persistence_lower: 10,  
  }, 
  thresholds: {
    low: 20,
    high: 80,
    down: -0.1,//-2,//-0.1,
    up: 0.1,//1.5,//0.25,   
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2
  }
};

// custom settings:
config.custom = {
  my_custom_setting: 10,
}

config['talib-macd'] = {
  parameters: {
    optInFastPeriod: 10,
    optInSlowPeriod: 21,
    optInSignalPeriod: 9
  },
  thresholds: {
    down: -0.025,
    up: 0.025,
  }
}
// Uses one of the momentum indicators but adjusts the thresholds when PPO is bullish or bearish
// Uses settings from the ppo and momentum indicator config block
 config.customPPO = {
  momentum: 'TSI', // RSI, TSI or UO
  thresholds: {
    // new threshold is default threshold + PPOhist * PPOweight
    weightLow: 120,
    weightHigh: -120,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 0
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// do you want Gekko to simulate the profit of the strategy's own advice?
config.paperTrader = {
  enabled: false,
  // report the profit in the currency or the asset?
  reportInCurrency: true,
  // start balance, on what the current balance is compared with
  simulationBalance: {
    // these are in the unit types configured in the watcher.
    asset: 1,
    currency: 100,
  },
  // how much fee in % does each trade cost?
  feeMaker: 0.05,
  feeTaker: 0.25,
  feeUsing: 'maker',
  // how much slippage/spread should Gekko assume per trade?
  slippage: 0.05,
}
config.stop = {
  enabled: true,
  loss: 0.1
}
config.performanceAnalyzer = {
  enabled: true,
  riskFreeReturn: 5
}

// Want Gekko to perform real trades on buy or sell advice?
// Enabling this will activate trades for the market being
// watched by `config.watch`.
config.trader = {
  enabled: true,
  key: 'CAJi88utpzutsVLDilCGlVOmk03CspJhopQmlRIrYU6S6QygSr2xlrHPUa0xeuC6',
  secret: 'Pk30gRT8Z7tq6uCLerrBPNNF4uzk9IQd9Bk6Mdyj2inMGp5KULKc0PgxL6UPGAnJ',
  username: 'chopbk', // your username, only required for specific exchanges.
  passphrase: '' // GDAX, requires a passphrase.
}

config.adviceLogger = {
  enabled: true,
  muteSoft: true // disable advice printout if it's soft
}

config.pushover = {
  enabled: false,
  sendPushoverOnStart: false,
  muteSoft: true, // disable advice printout if it's soft
  tag: '[GEKKO]',
  key: '',
  user: ''
}

// want Gekko to send a mail on buy or sell advice?
config.mailer = {
  enabled: false,       // Send Emails if true, false to turn off
  sendMailOnStart: true,    // Send 'Gekko starting' message if true, not if false

  email: '',    // Your Gmail address
  muteSoft: true, // disable advice printout if it's soft

  // You don't have to set your password here, if you leave it blank we will ask it
  // when Gekko's starts.
  //
  // NOTE: Gekko is an open source project < https://github.com/askmike/gekko >,
  // make sure you looked at the code or trust the maintainer of this bot when you
  // fill in your email and password.
  //
  // WARNING: If you have NOT downloaded Gekko from the github page above we CANNOT
  // guarantuee that your email address & password are safe!

  password: '',       // Your Gmail Password - if not supplied Gekko will prompt on startup.

  tag: '[GEKKO] ',      // Prefix all email subject lines with this

            //       ADVANCED MAIL SETTINGS
            // you can leave those as is if you
            // just want to use Gmail

  server: 'smtp.gmail.com',   // The name of YOUR outbound (SMTP) mail server.
  smtpauth: true,     // Does SMTP server require authentication (true for Gmail)
          // The following 3 values default to the Email (above) if left blank
  user: '',       // Your Email server user name - usually your full Email address 'me@mydomain.com'
  from: '',       // 'me@mydomain.com'
  to: '',       // 'me@somedomain.com, me@someotherdomain.com'
  ssl: true,        // Use SSL (true for Gmail)
  port: '',       // Set if you don't want to use the default port
}

config.pushbullet = {
    // sends pushbullets if true
  enabled: false,
    // Send 'Gekko starting' message if true
  sendMessageOnStart: true,
    // disable advice printout if it's soft
  muteSoft: true,
    // your pushbullet API key
  key: 'xxx',
    // your email, change it unless you are Azor Ahai
  email: 'jon_snow@westeros.org',
    // will make Gekko messages start mit [GEKKO]
  tag: '[GEKKO]'
};

config.kodi = {
  // if you have a username & pass, add it like below
  // http://user:pass@ip-or-hostname:8080/jsonrpc
  host: 'http://ip-or-hostname:8080/jsonrpc',
  enabled: false,
  sendMessageOnStart: true,
}

config.ircbot = {
  enabled: false,
  emitUpdates: false,
  muteSoft: true,
  channel: '#your-channel',
  server: 'irc.freenode.net',
  botName: 'gekkobot'
}

config.telegrambot = {
  enabled: true,
  emitUpdates: true,
  token: '473634383:AAEeFVnuVO0hebqVoaPKfRiO1mcuhaEGXcE',
  botName: 'Tamdaicabot'
}

config.twitter = {
    // sends pushbullets if true
  enabled: false,
    // Send 'Gekko starting' message if true
  sendMessageOnStart: false,
    // disable advice printout if it's soft
  muteSoft: false,
  tag: '[GEKKO]',
    // twitter consumer key
  consumer_key: '',
    // twitter consumer secret
  consumer_secret: '',
    // twitter access token key
  access_token_key: '',
    // twitter access token secret
  access_token_secret: ''
};

config.xmppbot = {
  enabled: false,
  emitUpdates: false,
  client_id: 'jabber_id',
  client_pwd: 'jabber_pw',
  client_host: 'jabber_server',
  client_port: 5222,
  status_msg: 'I\'m online',
  receiver: 'jabber_id_for_updates'
}

config.campfire = {
  enabled: false,
  emitUpdates: false,
  nickname: 'Gordon',
  roomId: null,
  apiKey: '',
  account: ''
}

config.redisBeacon = {
  enabled: false,
  port: 6379, // redis default
  host: '127.0.0.1', // localhost
    // On default Gekko broadcasts
    // events in the channel with
    // the name of the event, set
    // an optional prefix to the
    // channel name.
  channelPrefix: '',
  broadcast: [
    'candle'
  ]
}

config.slack = {
  enabled: false,
  token: '',
  sendMessageOnStart: true,
  muteSoft: true,
  channel: '' // #tradebot
}

config.ifttt = {
  enabled: false,
  eventName: 'gekko',
  makerKey: '',
  muteSoft: true,
  sendMessageOnStart: true
}

config.candleWriter = {
  enabled: false
}

config.adviceWriter = {
  enabled: false,
  muteSoft: true,
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING ADAPTER
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.adapter = 'sqlite';

config.sqlite = {
  path: 'plugins/sqlite',

  dataDirectory: 'history',
  version: 0.1,

  journalMode: require('./web/isWindows.js') ? 'DELETE' : 'WAL',

  dependencies: []
}

  // Postgres adapter example config (please note: requires postgres >= 9.5):
config.postgresql = {
  path: 'plugins/postgresql',
  version: 0.1,
  connectionString: 'postgres://user:pass@localhost:5432', // if default port
  database: null, // if set, we'll put all tables into a single database.
  schema: 'public',
  dependencies: [{
    module: 'pg',
    version: '6.1.0'
  }]
}

// Mongodb adapter, requires mongodb >= 3.3 (no version earlier tested)
config.mongodb = {
  path: 'plugins/mongodb',
  version: 0.1,
  connectionString: 'mongodb://mongodb/gekko', // connection to mongodb server
  dependencies: [{
    module: 'mongojs',
    version: '2.4.0'
  }]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING BACKTESTING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Note that these settings are only used in backtesting mode, see here:
// @link: https://gekko.wizb.it/docs/commandline/backtesting.html

config.backtest = {
  daterange: 'scan',
  batchSize: 50
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING IMPORTING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.importer = {
  daterange: {
    // NOTE: these dates are in UTC
    from: "2018-01-15 00:00:00"
  }
}

// set this to true if you understand that Gekko will
// invest according to how you configured the indicators.
// None of the advice in the output is Gekko telling you
// to take a certain position. Instead it is the result
// of running the indicators you configured automatically.
//
// In other words: Gekko automates your trading strategies,
// it doesn't advice on itself, only set to true if you truly
// understand this.
//
// Not sure? Read this first: https://github.com/askmike/gekko/issues/201
config['I understand that Gekko only automates MY OWN trading strategies'] = true;

module.exports = config;
