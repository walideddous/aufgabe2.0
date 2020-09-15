export interface Tstations {
  index?: number;
  id: string;
  name: string;
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
    id: string;
    name: string;
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
