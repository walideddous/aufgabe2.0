import React from "react";
import { mount, shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import Map from "./Map";

const table = () => {
  const tab = new Array(16).fill({
    angle: -83.19868517601843,
    coord: { WGS84: { lat: 46.17857, lon: 6.08606 } },
    distance: 0.17031643195093935,
    modes: ["4", "5"],
    name: "Bernex 1",
    _id: "5f6206390d5658001cd959b4",
  });

  return tab;
};

describe("Map component", () => {
  let wrapper: any;
  let props = {
    stations: [
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
    ],
    stateDND: {
      vorschlag: {
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
    },
    selected: {
      coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
      index: 0,
      modes: ["4", "5"],
      name: "Confignon, croisée",
      _id: "5f6205c60d5658001cd9480b",
    },
    currentStopSequence: {
      _id: "c03295ea-5a3f-43e8-83ea-7736ce82cfd9",
      name: "St. Gallen to Zürich HB",
      date: ["2020-10-16", "2020-11-27"],
      schedule: [
        {
          day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          time: [
            {
              start: "07:00",
              end: "12:00",
            },
            {
              start: "13:00",
              end: "18:00",
            },
          ],
        },
        {
          day: ["saturday", "sunday"],
          time: [
            {
              start: "07:00",
              end: "12:00",
            },
          ],
        },
      ],
      modes: "13",
      stopSequence: [
        {
          _id: "5f62045b0d5658001cd910c4",
          name: "St. Gallen",
          modes: ["13", "5"],
          coord: {
            WGS84: {
              lat: 47.42318,
              lon: 9.3699,
            },
          },
        },
        {
          _id: "5f62045b0d5658001cd910c1",
          name: "St. Gallen Bruggen",
          modes: ["13"],
          coord: {
            WGS84: {
              lat: 47.4072,
              lon: 9.32965,
            },
          },
        },
      ],
    },
    distance: [
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
    ],
  };

  const spyOnhandleSelectAutoSearch = jest.fn();
  const spyOnonAddAfterSelected = jest.fn();
  const spyOnonAddBeforSelected = jest.fn();
  const spyOnonDeleteMarkerFromMap = jest.fn();
  const spyOnselectMarkerOnMap = jest.fn();

  beforeEach(() => {
    const div = global.document.createElement("div");
    global.document.body.appendChild(div);

    wrapper = mount(
      //@ts-ignore
      <Map
        {...props}
        handleSelectAutoSearch={spyOnhandleSelectAutoSearch}
        onAddAfterSelected={spyOnonAddAfterSelected}
        onAddBeforSelected={spyOnonAddBeforSelected}
        onDeleteMarkerFromMap={spyOnonDeleteMarkerFromMap}
        selectMarkerOnMap={spyOnselectMarkerOnMap}
      />,
      { attachTo: div }
    );
  });

  it("Should match snapshot with the Map component", () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
