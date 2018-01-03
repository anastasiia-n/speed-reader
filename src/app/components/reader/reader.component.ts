import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FileSystemService } from 'app/providers/file-system.service';
import { Book } from 'app/models/book.model';
import { HighlightedWord } from "app/models/highlighted-word.model";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DatabaseService } from 'app/providers/database.service';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { UserCommand } from 'app/models/command.model';
import { Themes } from 'app/models/settings.model';

@Component({
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit, OnDestroy {
  public title = "";
  public currentWord = new HighlightedWord();
  public prevWord = "";
  public nextWord = "";
  public running = false;
  public speed = 100;
  private words: Array<string>;
  private lastIndex: number;
  private pointer = 0;
  private clock;
  private routeSubscription: Subscription;
  private shortcutSubscription: Subscription;
  private bookId: string;

  private readonly MIN_SPEED = 50;
  private readonly MAX_SPEED = 2000;

  constructor(
    public fileSystemService: FileSystemService,
    public databaseService: DatabaseService,
    private router: Router,
    public shortcutsService: ShortcutsService,
    public changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.bookId= param['id'];
        this.databaseService.books.getById(this.bookId, (book) => {
          this.title = book.name;
          this.words = book.text.trim().split(/\s+/);
          this.lastIndex = this.words.length - 1;
          this.pointer = book.pointer;
          this.getNextWordOnce();
          this.changeDetectorRef.detectChanges();
        });
    });
    this.shortcutSubscription = this.shortcutsService.listenToCommands()
      .subscribe(result => {
        this.executeCommand(result);
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.shortcutSubscription.unsubscribe();
    this.pause();
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
    this.databaseService.books.updatePointerById(this.pointer, this.bookId, () => {
      this.router.navigate(['/']);
    });
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

  private executeCommand(command: UserCommand) {
    switch(command) {
      case UserCommand.up:
        this.changeSpeed(50);
        break;
      case UserCommand.down:
        this.changeSpeed(-50);
        break;
      case UserCommand.left:
        this.backward(-10);
        break;
      case UserCommand.right:
        this.forward(10);
        break;
      case UserCommand.home:
        this.backward();
        break;
      case UserCommand.end:
        this.forward();
        break;
      case UserCommand.space:
        if (this.running) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case UserCommand.esc:
        this.exit();
        break;
    }
  }
  
  public getTheme() {
    return Themes.dark;
  }
}
