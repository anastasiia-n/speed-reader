import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';
import PouchDB from 'pouchdb-browser';
import { LoggingService } from 'app/providers/logging.service';

@Injectable()
export class DatabaseService {
    private db: PouchDB; 
    private readonly logSource = 'DatabaseService.';

    constructor(
        private loggingService: LoggingService
    ) {
        this.db = new PouchDB('speed-reader-library.db',  {revs_limit: 1, auto_compaction: true});
    }

    public addBook(book: Book, callback: (id: string) => any) {
        this.db.post({
            name: book.name,
            description: book.description,
            text: book.text,
            pointer: book.pointer
        }).then(response => {
            callback(response.id);
        }).catch(err => {
            this.loggingService.logError(this.logSource + 'addBook', err);
        });
    }

    public updateBook(book: Book) {
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

    public getAllBookNames(callback: (books: Array<Book>) => any) {
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
                return book;
            });
            callback(books);
        }).catch((err) => {
            this.loggingService.logError(this.logSource + 'getAllBookNames', err);
            callback(null);
        });
    }

    public getById(id: string, callback: (book: Book) => any) {
        this.db.get(id).then((doc) => {
            console.log(doc);
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