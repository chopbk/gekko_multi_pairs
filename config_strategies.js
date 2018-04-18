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
  stoploss_enabled: false,
  stoploss_threshold: 0.85,
  hodl_threshold: 1,
  price_buffer_len: 100,
  min_predictions: 1000
};
