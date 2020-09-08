export interface Tstations {
  _id: string;
  Haltestelle: string;
  adresse: string;
  location: {
    lat: number;
    lng: number;
  };
  Umstiegmöglischkeiten: string;
  weitereInformationen: string;
}

export type Tloading = boolean;
export type Tchoose = string;

export interface Tdistance {
  from: string;
  to: {
    _id: string;
    Haltestelle: string;
    adresse: string;
    location: {
      lat: number;
      lng: number;
    };
    Umstiegmöglischkeiten: string;
    weitereInformationen: string;
  };
  distance: number;
}

export interface TstateDND {
  vorschlag: {
    title: string;
    items: [];
  };
  trajekt: {
    title: string;
    items: [];
  };
}
