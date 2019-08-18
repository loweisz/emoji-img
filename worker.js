onmessage = function(e) {
  const [arr, config] = e.data;
  const calcArr = calcIndexArr(arr, config)
  postMessage(calcArr)
};

function calcIndexArr(imageData, config) {
  const greyArr = calcGreyArr(imageData);
  const { elementSize, elementCount } = config;
  const sqrtArr = Math.floor(Math.sqrt(greyArr.length));
  const indexArr = [];
  for (let y = 0; y < sqrtArr; y += elementSize) {
    for (let x = 0; x < sqrtArr; x+= elementSize) {
      let sum = 0;
      for (let i = 0; i < elementSize; i++) {
        for (let j = 0; j < elementSize; j++) {
          sum += greyArr[x + (y*sqrtArr) + i + (j*sqrtArr)]
        }
      }
      indexArr.push(Math.round(sum/(elementSize**2)/(1/elementCount)));
    }
  }
  return indexArr
}

function calcGreyArr(imageData) {
  let arr = [];
  for (let i = 0; i < imageData.data.length; i+=4) {
    arr.push((imageData.data[i]*0.3 + imageData.data[i+1]*0.59 + imageData.data[i+2]*0.11)/255)
  }
  return arr;
}
