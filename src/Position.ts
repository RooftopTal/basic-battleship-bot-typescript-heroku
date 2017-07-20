export class Position
{
    public constructor(public Row:string, public Column:number){

    }
    public print(start:string)
    {
        console.log(start + "Position = " + this.Column + ", "+ this.Row);
    }
}