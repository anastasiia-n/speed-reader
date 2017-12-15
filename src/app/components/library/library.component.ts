import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemService } from 'app/providers/file-system.service';
import { ElectronService } from 'app/providers/electron.service';
import { DatabaseService } from 'app/providers/database.service';
import { Book } from 'app/models/book.model';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { Subscription } from 'rxjs/Subscription';
import { UserCommand } from 'app/models/command.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit, OnDestroy {
  public bookList = new Array<Book>();
  public editModeForItem = "";
  public selectionIndex = -1;

  private subscription: Subscription;

  constructor(
    public fileSystemService: FileSystemService,
    public electronService: ElectronService,
    public databaseService: DatabaseService,
    public shortcutsService: ShortcutsService,
    public changeDetectorRef: ChangeDetectorRef,
    public router: Router
  ) { 
    electronService.ipcRenderer.on('fromFile', () => {
      this.readFromFile();
    });
    electronService.ipcRenderer.on('fromClip', () => {
      this.readFromClipboard();
    });
  }

  ngOnInit() {
    this.databaseService.getBookPreviews((books) => {
      this.bookList = books;
      console.log(books);
    });
    this.subscription = this.shortcutsService.listenToCommands()
      .subscribe(result => {
        this.executeCommand(result);
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public getTheme(): string {
    return 'default';
  }

  public read(id: string) {
    this.router.navigate(['/read/' + id]);
  }

  public edit(id: string) {
    this.editModeForItem = id;
  }

  public edited(item: Book) {
    this.editModeForItem = "";
    this.databaseService.updateBook(item);
  }

  public cancel() {
    this.editModeForItem = "";
  }

  public delete(id: string) {
    this.bookList = 
      this.bookList.filter(book => book._id != id);
    this.databaseService.deleteById(id);
  }

  private readFromFile() {
    this.fileSystemService.readFile((book) => {
      console.log('will add', book)
      if (book.name && book.text) {
        this.databaseService.addBook(book, (id) => {
          book._id = id;
          this.bookList.push(book);
        });
      }
    });
  }

  private readFromClipboard() {
    let book = this.fileSystemService.readClipboard();
    console.log('clip', book);
    if (book.name && book.text) {
      this.databaseService.addBook(book, (id) => {
          book._id = id;
          this.bookList.push(book);
      });
    }
  }

  private moveSelectionIndex(value: number) {
    if (this.selectionIndex + value < 0) {
      this.selectionIndex = 0;
    }
    else if (this.selectionIndex + value > this.bookList.length - 1) {
      this.selectionIndex =  this.bookList.length - 1;
    } 
    else {
      this.selectionIndex += value;
    }
  }

  private executeCommand(command: UserCommand) {
    switch(command) {
      case UserCommand.up:
        this.moveSelection(-1);
        break;
      case UserCommand.down:
        this.moveSelection(1);
        break;
      case UserCommand.home:
        this.moveSelectionToStart();
        break;
      case UserCommand.end:
        this.moveSelectionToEnd();
        break;
      case UserCommand.space:
        this.readSelected();
        break;
      case UserCommand.esc:
        this.clearSelection();
        break;
    }
  }

  private moveSelection(value: number) {
    if (this.selectionIndex + value > this.bookList.length - 1) {
      this.selectionIndex = this.bookList.length - 1;
    } else if (this.selectionIndex + value < 0) {
      this.selectionIndex = 0;
    } else {
      this.selectionIndex += value;
    }
    console.log(this.selectionIndex);
  }

  private moveSelectionToStart() {
    this.selectionIndex = 0;
  }
  private moveSelectionToEnd() {
    this.selectionIndex = this.bookList.length - 1;
  }

  private readSelected() {
    const id = this.bookList[this.selectionIndex]._id;
    console.log('index', this.selectionIndex, id);
    this.read(id);
  }

  private clearSelection() {
    this.selectionIndex = -1;
  }
}
