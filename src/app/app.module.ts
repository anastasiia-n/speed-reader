import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ReaderComponent } from './components/reader/reader.component';

import { AppRoutingModule } from './app-routing.module';
import { HotkeyModule } from 'angular2-hotkeys';

import { ElectronService } from './providers/electron.service';
import { FileSystemService } from 'app/providers/file-system.service';
import { ParserService } from 'app/providers/parser.service';
import { DatabaseService } from 'app/providers/database.service';
import { LibraryComponent } from 'app/components/library/library.component';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { LoggingService } from 'app/providers/logging.service';

@NgModule({
  declarations: [
    AppComponent,
    ReaderComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HotkeyModule.forRoot()
  ],
  providers: [
    ElectronService, 
    FileSystemService, 
    ParserService, 
    DatabaseService, 
    ShortcutsService, 
    LoggingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
