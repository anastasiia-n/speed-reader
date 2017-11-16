import { Injectable } from '@angular/core';

@Injectable()
export class LoggingService {
    public logError(source: string, message: string) {
        this.writeToConsole('error', source, message);
    }

    private writeToConsole(flag: string, source: string, message: string) {
        console.log(flag + '[' + source + ']: ' + message);
    }
}