import React from "react";
import SaveStopsSequenceForm from "./SaveStopsSequenceForm";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const setUp = () => {
  const mountWrapper = shallow(<SaveStopsSequenceForm />);
  return mountWrapper;
};

describe("SaveStopSequenceForm component", () => {
  let mountWrapper: any;

  beforeEach(() => {
    mountWrapper = setUp();
  });

  it("matches snapshot of the SaveStopSequenceForm component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("render SavedStopSequenceForm component without crashing", () => {
    const wrapper = mountWrapper.find("Card");
    expect(wrapper.length).toBe(1);
  });

  it("render Add schedule button without crashing", () => {
    const result = mount(<SaveStopsSequenceForm />).find(
      "#AddSchedule-button span"
    );
    expect(result.length).toBe(1);
  });
});
