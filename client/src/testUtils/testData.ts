const table = () => {
  let tab =[];
  for(let i=0; i<=16; i++){
    tab.push({
      angle: -83.19868517601843,
      coord: { WGS84: { lat: 46.17857, lon: 6.08606 } },
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
        coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
        index: 0,
        modes: ["4", "5"],
        name: "Confignon, croisée",
        _id: "5f6205c60d5658001cd9480b",
      },
    ],
  },
};

export const selected = {
  coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
  index: 0,
  modes: ["4", "5"],
  name: "Confignon, croisée",
  _id: "5f6205c60d5658001cd9480b",
};

export const stopSequenceList = [
  {
      _id: "638b7703-d171-4e5f-8e78-21258f75cee4",
      name: "asdsadsa",
      modes: "4",
      schedule: [
          {
              date: "2020.11.24-2020.12.16",
              dayTime: [
                  {
                      day: [
                          "Mon"
                      ],
                      time: [
                          "05:00",
                          "11:00"
                      ]
                  }
              ]
          }
      ],
      stopSequence: [
          {
              _id: "5f62060e0d5658001cd95358",
              name: "Schlieren, Gasometerbrücke",
              modes: [
                  "4",
                  "5"
              ],
              coord: {
                  WGS84: {
                      lat: 47.39761,
                      lon: 8.4606
                  }
              }
          }
      ]
  }
]

export const currentStopSequence =   {
  _id: "638b7703-d171-4e5f-8e78-21258f75cee4",
  name: "asdsadsa",
  modes: "4",
  schedule: [
      {
          date: "2020.11.24-2020.12.16",
          dayTime: [
              {
                  day: [
                      "Mon"
                  ],
                  time: [
                      "05:00",
                      "11:00"
                  ]
              }
          ]
      }
  ],
  stopSequence: [
      {
          _id: "5f62060e0d5658001cd95358",
          name: "Schlieren, Gasometerbrücke",
          modes: [
              "4",
              "5"
          ],
          coord: {
              WGS84: {
                  lat: 47.39761,
                  lon: 8.4606
              }
          }
      }
  ]
}

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
    coord: {
      WGS84: {
        lat: 47.54741,
        lon: 7.58956,
      },
    },
    modes: [],
  },
  {
    _id: "5f6203bb0d5658001cd8f85b",
    name: "Lyon",
    coord: {
      WGS84: {
        lat: 45.74506,
        lon: 4.84184,
      },
    },
    modes: [],
  },
];
