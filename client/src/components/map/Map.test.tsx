import React from "react";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Map from "./Map";

// import the datat to test with
import {
  stations,
  stateDND,
  selected,
  currentStopSequence,
  distance,
} from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stations: [],
  stateDND: {},
  selected: {},
  currentStopSequence: {},
  distance: [],
  handleSelectAutoSearch() {},
  onAddAfterSelected() {},
  onAddBeforSelected() {},
  onDeleteMarkerFromMap() {},
  selectMarkerOnMap() {},
  ...props,
});

jest.mock("leaflet", () => ({
  ...jest.requireActual("leaflet"),
  markerClusterGroup: jest.fn(),
}));

const setUp = (props: any) => {
  const div = global.document.createElement("div");
  global.document.body.appendChild(div);
  const component = mount(<Map {...props} />, { attachTo: div });
  return component;
};

describe("Map component", () => {
  let wrapper: any;

  const onSelectAutoSearch = jest.fn();
  const onAddBeforSelected = jest.fn();
  const onAddAfterSelected = jest.fn();
  const onDeleteMarkerFromMap = jest.fn();
  const onClickOnMapMarker = jest.fn();

  beforeEach(() => {
    const div = global.document.createElement("div");
    global.document.body.appendChild(div);

    wrapper = setUp(
      makeProps({
        stations,
        stateDND,
        selected,
        currentStopSequence,
        distance,
        onSelectAutoSearch,
        onAddBeforSelected,
        onAddAfterSelected,
        onDeleteMarkerFromMap,
        onClickOnMapMarker,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("Should match snapshot with the Map component", () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
