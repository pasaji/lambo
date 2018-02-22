const { RSI, SMA } = require('technicalindicators');



var prices = [1,2,3,4,5,6,7,8,9,10,12,13,15];
var period = 10;
var sma = new SMA({period : period, values : []});
var results = [];

prices.forEach(price => {
  var result = sma.nextValue(price);
  console.log(price, result);
  if(result)
    results.push(result)
});


var rsi = new RSI({period : 14, values : []});

var price = 200;

for (var i = 0; i < 100; i++) {
  var price =+ (Math.random() - 0.6)
  console.log((rsi.nextValue(price) || null));
}
