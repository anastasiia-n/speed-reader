export class Selector {
    private maxIndex = 0;
    public selectionIndex = -1;

    constructor(maxIndex: number) {
        this.maxIndex = maxIndex;
    }

    public moveIndex(value: number) {
        if (this.selectionIndex + value < 0) {
          this.selectionIndex = 0;
        }
        else if (this.selectionIndex + value > this.maxIndex) {
          this.selectionIndex =  this.maxIndex;
        } 
        else {
          this.selectionIndex += value;
        }
    }

    public goToStart() {
        this.selectionIndex = 0;
    }

    public goToEnd() {
        this.selectionIndex = this.maxIndex;
    }

    public clear() {
        this.selectionIndex = -1;
    }
}