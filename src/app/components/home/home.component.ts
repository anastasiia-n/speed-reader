import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FileSystemService } from 'app/providers/file-system.service';
import { ElectronService } from 'app/providers/electron.service';
import { DatabaseService } from 'app/providers/database.service';
import { Book } from 'app/models/book.model';
import { ShortcutsService } from 'app/providers/shortcuts.service';
import { Subscription } from 'rxjs/Subscription';
import { UserCommand } from 'app/models/command.model';
import { Themes } from 'app/models/settings.model';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    // if user will add a new book
    // it will be passed to library component
    public newBook: Book;

    private subscription: Subscription;

    @ViewChild('settingsModal') private settingsModal;

    constructor(
        public fileSystemService: FileSystemService,
        public electronService: ElectronService,
        public databaseService: DatabaseService,
        public shortcutsService: ShortcutsService,
        private modalService: NgbModal
    ) {
        electronService.ipcRenderer.on('fromFile', () => {
            this.readFromFile();
        });
        electronService.ipcRenderer.on('fromClip', () => {
            this.readFromClipboard();
        });
        electronService.ipcRenderer.on('settingsPersonalize', () => {
            this.open(this.settingsModal);
        });
    }

    open(content) {
      this.modalService.open(content);
    }

    private readFromFile() {
        this.fileSystemService.readFile((book) => {
            console.log('will add', book)
            if (book.name && book.text) {
                this.databaseService.books.add(book, (id) => {
                    book._id = id;
                    //TODO: push book to library
                    this.newBook = book;
                });
            } else {
            //TODO: show error
            }
        });
    }

    private readFromClipboard() {
        let book = this.fileSystemService.readClipboard();
        console.log('clip', book);
        if (book.name && book.text) {
            this.databaseService.books.add(book, (id) => {
                book._id = id;
                //TODO: push book to library
                this.newBook = book;
            });
        } else {
            //TODO: show error
        }
    }
}
