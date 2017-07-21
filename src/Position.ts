export class Position
{
    public constructor(public Row:string, public Column:number){

    }

    public getPositionAbove()
    {
        return new Position(this.getUpRow(this.Row), this.Column);
    }

    public getPositionLeft()
    {
        return new Position(this.Row, this.getLeftColumn(this.Column));
    }

    public getPositionRight()
    {
        return new Position(this.Row, this.getRightColumn(this.Column));
    }

    public getPositionDown()
    {
        return new Position(this.getDownRow(this.Row), this.Column);
    }


    public print(start:string)
    {
        console.log(start + "Position = " + this.Column+ this.Row);
    }



    private getDownRow(row) {
        var newRow = row.charCodeAt(0) + 1;
        if(newRow > 'J'.charCodeAt(0)) {
            return 'A';
        }
        return String.fromCharCode(newRow);
    }

    private getUpRow(row) {
        var newRow = row.charCodeAt(0) - 1;
        if(newRow < 'A'.charCodeAt(0)) {
            return 'J';
        }
        return String.fromCharCode(newRow);
    }

    private getRightColumn(column) {
        return column % 10 + 1;
    }

    private getLeftColumn(column) {
        if(column != 1)return (column+9)%10;
        else return 10;
    }
}