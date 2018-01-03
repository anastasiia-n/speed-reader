import { Component } from "@angular/core";
import { Themes, Settings } from "app/models/settings.model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from "app/shared/constants";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    public themes = new Array<string>();
    public settings = new Settings();

    constructor(
        private modalService: NgbModal
    ) {
        for (const t in Themes) {
            this.themes.push(t);
        }
        this.getCurrentSettings();
    }

    public open(content) {
        this.modalService.open(content);
    }

    public getMinSpeed() {
        return Constants.minSpeed;
    }

    public getMaxSpeed() {
        return Constants.maxSpeed;
    }

    private getCurrentSettings() {
        // TODO: get from db
        this.settings.theme = Themes.default;
        this.settings.speed = 100;
    }
}