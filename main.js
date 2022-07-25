// destructuring electron, app manages life cycle of the app, browser windows is the os browser window
const path = require("path");
const os = require("os");
const electron = require("electron");
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  ipcRenderer,
} = require("electron");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const slash = require("slash");
const { default: imageminPngquant } = require("imagemin-pngquant");
console.log("Hello world");

// set environment
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV != "production" ? true : false;
const isWindows = process.platform == "win32" ? true : false;
const isMac = process.platform == "darwin" ? true : false;

let mainWindow;
let aboutWindow;

console.log(process.platform);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Size Reducer",
    center: true,
    width: isDev ? 700 : 500,
    height: 600,
    icon: "./assets/icons/icon256.png",
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  //   mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.loadFile("./app/index.html");
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Size Reducer",
    width: 300,
    height: 300,
    icon: "./assets/icons/icon256.png",
    resizable: false,
    backgroundColor: "white",
  });

  //   mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  aboutWindow.loadFile("./app/about.html");
}

app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  //   globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  //   globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () =>
  //     mainWindow.toggleDevTools()
  //   );
  mainWindow.on("ready", () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
    // label: "File",
    // submenu: [
    //   {
    //     label: "Quit",
    //     // accelerator: isMac ? "Command+W" : "Ctrl+W",
    //     accelerator: "CmdOrCtrl+W",
    //     click: () => app.quit(),
    //   },
    // ],
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { role: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// catch ip event from render.js
ipcMain.on("image-minimize", function (event, options) {
  options.dest = path.join(os.homedir(), "low-Size-Images");
  shrinkImage(options);
  console.log(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });

    console.log(files);

    shell.openPath(dest);
    mainWindow.webContents.send('image-done')
  } catch (err) {
    console.log(err);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
