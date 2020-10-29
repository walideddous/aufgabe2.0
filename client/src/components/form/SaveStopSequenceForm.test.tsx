import React from "react";
import SaveStopsSequenceForm from "./SaveStopsSequenceForm";
import { shallow, mount } from "enzyme";

describe("SaveStopSequenceForm component", () => {
  let wrapper;
  const simulateChangeOnInput = (wrapper, inputSelector, newValue) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      target: { value: newValue },
    });
    return wrapper.find(inputSelector);
  };

  beforeEach(() => {
    wrapper = shallow(<SaveStopsSequenceForm />);
  });

  it("render SavedStopSequenceForm component without crashing", () => {
    expect(wrapper).not.toBeNull();
  });

  it("render Add schedule button without crashing", () => {
    const result = wrapper.find("#AddSchedule-button").text();
    console.log("wrapper instance", result);
    expect(result).toBe("Add schedule");
  });
});

describe("Test", () => {
  it("test ", () => {
    // to solve te issue of window.matchMedia is not a function
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

    const shallowWrapper = shallow(<SaveStopsSequenceForm />);
    const mountWrapper = mount(<SaveStopsSequenceForm />);
  });
});
