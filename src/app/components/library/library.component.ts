import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemService } from 'app/providers/file-system.service';
import { ElectronService } from 'app/providers/electron.service';
import { DatabaseService } from 'app/providers/database.service';
import { Book } from 'app/models/book.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  public bookList = new Array<Book>();
  public editModeForItem = "";

  constructor(
    public fileSystemService: FileSystemService,
    public electronService: ElectronService,
    public databaseService: DatabaseService,
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
    this.databaseService.getAllBookNames((books) => {
      this.bookList = books;
      console.log(books);
    });
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
    
  }

  private readFromFile() {
    this.fileSystemService.readFile((book) => {
      console.log('will add', book)
      this.databaseService.addBook(book);
      this.bookList.push(book);
    });
  }

  private readFromClipboard() {
    let book = this.fileSystemService.readClipboard();
    console.log('clip', book);
    this.databaseService.addBook(book);
    this.bookList.push(book);
  }
}
