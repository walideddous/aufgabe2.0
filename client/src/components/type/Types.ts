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
  modes: [String];
}

export type Tloading = boolean;
export type Tchoose = string;

export interface Tdistance {
  from: string;
  to: {
    _id: string;
    name: string;
    coord: {
      WGS84: {
        lat: number;
        lon: number;
      };
    };
    modes: [String];
  };
  distance: number;
}

export interface TstateDND {
  vorschlag: {
    title: string;
    items: {
      id: number;
      name: string;
    }[];
  };
  trajekt: {
    title: string;
    items: {
      id: number;
      name: string;
    }[];
  };
}
