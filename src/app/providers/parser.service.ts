import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';

@Injectable()
export class ParserService {
    private readonly TITLE_LEN = 25;
    private readonly DESCRIPTION_LEN = 60;

    parseText(text: string, path: string = ''): Book{
        let parsedBook = new Book();
        if (path) {
            parsedBook.name = this.getNameFromPath(path);
        } else {
            parsedBook.name = this.getName(text);
        }
        parsedBook.description = this.getDescription(text);
        parsedBook.text = text;
        return parsedBook;
    }

    private getNameFromPath(text: string): string{
        let name = text;
        //remove path
        var index = name.lastIndexOf('\\');
        if (index < 0) {
            index = name.lastIndexOf('/');
        }
        if (index >= 0) {
            name = name.substring(index + 1);
        }

        //remove extension
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }

        if (name.indexOf('_') >= 0) {
            name = name.replace(/_/g, ' ');
        }
        else if (name.indexOf('-') >= 0) {
            name = name.replace(/-/g, ' ');
        }
        return name;
    }

    private getName(text: string): string {
        let title = this.normalizeString(text.substring(0, this.TITLE_LEN));
        let index = title.lastIndexOf(' ');
        if (index >= 0) {
            title = title.substring(0, index);
        }
        return title;
    }

    private getDescription(text: string): string{
        let description = this.normalizeString(text.substring(0, this.DESCRIPTION_LEN));
        let index = description.lastIndexOf(' ');
        if (index >= 0) {
            description = description.substring(0, index) + '...';
        }
        return description;
    }

    private normalizeString(text: string): string {
        // remove all \t \r \n \r\n
        return text.trim().replace(/(\r\n|\n|\r|\t)/g, '').replace(/\s+/g, ' ');
    }
}