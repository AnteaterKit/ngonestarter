const { app, BrowserWindow, Menu } = require('electron');
const isDevMode = require('electron-is-dev');
const { injectCapacitor, CapacitorSplashScreen } = require('@capacitor/electron');
const fs = require('fs');
const path = require('path');

function getURLFileContents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8' , (err, data) => {
      // console.error(err);
      if(err)
        reject(err);
      resolve(data.toString());
    });
  });
}

const injectCapacitor2 = async function(url, gu) {
  try {
     console.log(url);
    let urlFileContents = await getURLFileContents(url.substr(url.indexOf('://') + 3));
    let pathing = path.join(url.substr(url.indexOf('://') + 3), '../../node_modules/@capacitor/electron/dist/electron-bridge.js');
     console.log(pathing);
    urlFileContents = urlFileContents.replace('<body>', `<body><script>window.require('${pathing.replace(/\\/g,'\\\\')}')</script>`);
     console.log(urlFileContents);
    return 'data:text/html;charset=UTF-8,' + urlFileContents;
  } catch(e) {
    // console.error(e);
    return url;
  }
};

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;
url = `file://${__dirname}/app/index.html`;


async function createWindow () {

let gu = await getURLFileContents(url.substr(url.indexOf('://') + 3));
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    show: false,
  });

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: gu.toString(),
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];

  //if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  //}

  if(useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init();
  } else {
    mainWindow.loadURL(await injectCapacitor(`file://${__dirname}/app/index.html`, gu.toString()), {baseURLForDataURL: `file://${__dirname}/app/`});
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
