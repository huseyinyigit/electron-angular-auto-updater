const {app, BrowserWindow, autoUpdater, dialog} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow;

let updaterServerURL = 'https://your-deployment-url.com'
updaterServerURL = `${updaterServerURL}/update/${process.platform}/${app.getVersion()}`;
autoUpdater.setFeedURL({ url: updaterServerURL });

const UPDATE_CHECK_INTERVAL = 1 * 10 * 1000;
setInterval(() => {
  autoUpdater.checkForUpdates();
}, UPDATE_CHECK_INTERVAL);

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application');
  console.error(message);
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, './dist/favicon.ico'),
    /*webPreferences: {
      nodeIntegration: true
    }*/
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // mainWindow.webContents.openDevTools();
  // mainWindow.webContents.removeMenu();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
