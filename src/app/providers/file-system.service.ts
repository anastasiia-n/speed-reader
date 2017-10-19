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

    public example(): Book {
        let b = new Book();
        b.name = "Lorem";
        b.description = "Ipsum";
        b.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut molestie neque quis nibh facilisis, a dictum eros rhoncus. Pellentesque felis purus, mollis vel elit vitae, iaculis cursus nisl. Maecenas fermentum, metus in volutpat convallis, tortor lectus pulvinar metus, vitae cursus magna enim vel risus. ";
        return b;
    }

    public openFile(callback: (book: Book) => void) {
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