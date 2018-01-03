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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ElectronService } from './providers/electron.service';
import { FileSystemService } from 'app/providers/file-system.service';
import { ParserService } from 'app/providers/parser.service';
import { DatabaseService } from 'app/providers/database.service';
import { LibraryComponent } from 'app/components/home/library/library.component';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { LoggingService } from 'app/providers/logging.service';
import { HomeComponent } from 'app/components/home/home.component';
import { SettingsComponent } from 'app/components/home/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReaderComponent,
    LibraryComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HotkeyModule.forRoot(),
    NgbModule.forRoot()
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
