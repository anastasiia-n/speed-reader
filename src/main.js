'use strict'
const electron = require('electron');
const {app, Menu, BrowserWindow, ipcMain: ipc, globalShortcut, dialog, clipboard} = electron;

const fManager = require('./modules/fileManager')
const tManager = require('./modules/textManager')
const dbManager = require('./modules/dbManager')
var mainWindow;
var bookID;
var dbCon;
var sWin;
dbManager.loadDB(`${__dirname}/db/library.db`, function(conn) {dbCon = conn});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
      height: 700,
      width: 800
    });
    const menuTemplate = [
    {
      label: 'File',
      submenu: [{
        label: 'Add to library',
        click () { addToLibrary() }
      },
      {
        label: 'Add from clipboard',
        click () { addFromClipboard() }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        role: 'close',
        accelerator: 'CmdOrCtrl+Q',
      }]
    },
    {
      label: 'Settings',
      submenu: [{
        label: 'Change settings',
        click () { showSettings() }
      },
      {
        label: 'About settings',
        click () { showAboutSettings() }
      }]
    },
    {
      label: 'About',
      click () { showAbout() }
    }]
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

    mainWindow.loadURL(`file://${__dirname}/view/wait.html`);
    showLibrary();

    mainWindow.openDevTools()
    mainWindow.on('closed', () => {
      mainWindow = null
    });

    globalShortcut.register('Up', () => {
      mainWindow.webContents.send('changeSpeed', 1);
    })
    globalShortcut.register('Down', () => {
      mainWindow.webContents.send('changeSpeed', 0);
    })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
})
app.on('window-all-closed', () => {
  app.quit();
})

ipc.on('showLibrary', (event, saved) => {
  dbCon.updatePointer(saved);
  showLibrary();
})

ipc.on('readBook', (event, id) => {
  bookID = id;
  mainWindow.loadURL(`file://${__dirname}/view/reader.html`);
})

ipc.on('editedBook', (event, book) => {
  dbCon.updateProperties(book)
});

ipc.on('deletedBook', (event, bookId) => {
  dbCon.delete(bookId);
  showLibrary();
})

ipc.on('libReady', (event, data) => {
  dbCon.getAll( (books) => {
    mainWindow.webContents.send('initLibrary', books);
  });
});

ipc.on('readerReady', (event, data) => {
  dbCon.getBook(bookID, (book) => {
    mainWindow.webContents.send('readBook', book);
  });
});

ipc.on('closeSettings', (event, data) => {
  if (sWin) sWin.close();
});

function showLibrary() {
  if (!dbCon) setTimeout(showLibrary, 100);
  else {
    mainWindow.loadURL(`file://${__dirname}/view/library.html`);
  }
}

function addToLibrary() {
  var book;
  fManager.openFile( (filename, data) => {
    book = tManager.parseBook(data, filename);
    dbCon.add(book);
    showLibrary();
  });
}

function addFromClipboard() {
  var book = tManager.parseBook(clipboard.readText());
  dbCon.add(book);
  showLibrary();
}

function showSettings() {
  sWin = new BrowserWindow({
    height: 200,
    width: 300,
    modal: true
  });
  sWin.setMenu(null);
  //sWin.openDevTools();
  sWin.loadURL(`file://${__dirname}/modules/settings/settings.html`);
}

function showAboutSettings() {
  var mess = 'To change the theme you should go to the "change settings" section '
              + 'and choose a theme. You can change the default speed there also. '
              + 'To change current speed you can press arrows while reading or press '
              + 'Up and Down buttons on your keyboard. To make new settings work, you '
              + 'may need to close and run the application again.';
  dialog.showMessageBox({message: mess, title: 'About settings', type: 'info'});
}

function showAbout() {
  var mess = 'MIT License Copyright (c) 2017 Anastasiia Nikolaienko. '
              + '\nSee more my projects on github: github.com/anastasiia-n';
  dialog.showMessageBox({message: mess, title: 'About the application'});
}
