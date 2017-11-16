import { Injectable } from '@angular/core';
import * as Mousetrap from 'mousetrap';
import { HotkeyModule, HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UserCommand } from 'app/models/command.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShortcutsService {
    constructor(private hotkeysService: HotkeysService) {
        
    }
    listenToCommands(): Observable<UserCommand> {
        return Observable.create(observer => {
            this.hotkeysService.add(new Hotkey('up',() => observer.next(UserCommand.up)));
            this.hotkeysService.add(new Hotkey('down',() => observer.next(UserCommand.down)));
            this.hotkeysService.add(new Hotkey('right',() => observer.next(UserCommand.right)));
            this.hotkeysService.add(new Hotkey('left',() => observer.next(UserCommand.left)));
            this.hotkeysService.add(new Hotkey('home',() => observer.next(UserCommand.home)));
            this.hotkeysService.add(new Hotkey('end',() => observer.next(UserCommand.end)));
            this.hotkeysService.add(new Hotkey('space',() => observer.next(UserCommand.space)));
            this.hotkeysService.add(new Hotkey('esc',() => observer.next(UserCommand.esc)));
        });
    }
}