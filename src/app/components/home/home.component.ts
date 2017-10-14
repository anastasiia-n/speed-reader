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
  public title = `App works !`;
  public currentWord = new HighlightedWord();
  public prevWord = "";
  public nextWord = "";
  public running = false;
  public speed = 100;
  private words: Array<string>;
  private lastIndex: number;
  private pointer = 0;
  private clock;

  constructor(public fileSystemService: FileSystemService) { }

  ngOnInit() {
    // TODO: we will get it from db
    let book = this.fileSystemService.readFile();
    this.title = book.name;
    this.words = book.text.trim().split(/\s+/);
    this.lastIndex = this.words.length - 1;
    console.log(this.words);
    console.log(this.lastIndex);
  }

  public pause() {
    if (this.running) {
      this.running = false;
      clearTimeout(this.clock);
    }
  }

  public play() {
    if (!this.running) {
      this.running = true;
      console.log("go!");
      this.getNextWord();
    }
  }

  public exit() {
    //TODO: save and go to library
  }

  public changeSpeed(value: number) {
    this.speed += value;
    if (this.speed < 50) this.speed = 50;
    else if (this.speed > 2000) this.speed = 2000;
  }
  
  private getNextWord() {
    this.clock = setTimeout(() => {
      if(this.pointer <= this.lastIndex) {
        if (this.pointer > 0) {
          this.prevWord = this.words[this.pointer - 1];
        }
        if (this.pointer < this.lastIndex) {
          this.nextWord = this.words[this.pointer + 1];
        }
        this.currentWord = this.splitWord(this.words[this.pointer++]);
        console.log(this.currentWord);
        this.getNextWord();
      }
    }, this.getTimeout());
  }

  private splitWord(word: string): HighlightedWord {
    let hw = new HighlightedWord();
    if (word.length < 2) {
      hw.center = word;
    } else {
      let center = Math.ceil(word.length / 2) - 1;
      hw.start = word.substring(0, center);
      hw.center = word.charAt(center);
      hw.end = word.substring(center + 1);
    }
    return hw;
  }

  private getTimeout() {
    return 60000/this.speed;
  }
}
