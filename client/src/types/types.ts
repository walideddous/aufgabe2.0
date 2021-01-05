// Typescript
export interface Tstations {
    index?: number;
    _id: string;
    name: string;
    coord: [number, number];
    modes: [string];
  }
  
  export interface Tdistance {
    from: string;
    to: Tstations;
    distance: number;
  }

  export interface TstateDND {
    suggestions: {
      title: string;
      items: {
        _id: string;
        name: string;
      }[];
    };
    trajekt: {
      title: string;
      items: {
        _id: string;
        name: string;
      }[];
    };
  }

  export interface TcurrentStopSequence{
    modes : string,
    name: string,
    schedule :{
      date : string,
      dayTime:{
        day: string[],
        time:string[]
      }[]
    }[],
    stopSequence: Tstations[]
  }