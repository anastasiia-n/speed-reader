import { Injectable } from '@angular/core';

@Injectable()
export class ParserService {
    parseText(text: string): string{
        // TODO: remove \n \t and so on, get name and description
        return text;
    }
}