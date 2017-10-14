import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { FileSystemService } from 'app/providers/file-system.service';
import { ParserService } from 'app/providers/parser.service';
import { DatabaseService } from 'app/providers/database.service';
import { LibraryComponent } from 'app/components/library/library.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ElectronService, FileSystemService, ParserService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
