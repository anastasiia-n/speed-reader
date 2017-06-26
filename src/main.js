'use strict'
const electron = require('electron');
const {app, Menu, BrowserWindow, ipcMain: ipc, globalShortcut, dialog} = electron;

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
      height: 400,
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
        label: 'Read demo',
        click () { readBook() }
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
      click () { showSettings() }
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
    })

    //TODO: add shortcuts
    globalShortcut.register('CommandOrControl+Y', () => {
      // Do stuff when Y and either Command/Control is pressed.
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
    book = tManager.parseBook(filename, data);
    dbCon.add(book);
  });
}

function addFromClipboard() {

}

function showSettings() {
  sWin = new BrowserWindow({
    height: 200,
    width: 300,
    frame: false,
    modal: true
  });
  //sWin.openDevTools();
  sWin.loadURL(`file://${__dirname}/modules/settings/settings.html`);
}
