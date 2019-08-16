const emojis = [
  "👌🏿",
  "👌🏾",
  "👌🏽",
  "👌🏼",
  "👌🏻"
];

const config = {
  size: 1000,
  elementSize: 10,
  elementCount: emojis.length - 1,
  backgroundColor: 'green',
  get lineCount() {
    return Math.floor(this.size / this.elementSize);
  }
};

function calcGreyArr(imageData) {
  let arr = [];
  for (let i = 0; i < imageData.data.length; i+=4) {
    arr.push((imageData.data[i]*0.3 + imageData.data[i+1]*0.59 + imageData.data[i+2]*0.11)/255)
  }
  return arr;
}

function calcIndexArr(imageData) {
  const greyArr = calcGreyArr(imageData);
  console.log(greyArr.length);
  const indexArr = [];
  for (let y = 0; y < Math.sqrt(greyArr.length); y += config.elementSize) {
    for (let x = 0; x < Math.sqrt(greyArr.length); x+=config.elementSize) {
      let sum = 0;
      for (let i = 0; i < config.elementSize; i++) {
        for (let j = 0; j < config.elementSize; j++) {
        
          sum += greyArr[x + (y*Math.sqrt(greyArr.length)) + i + (j*Math.sqrt(greyArr.length))]
        }
      }
      indexArr.push(Math.round(sum/(config.elementSize**2)/(1/config.elementCount)));
    }
  }
  console.log(indexArr);
  return indexArr
}

function drawImage(indexArr, ctx) {
  console.log(indexArr.length);
  for(let i = 0; i < indexArr.length; i++) {
    drawEmoji(i, ctx, indexArr)
    // drawGreyPixel(i, ctx, indexArr)
  }
  
}

function drawGreyPixel(i, ctx, arr) {
 ctx.fillStyle = colors[arr[i]];
 ctx.fillRect(
   Math.floor(i%config.lineCount)*config.elementSize,
   Math.floor(i/config.lineCount)*config.elementSize,
   config.size,
   config.size
 )
}

function drawEmoji(i, ctx, arr) {
  ctx.font = `${config.elementSize}px Arial`;
  ctx.fillText(
    emojis[arr[i]],
    Math.floor(i%config.lineCount)*config.elementSize,
    Math.floor(i/config.lineCount)*(config.elementSize)
  );
}

function render(imageData) {
  const c = document.createElement('canvas');
  c.style.width = '100vmin';
  c.style.height = '100vmin';
  c.width = config.size;
  c.height = config.size;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  ctx.fillStyle = config.backgroundColor;
  const greyIndexArr = calcIndexArr(imageData);
  drawImage(greyIndexArr, ctx)
}

document.querySelector('button').addEventListener('click', async () => {
  try {
    const f = document.querySelector('input').files[0];
    console.log(f);
    const buffer = await new Response(f).arrayBuffer();
    const type = f.name.endsWith(".png") ? "png" : "jpeg";
    const blob = new Blob([buffer], {type: `image/${type}`});
    const bitmap = await createImageBitmap(blob);
    const imagedata = toImageData(bitmap);
    render(imagedata)
    
  } catch(e) {
    console.error(e);
  }
});

function toImageData(bitmap) {
  const c = document.createElement('canvas');
  c.width = config.size;
  c.height = config.size;
  const ctx = c.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, config.size, config.size);
  
  return ctx.getImageData(0, 0, config.size, config.size);
}
