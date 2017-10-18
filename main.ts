import { app, Menu, BrowserWindow, screen, dialog, shell } from 'electron';
import * as path from 'path';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  // add menu
  let menuTemplate = [
    {
      label: 'File',
      submenu: [{
        label: 'Add from file',
        click () { win.webContents.send('fromFile'); },
        accelerator: 'Ctrl+O',
      },
      {
        label: 'Add from clipboard',
        click () { win.webContents.send('fromClip'); },
        accelerator: 'Ctrl+V',
      },
      {
        label: 'Quit',
        role: 'close',
        accelerator: 'CmdOrCtrl+Q',
      }]
    },
    {
      label: 'Settings',
      click () { win.webContents.send('showSettings'); },
    },
    {
      label: 'About',
      click () { showAbout(); }
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

function showAbout() {
  const mess = 'MIT License Copyright (c) 2017 Anastasiia Nikolaienko. '
      + '\nSee more my projects on github: github.com/anastasiia-n';
  const buttons = ['OK', 'Go to github']
  dialog.showMessageBox({ message: mess, title: 'About the application', buttons: buttons }, (selectedId) => {
    if (selectedId === 1) shell.openExternal('https://github.com/anastasiia-n');
  });
}
