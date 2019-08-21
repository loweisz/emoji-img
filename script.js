const config = {
  size: 1000,
  elementSize: 10,
  get lineCount() {
    return Math.ceil(this.size / this.elementSize);
  },
  skins: [
    "🏿",
    "🏾",
    "🏽",
    "🏼",
    "🏻"
  ],
  emojis = {
    one: "👐",
    two: "🙌",
    three: "👏",
    four: "👍",
    five: "🤘",
  },
  get elementCount() {
    return this.skins.length - 1
  },
};

function drawImage(indexArr, ctx, emoji) {
  for(let i = 0; i < indexArr.length; i++) {
    const emojiText = `${emoji}${config.skins[indexArr[i]]}`;
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
  const ctx = c.getContext('2d');
  const worker = new Worker('worker.js');
  worker.postMessage([imageData, config]);
  worker.onmessage = function(e) {
    drawImage(e.data, ctx, emoji)
  };
}

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const f = document.querySelector('input').files[0];
    const buffer = await new Response(f).arrayBuffer();
    const type = f.name.endsWith(".png") ? "png" : "jpeg";
    const blob = new Blob([buffer], {type: `image/${type}`});
    const bitmap = await createImageBitmap(blob);
    const imageData = toImageData(bitmap);
    const selectedEmoji = config.emojis[document.querySelector('select').value] || config.emojis[0];
    const num = document.getElementById('num').value;
    if (num && num < 1000 && num > 0) {
      config.elementSize = Math.ceil(config.size / num);
    }
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
