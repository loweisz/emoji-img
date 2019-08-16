const emojis = {
  one: "👐",
  two: "🙌",
  three: "👏",
  four: "👍",
  five: "🤘",
};

const skins = [
  "🏿",
  "🏾",
  "🏽",
  "🏼",
  "🏻"
];

const config = {
  size: 1000,
  elementSize: 10,
  elementCount: skins.length - 1,
  backgroundColor: 'black',
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
  const { elementSize, elementCount } = config;
  const indexArr = [];
  for (let y = 0; y < Math.sqrt(greyArr.length); y += elementSize) {
    for (let x = 0; x < Math.sqrt(greyArr.length); x+= elementSize) {
      let sum = 0;
      for (let i = 0; i < elementSize; i++) {
        for (let j = 0; j < elementSize; j++) {
          sum += greyArr[x + (y*Math.sqrt(greyArr.length)) + i + (j*Math.sqrt(greyArr.length))]
        }
      }
      indexArr.push(Math.round(sum/(elementSize**2)/(1/elementCount)));
    }
  }
  return indexArr
}

function drawImage(indexArr, ctx, emoji) {
  for(let i = 0; i < indexArr.length; i++) {
    const emojiText = `${emoji}${skins[indexArr[i]]}`;
    ctx.font = `${config.elementSize}px Arial`;
    ctx.fillText(
      emojiText,
      Math.floor(i%config.lineCount)*config.elementSize,
      Math.floor(i/config.lineCount)*config.elementSize
    );
  }
}

function render(imageData, emoji) {
  const c = document.getElementById('screen');
  c.style.width = '100vmin';
  c.style.height = '100vmin';
  c.width = config.size;
  c.height = config.size;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  ctx.fillStyle = config.backgroundColor;
  const greyIndexArr = calcIndexArr(imageData);
  drawImage(greyIndexArr, ctx, emoji)
}

document.querySelector('button').addEventListener('click', async () => {
  try {
    const f = document.querySelector('input').files[0];
    const buffer = await new Response(f).arrayBuffer();
    const type = f.name.endsWith(".png") ? "png" : "jpeg";
    const blob = new Blob([buffer], {type: `image/${type}`});
    const bitmap = await createImageBitmap(blob);
    const imageData = toImageData(bitmap);
    const selectedEmoji = emojis[document.querySelector('select').value] || emojis[0];
    const num = document.getElementById('num').value;
    if (num && num < 1000 && num > 0) {
      config.elementSize = Math.floor(config.size / num)
    }
    console.log(config.elementSize);
    render(imageData, selectedEmoji)
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
