// Typescript
export interface Tstations {
    index?: number;
    _id: string;
    name: string;
    coord: {
      WGS84: {
        lat: number;
        lon: number;
      };
    };
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