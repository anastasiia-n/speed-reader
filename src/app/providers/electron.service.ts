import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, dialog, clipboard } from 'electron';
import * as fs from 'fs';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  dialog: typeof dialog;
  clipboard: typeof clipboard;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.dialog = window.require('electron').remote.dialog;
      this.clipboard = window.require('electron').clipboard;
      this.fs = window.require('fs');
      this.childProcess = window.require('child_process');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
