onmessage = function(e) {
  const [arr, config] = e.data;
  const calcArr = calcIndexArr(arr, config)
  postMessage(calcArr)
};

function calcIndexArr(imageData, config) {
  const greyArr = calcGreyArr(imageData);
  const { elementSize, elementCount, size } = config;
  const indexArr = [];
  let pointer = 0;
  let xLinePosition = 0;
  const blockLineCount = size*elementSize;
  while(pointer < greyArr.length) {
    let sum = 0;
    for (let i = 0; i < elementSize; i++) {
      for (let j = 0; j < elementSize; j++) {
        sum += greyArr[pointer + j + (size*i)]
      }
    }
    indexArr.push(Math.round(sum/(elementSize**2)/(1/elementCount)));
    if (xLinePosition >= (size/elementSize) - 1) {
      pointer += blockLineCount - (size - elementSize);
      xLinePosition = 0;
    } else {
      pointer += elementSize;
      xLinePosition++;
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
