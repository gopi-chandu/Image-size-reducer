// destructuring electron, app manages life cycle of the app, browser windows is the os browser window
const { app, BrowserWindow } = require("electron");

console.log("Hello world");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Size Reducer",
    center: true,
    width: 500,
    height: 600,
  });

  //   mainWindow.loadURL("https://google.com");
  //   mainWindow.loadFile()
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}

app.on("ready", createMainWindow);
