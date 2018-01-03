export class Settings {
    public _id: string;
    public speed: number;
    public theme: Themes;
}

export enum Themes {
    default = "default",
    dark = "dark"
}