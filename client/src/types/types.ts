// Typescript
export interface Tstations {
  index?: number;
  _id: string;
  name: string;
  coord: number[];
  modes: string[];
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

export interface TStopSequence {
  _id: string;
  key: string;
  name: string;
  modes: [string];
  desc: string;
  created?: string;
  modified?: string;
  schedule: {
    from: string;
    to: string;
    timeSlices: {
      startTime: string;
      endTime: string;
      weekDays: string[];
    }[];
  }[];
  stopSequence: Tstations[];
}
export interface TformInformation {
  _id: string;
  key: string;
  name: string;
  modes: [string];
  desc: string;
  created?: string;
  modified?: string;
  schedule: {
    from: string;
    to: string;
    timeSlices: {
      startTime: string;
      endTime: string;
      weekDays: string[];
    }[];
  }[];
}
