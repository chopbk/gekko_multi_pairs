nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_BTC.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_BNB.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_ETH.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_NEO.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_TRX.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_BNB.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_ETH.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_XRP.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_ADA.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_EOS.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_ELF.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_NCASH.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_STORM.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_TNB.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_XVG.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_IOST.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runBTC_BCC.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_BTC2.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runUSDT_BTC_neural.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/gekko_multi_pairs/run/runNeural_BTC_BNB.sh > /dev/null 2>&1 &
nohup /home/dinhtam94/0.work/zuki/gekko_multi_pairs/run/runETH_EOS.sh > /dev/null 2>&1 &




nohup node gekko --config TRX_BTC.js  >   result_trade/trx_btc.txt 2> /dev/null &
nohup node gekko --config BTC_USDT_BBRSI_10.js  >   result_trade/btc_usdt_bbrsi.txt 2> /dev/null &
nohup node gekko --config BTC_USDT_NNV2.js  >   result_trade/btc_usdt_nnv2.txt 2> /dev/null &
nohup node gekko --config BTC_USDT_NEO.js  >   result_trade/btc_usdt_neo.txt 2> /dev/null &