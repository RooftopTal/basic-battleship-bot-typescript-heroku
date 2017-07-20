export class Position
{
    public constructor(public Row:string, public Column:number){

    }
    public print()
    {
        console.log("Position = " + this.Column + ", "+ this.Row);
    }
}