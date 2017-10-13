import { Component, OnInit } from '@angular/core';
import { FileSystemService } from 'app/providers/file-system.service';
import { Book } from 'app/models/book.model';
import { HighlightedWord } from "app/models/highlighted-word.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `App works !`;
  currentWord: HighlightedWord;
  words: Array<string>;
  running = false;
  pointer = 0;
  speed = 100;

  constructor(public fileSystemService: FileSystemService) { }

  ngOnInit() {
    // TODO: we will get it from db
    let book = this.fileSystemService.readFile();
    this.title = book.name;
    this.words = book.text.trim().split(' +');
  }

  public pause() {
    this.running = false;
  }

  public play() {
    this.running = true;
  }

  public exit() {
    //TODO: save and go to library
  }

  public changeSpeed(value: number) {
    
  }

  private getTimeout() {
    return 60000/this.speed;
  }
}
