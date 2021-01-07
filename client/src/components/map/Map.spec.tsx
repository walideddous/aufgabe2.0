import React from "react";
import { mount, shallow } from "enzyme";
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
  onResetStopSequence() {},
  handleSelectAutoSearch() {},
  onAddAfterSelected() {},
  onAddBeforSelected() {},
  onDeleteStop() {},
  selectMarkerOnMap() {},
  ...props,
});

jest.mock("leaflet", () => ({
  ...jest.requireActual("leaflet"),
  markerClusterGroup: jest.fn(() => {}),
}));

const setUp = (props: any) => {
  const div = global.document.createElement("div");
  global.document.body.appendChild(div);
  const component = mount(<Map {...props} />, { attachTo: div });
  return component;
};

const onResetStopSequence = jest.fn();
const onSelectAutoSearch = jest.fn();
const onAddBeforSelected = jest.fn();
const onAddAfterSelected = jest.fn();
const onDeleteStop = jest.fn();
const onClickOnMapMarker = jest.fn();

describe("Map component", () => {
  const div = global.document.createElement("div");
  global.document.body.appendChild(div);

  let mountwrapper: any;

  beforeEach(() => {
    mountwrapper = setUp(
      makeProps({
        stations,
        stateDND,
        selected,
        currentStopSequence,
        distance,
        onResetStopSequence,
        onSelectAutoSearch,
        onAddBeforSelected,
        onAddAfterSelected,
        onDeleteStop,
        onClickOnMapMarker,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("Should match snapshot with the Map component", () => {
    expect(toJSON(mountwrapper)).toMatchSnapshot();
  });
});

it("Should clear the map when we click on the trash button", () => {
  const button = shallow(
    <Map
      {...makeProps({
        stations,
        stateDND,
        selected,
        currentStopSequence,
        distance,
        onResetStopSequence,
        onSelectAutoSearch,
        onAddBeforSelected,
        onAddAfterSelected,
        onDeleteStop,
        onClickOnMapMarker,
      })}
    />
  ).find("div[className='trash_button']");

  button.simulate("click");

  expect(onResetStopSequence).toBeCalled();
});
