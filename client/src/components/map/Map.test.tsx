import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Map from "./Map";

const setUp = (props: any) => {
  const component = shallow(<Map {...props} />);
  return component;
};

describe("Map component", () => {
  let shallowWrapper: any;
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
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    },
    selected: {},
    distance: [],
    currentStopSequence: {},
    handleSelectAutoSearch: jest.fn(),
    onAddAfterSelected: jest.fn(),
    onAddBeforSelected: jest.fn(),
    onDeleteMarkerFromMap: jest.fn(),
    selectMarkerOnMap: jest.fn(),
  };

  beforeEach(() => {
    shallowWrapper = setUp(props);
  });

  it("match snapshot with the Map component", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
});
