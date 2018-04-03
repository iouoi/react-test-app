import {Decimal} from 'decimal.js';

const colorCache = {}

export default function formatTimelineData(data) {

  let stack = [0]
  let lastEndTime;
  let result = []

  for (var i = 0; i < data.length; i++) {
    let datum = { name: data[i].name, startTime:data[i].startTime, duration:data[i].duration, line:null };
    if (!colorCache[i]) colorCache[i] = Math.random()*.3;
    datum["color"] = colorCache[i]
    while (data[i].startTime >= stack[stack.length-1] && stack.length >= 0){
      stack.pop();
    }
  
    datum["line"] = -stack.length-1;
    result.push(datum);
    let ST = new Decimal(data[i].startTime)
    let dur = new Decimal(data[i].duration)
    lastEndTime = ST.plus(dur);
    stack.push(lastEndTime)

  }
  return result;
};