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
    stations: [],
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
    selected: [],
    distance: [],
    currentStopSequence: [],
    handleSelectAutoSearch: jest.fn(),
    onAddAfterSelected: jest.fn(),
    onAddBeforSelected: jest.fn(),
    onDeleteMarkerFromMap: jest.fn(),
    selectMarkerOnMap: jest.fn(),
  };

  beforeEach(() => {
    shallowWrapper = setUp(props);
  });

  it("match snapshot", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
});
