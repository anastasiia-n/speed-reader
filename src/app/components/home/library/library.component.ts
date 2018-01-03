import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemService } from 'app/providers/file-system.service';
import { DatabaseService } from 'app/providers/database.service';
import { Book } from 'app/models/book.model';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { Subscription } from 'rxjs/Subscription';
import { UserCommand } from 'app/models/command.model';
import { Selector } from 'app/models/selector.model';
import { Themes } from 'app/models/settings.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit, OnDestroy {
  public bookList = new Array<Book>();
  public editModeForItem = "";
  public selector: Selector;

  private shortcutSubscription: Subscription;

  @Input() newBook: Book;

  constructor(
    public fileSystemService: FileSystemService,
    public databaseService: DatabaseService,
    public shortcutsService: ShortcutsService,
    public changeDetectorRef: ChangeDetectorRef,
    public router: Router
  ) { 
  }

  ngOnInit() {
    this.getContent();
    this.shortcutSubscription = this.shortcutsService.listenToCommands()
      .subscribe(result => {
        this.executeCommand(result);
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.shortcutSubscription.unsubscribe();
  }

  // will be executed when new book is added
  ngOnChanges(changes: SimpleChanges) {
    this.getContent();
  }

  private getContent() {
    this.databaseService.books.getPreviews((books) => {
      this.bookList = books;
      this.bookList.forEach(b => b.progress = this.getProgress(b));
      this.selector = new Selector(this.bookList.length - 1);
      console.log(books);
    });
  }

  private getProgress(book: Book) {
    return Math.floor((book.pointer + 1 / book.length));
  }

  public read(id: string) {
    this.router.navigate(['/read/' + id]);
  }

  public edit(id: string) {
    this.editModeForItem = id;
  }

  public edited(item: Book) {
    this.editModeForItem = "";
    this.databaseService.books.update(item);
  }

  public cancel() {
    this.editModeForItem = "";
  }

  public delete(id: string) {
    this.bookList = 
      this.bookList.filter(book => book._id != id);
    this.databaseService.books.deleteById(id);
  }

  private executeCommand(command: UserCommand) {
    switch(command) {
      case UserCommand.up:
        this.selector.moveIndex(-1);
        break;
      case UserCommand.down:
        this.selector.moveIndex(1);
        break;
      case UserCommand.home:
        this.selector.goToStart();
        break;
      case UserCommand.end:
        this.selector.goToEnd();
        break;
      case UserCommand.space:
        this.readSelected();
        break;
      case UserCommand.esc:
        this.selector.clear();
        break;
    }
  }

  private readSelected() {
    const id = this.bookList[this.selector.selectionIndex]._id;
    console.log('index', this.selector.selectionIndex, id);
    this.read(id);
  }

  public getTheme() {
    return Themes.dark;
  }
}
