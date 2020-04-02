const emojis = {
  one: "👐",
  two: "🙌",
  three: "👏",
  four: "👍",
  five: "🤘",
  six: "👊",
  seven: "✊",
  eight: "👌",
  nine: "🤲",
  ten: "🖕"
};

const skins = ["🏿", "🏾", "🏽", "🏼", "🏻"];

const config = {
  size: 1000,
  elementSize: 10,
  elementCount: skins.length - 1,
  get lineCount() {
    return Math.ceil(this.size / this.elementSize);
  }
};

function drawImage(indexArr, ctx, emoji) {
  for (const [i, v] of indexArr.entries()) {
    ctx.fillText(
      `${emoji}${skins[v || 0]}`,
      Math.floor(i % config.lineCount) * config.elementSize,
      Math.floor(i / config.lineCount) * config.elementSize
    );
  }
}

function render(imageData, emoji) {
  const c = document.getElementById("screen");
  c.style = {
    ...c.style,
    width: "100vmin",
    height: "100vmin"
  };
  c.width = config.size;
  c.height = config.size;
  const worker = new Worker("worker.js");
  worker.postMessage([imageData, config]);
  // calculate the emojis
  worker.onmessage = function(e) {
    drawImage(e.data, c.getContext("2d"), emoji);
  };
}

function toImageData(bitmap) {
  const c = document.createElement("canvas");
  c.width = config.size;
  c.height = config.size;
  const ctx = c.getContext("2d");
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    config.size,
    config.size
  );
  return ctx.getImageData(0, 0, config.size, config.size);
}

async function onSubmit(e) {
  e.preventDefault();
  try {
    // Overwrite the emoji count
    const num = e.target.elements.num.value;
    if (num && num < 1000 && num > 0) {
      config.elementSize = Math.ceil(config.size / num);
    }
    // Read File
    const fileReader = e.target.elements.file.files[0];
    const buffer = await new Response(fileReader).arrayBuffer();
    const type = fileReader.name.endsWith(".png") ? "png" : "jpeg";
    const blob = new Blob([buffer], { type: `image/${type}` });
    const bitmap = await createImageBitmap(blob);
    // Get selected emoji
    const emojiValue = e.target.elements.emojis.value;
    render(toImageData(bitmap), emojis[emojiValue] || emojis[0]);
  } catch (e) {
    console.error(e);
  }
}

document.querySelector("form").addEventListener("submit", onSubmit);
