// Typescript
export interface Tstops {
  index?: number;
  _id: string;
  name: string;
  coord: number[];
  modes: string[];
}

export interface Tdistance {
  from: string;
  to: Tstops;
  distance: number;
}

export interface TstopSequence {
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

export interface TManagedRoute {
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
  stopSequence: Tstops[];
  createdFrom: string;
  modifiedFrom: string;
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
    createdFrom: string;
    modifiedFrom: string;
  }[];
}
