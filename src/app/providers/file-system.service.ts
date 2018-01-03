import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';
import { ElectronService } from 'app/providers/electron.service';
import { ParserService } from 'app/providers/parser.service';

@Injectable()
export class FileSystemService {
    constructor(
        public electronService: ElectronService,
        public parserService: ParserService
    ) { }

    public readFile(callback: (book: Book) => void) {
        this.electronService.dialog.showOpenDialog(
            { filters: [{ name: 'text', extensions: ['txt'] }] },
            (fileNames) => {
                if (fileNames === undefined) return;
                let fileName = fileNames[0];
                this.electronService.fs.readFile(fileName, 'utf-8', (err, data) => {
                    let resultBook = this.parserService.parseText(data, fileName);
                    callback(resultBook);
                });
            }
        );
    }

    public readClipboard(): Book {
        let text = this.electronService.clipboard.readText();
        let resultBook = this.parserService.parseText(text);
        return resultBook;
    }
}