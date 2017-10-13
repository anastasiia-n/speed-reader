import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';

@Injectable()
export class DatabaseService {
    public saveBook(book: Book) {
        //TODO: save to db
    }
}