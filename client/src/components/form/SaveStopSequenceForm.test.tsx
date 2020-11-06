import React from "react";
import SaveStopsSequenceForm from "./SaveStopsSequenceForm";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

// Testing with react testing library
import { act } from "@testing-library/react";
import "@testing-library/jest-dom";

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
  const mountWrapper = mount(<SaveStopsSequenceForm />);
  return mountWrapper;
};

describe("SaveStopSequenceForm component", () => {
  let mountWrapper: any;

  beforeEach(() => {
    mountWrapper = setUp();
  });

  it("Should matches snapshot with the SaveStopSequenceForm component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should display the input form when we click on add schedule button", () => {
    const addButton = mountWrapper.find("#AddSchedule-button").at(0);
    addButton.simulate("click");
    mountWrapper.update();

    expect(mountWrapper.find("#Cancel-button").at(0).length).toBe(1);
  });

  it("Should display the input form when we click on add schedule button", () => {
    const addButton = mountWrapper.find("#AddSchedule-button").at(0);
    addButton.simulate("click");

    expect(mountWrapper.find("#Cancel-button").at(0).length).toBe(1);
  });

  it("Should hide the input form on click on Cancel", () => {
    const addButton = mountWrapper.find("#AddSchedule-button").at(0);
    addButton.simulate("click");

    const cancelButton = mountWrapper.find("#Cancel-button").at(0);
    cancelButton.simulate("click");

    expect(mountWrapper.find("#Cancel-button").length).toBe(0);
  });

  /*
  it("Should display tags as wanted after submit", () => {
    // Input fild
    const inputName = mountWrapper.find("#name-input").at(0);

    const addButton = mountWrapper.find("#AddSchedule-button").at(0);
    addButton.simulate("click");
    mountWrapper.update();

    const selectDays = mountWrapper.find("#dayPicker-input").at(0);
    const selectDate = mountWrapper.find("#date-input").at(0);
    const selectTime = mountWrapper.find("#timePicker-input").at(0);
    // Submit button
    const submitButton = mountWrapper.find("#save_button");

    inputName.simulate("change", { target: { value: "Walid" } });
    selectDays.simulate("change", { target: { value: "monday" } });
    selectDate.simulate("change", {
      target: { value: "2020-11-06 2020-12-16" },
    });
    selectTime.simulate("change", { target: { value: "01:00 06:00" } });

    submitButton.simulate("submit");
    mountWrapper.update();

    const tag = mountWrapper.find("#time_output").text();
    const date = mountWrapper.find("#date_output").text();

    expect(tag).toBe("Mon 01:00 - 06:00");
    expect(date).toBe("2020.11.06 - 2020.12.16");
  });
  */
});
