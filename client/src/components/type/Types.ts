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
