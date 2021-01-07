import { formatPTStopItems } from "./formatPTStopItems";

describe("Test the formatPTStopItems function", () => {
  const input = [
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

  const result = [
    {
      coord: [46.19161, 6.21145],
      key: "100713",
      modes: ["4"],
      name: "Gaillard, Libération",
      _id: "5f6203cc0d5658001cd8fae8",
    },
  ];

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });

  it("Should test the function without crashing", () => {
      expect(formatPTStopItems(input)).toEqual(result)
  });
});
