import { Injectable } from '@angular/core';
import { Book } from 'app/models/book.model';

@Injectable()
export class FileSystemService {
    public readFile(): Book {
        // TODO: open file, read text from it
        let b = new Book();
        b.name = "Lorem";
        b.description = "Ipsum";
        b.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut molestie neque quis nibh facilisis, a dictum eros rhoncus. Pellentesque felis purus, mollis vel elit vitae, iaculis cursus nisl. Maecenas fermentum, metus in volutpat convallis, tortor lectus pulvinar metus, vitae cursus magna enim vel risus. ";
        return b;
    }
}