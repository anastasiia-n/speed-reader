import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';
import PouchDB from 'pouchdb-browser';
import { LoggingService } from 'app/providers/logging.service';
import { Settings } from 'app/models/settings.model';
import { User } from 'app/models/user.model';

@Injectable()
export class DatabaseService {
    public books;
    public settings;
    constructor(private loggingService: LoggingService) {
        this.books = new BooksDb(this.loggingService);
        this.settings = new SettingsDb(this.loggingService);
    }
}

class BooksDb {
    private db: PouchDB; 
    private readonly logSource = 'DatabaseService.BooksDb.';

    constructor(
        private loggingService: LoggingService
    ) {
        this.db = new PouchDB('speed-reader-library.db',  {revs_limit: 1, auto_compaction: true});
    }

    public add(book: Book, callback: (id: string) => any) {
        this.db.post({
            name: book.name,
            description: book.description,
            text: book.text,
            pointer: book.pointer
        }).then(response => {
            callback(response.id);
        }).catch(err => {
            this.loggingService.logError(this.logSource + 'add', err);
        });
    }

    public update(book: Book) {
        this.db.get(book._id).then((doc) => {
            this.db.put({
                _id: book._id,
                _rev: doc._rev,
                name: book.name,
                description: book.description,
                text: book.text,
                pointer: book.pointer
            });
        }).catch((err) => {
            this.loggingService.logError(this.logSource + 'update', err);
        });
    }

    public updatePointerById(pointer: number, id: string, callback: () => any) {
        this.db.get(id).then((doc) => {
            this.db.put({
                _id: id,
                _rev: doc._rev,
                name: doc.name,
                description: doc.description,
                text: doc.text,
                pointer: pointer
            })
            .then((responce) => callback())
            .catch((err) => {
                this.loggingService.logError(this.logSource + 'updatePointerById.put', err);
                callback();
            });
        })
        .catch((err) => {
            this.loggingService.logError(this.logSource + 'updatePointerById.get', err);
            callback();
        });
    }

    public getPreviews(callback: (books: Array<Book>) => any) {
        this.db.allDocs({
            include_docs: true
        }).then((result) => {
            console.log('rows', result.rows);
            let books: Array<Book>;
            books = result.rows.map(row => {
                let book = new Book();
                book._id = row.doc._id;
                book.name = row.doc.name;
                book.description = row.doc.description;
                book.pointer = row.doc.pointer;
                book.length = row.doc.text.split(' ').length;
                return book;
            });
            callback(books);
        }).catch((err) => {
            this.loggingService.logError(this.logSource + 'getPreviews', err);
            callback(null);
        });
    }

    public getById(id: string, callback: (book: Book) => any) {
        this.db.get(id).then((doc) => {
            let book = new Book();
            book._id = doc._id;
            book.name = doc.name;
            book.description = doc.description;
            book.pointer = doc.pointer;
            book.text = doc.text;
            callback(book);
        }).catch((err)=> {
            this.loggingService.logError(this.logSource + 'getById', err);
            callback(null);
        });
    }

    public deleteById(id: string) {
        this.db.get(id).then((doc) => {
            return this.db.remove(doc);
        }).catch((err) => {
            this.loggingService.logError(this.logSource + 'deleteById', err);
        });
    }
}

class SettingsDb {
    private db: PouchDB; 
    private readonly logSource = 'DatabaseService.SettingsDb.';

    constructor(
        private loggingService: LoggingService
    ) {
        this.db = new PouchDB('speed-reader-settings.db',  {revs_limit: 1, auto_compaction: true});
        /*
            user_id | Settings
        */
    }

    public saveSettings(settings: Settings, user: User = null) {
        // find by user id
        // if no entries OR user is null - save as local [user_id = 0]
        // if there is an entry - update values

        /*
        this.db.get(book._id).then((doc) => {
            this.db.put({
                _id: book._id,
                _rev: doc._rev,
                name: book.name,
                description: book.description,
                text: book.text,
                pointer: book.pointer
            });
        }).catch((err) => {
            this.loggingService.logError(this.logSource + 'updateBook', err);
        });*/
    }

    public getSettings(user: User = null) {
        // find by user id
        // if user is null - get local [user_id = 0]

        /*
        this.db.get(id).then((doc) => {
            let book = new Book();
            book._id = doc._id;
            book.name = doc.name;
            book.description = doc.description;
            book.pointer = doc.pointer;
            book.text = doc.text;
            callback(book);
        }).catch((err)=> {
            this.loggingService.logError(this.logSource + 'getById', err);
            callback(null);
        });*/
    }
}


