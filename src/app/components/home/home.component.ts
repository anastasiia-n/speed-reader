import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileSystemService } from 'app/providers/file-system.service';
import { Book } from 'app/models/book.model';
import { HighlightedWord } from "app/models/highlighted-word.model";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
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
  private subscription: Subscription;

  private readonly MIN_SPEED = 50;
  private readonly MAX_SPEED = 2000;

  constructor(
    public fileSystemService: FileSystemService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        let serverID = param['id'];
        console.log(serverID);
    });

    // TODO: we will get it from db
    let book = this.fileSystemService.example();
    this.title = book.name;
    this.words = book.text.trim().split(/\s+/);
    this.lastIndex = this.words.length - 1;

    this.getNextWordOnce();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      this.getNextWord();
    }
  }

  public exit() {
    //TODO: save pointer, go to library
  }

  public changeSpeed(value: number) {
    this.speed += value;
    if (this.speed < this.MIN_SPEED) this.speed = this.MIN_SPEED;
    else if (this.speed > this.MAX_SPEED) this.speed = this.MAX_SPEED;
  }

  public forward(value?: number) {
    if (!value || this.pointer + value > this.lastIndex) {
      this.pointer = this.lastIndex;
    } else {
      this.pointer += value;
    }
    this.getNextWordOnce();
  }

  public backward(value?: number) {
    if (!value || this.pointer - value < 0) {
      this.pointer = 0;
    } else {
      this.pointer -= value;
    }
    this.getNextWordOnce();
  }
  
  private getNextWord() {
    this.clock = setTimeout(() => {
      if(this.pointer <= this.lastIndex) {
        this.getNextWordOnce();
        this.getNextWord();
      }
    }, this.getTimeout());
  }

  private getNextWordOnce() {
    if(this.pointer <= this.lastIndex) {
      if (this.pointer > 0) {
        this.prevWord = this.words[this.pointer - 1];
      } else {
        this.prevWord = '';
      }
      if (this.pointer < this.lastIndex) {
        this.nextWord = this.words[this.pointer + 1];
      } else {
        this.nextWord = '';
      }
      this.currentWord = this.splitWord(this.words[this.pointer++]);
      console.log(this.currentWord);
    }
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
