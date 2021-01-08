const table = () => {
  let tab: {
    angle: number;
    coord: number[];
    distance: number;
    modes: string[];
    name: string;
    _id: string;
  }[] = [];
  for (let i = 0; i <= 16; i++) {
    tab.push({
      angle: -83.19868517601843,
      coord: [46.17857, 6.08606],
      distance: 0.17031643195093935,
      modes: ["4", "5"],
      name: "Bernex 1",
      _id: "5f6206390d5658001cd959b4" + i,
    });
  }
  return tab;
};

export const stateDND = {
  suggestions: {
    title: "Suggestion",
    items: table(),
  },
  trajekt: {
    title: "Stop sequence",
    items: [
      {
        coord: [46.17857, 6.08606],
        index: 0,
        modes: ["4", "5"],
        name: "Confignon, croisée",
        _id: "5f6205c60d5658001cd9480b",
      },
    ],
  },
};

export const selected = {
  coord: [46.17831, 6.08824],
  index: 0,
  modes: ["4", "5"],
  name: "Confignon, croisée",
  _id: "5f6205c60d5658001cd9480b",
};

export const stopSequenceList = [
  {
    _id: "638b7703-d171-4e5f-8e78-21258f75cee4",
    name: "Test",
    modes: "4",
    schedule: [
      {
        from: "2020.11.24",
        to: "2020.12.16",
        timeSlices: [
          {
            weekDays: ["Mon"],
            startTime: "05:00",
            endTime: "11:00",
          },
        ],
      },
    ],
    stopSequence: [
      {
        key: "123478",
        name: "Schlieren, Gasometerbrücke",
      },
    ],
  },
];

export const currentStopSequence = {
  _id: "638b7703-d171-4e5f-8e78-21258f75cee4",
  name: "Test",
  modes: "4",
  schedule: [
    {
      from: "2020.11.24",
      to: "2020.12.16",
      timeSlices: [
        {
          weekDays: ["Mon"],
          startTime: "05:00",
          endTime: "11:00",
        },
      ],
    },
  ],
  stopSequence: [
    {
      key: "123478",
      name: "Schlieren, Gasometerbrücke",
    },
  ],
};

export const distance = [
  {
    angle: -95.16982788755787,
    distance: 0.163130219415872,
    from: "Camedo, Centovalli",
    to: {
      coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
      modes: ["4", "5"],
      name: "Confignon, croisée",
      _id: "5f6205c60d5658001cd9480b",
    },
  },
];

export const stations = [
  {
    _id: "5f6203bb0d5658001cd8f85a",
    name: "Basel",
    coord: [47.54741, 7.58956],
    modes: [],
  },
  {
    _id: "5f6203bb0d5658001cd8f85b",
    name: "Lyon",
    coord: [45.74506, 4.84184],
    modes: [],
  },
];

export const graphQlStopsQuery = [
  {
    type: "stop",
    name: "Gaillard, Libération",
    key: "100713",
    geojson: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [6.21145, 46.19161],
      },
    },
    data: {
      _id: "5f6203cc0d5658001cd8fae8",
      key: "100713",
      name: "Gaillard, Libération",
      keyMapping: {
        gi: "1400015",
        diva: {
          ojp: "713",
        },
      },
      loc: {
        name: "Gaillard",
        omc: "24074133",
        placeId: "1",
        coord: null,
      },
      routes: ["ojp91017_Hj20", "ojp91017_Rj20"],
      modes: ["4"],
    },
  },
];
