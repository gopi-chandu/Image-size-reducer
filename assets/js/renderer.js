const path = require("path");
const os = require("os");
const { ipcRenderer } = require("electron");

const form = document.getElementById("image-form");
const slider = document.getElementById("slider");
const img = document.getElementById("img");

document.getElementById("output-path").innerText = path.join(
  os.homedir(),
  "low-Size-Images"
);

// events - on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // only in electron we can get file path
  const imgPath = img.files[0].path;
  const quality = slider.value;

  console.log(imgPath, quality);

  ipcRenderer.send("image-minimize", {
    imgPath: imgPath,
    quality: quality,
  });
});

