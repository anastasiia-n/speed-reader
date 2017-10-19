import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';
import * as PouchDB from 'pouchdb';

@Injectable()
export class DatabaseService {
    private db;

    constructor() {
        this.db = new PouchDB('speed-reader-library.db',  {revs_limit: 1, auto_compaction: true});
    }

    public addBook(book: Book) {
        this.db.post({
            name: book.name,
            description: book.description,
            text: book.text,
            pointer: book.pointer
        }).then(function (response) {
            if (response.ok) {
                //TODO
            }
        }).catch(function (err) {
            console.log(err);
        });
    }

    public updateBook(book: Book) {
        this.db.get(book._id).then(function(doc) {
            return this.db.put({
                _id: book._id,
                _rev: doc._rev,
                name: book.name,
                description: book.description,
                text: book.text,
                pointer: book.pointer
            });
        }).then(function(response) {
            // handle response
        }).catch(function (err) {
            console.log(err);
        });
    }

    public getAllBooks(callback: (books: Array<Book>) => any) {
        this.db.allDocs({
            include_docs: true
        }).then(function (result) {
            let books: Array<Book>;
            books = result.rows.map(doc => {
                let book = new Book();
                book._id = doc._id;
                book.name = doc.name;
                book.description = doc.description;
                book.pointer = doc.pointer;
                book.text = doc.text;
                return book;
            });
            callback(books);
        }).catch(function (err) {
            console.log(err);
        });
    }

    public getById(id: string, callback: (book: Book) => any) {
        this.db.get(id).then(function (doc) {
            let book = new Book();
            book._id = doc._id;
            book.name = doc.name;
            book.description = doc.description;
            book.pointer = doc.pointer;
            book.text = doc.text;
            callback(book);
        }).catch(function (err) {
            console.log(err);
        });
    }

    public deleteById(id: string) {
        this.db.get(id).then(function(doc) {
            return this.db.remove(doc);
        }).then(function (result) {
            if (result.ok) {
                //TODO
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}