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

const setUp = (props: any) => {
  const mountWrapper = mount(<SaveStopsSequenceForm {...props} />);
  return mountWrapper;
};

describe.only("SaveStopSequenceForm component", () => {
  let mountWrapper: any;
  let result = jest.fn();

  beforeEach(() => {
    mountWrapper = setUp(result);
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

  it("Should display tags as wanted after submit", () => {
    // CLick on the Button
    mountWrapper
      .find("#AddSchedule-button")
      .at(0)
      .simulate("click", {
        preventDefault: () => {},
      });
    mountWrapper
      .find("#addTime_Button")
      .at(0)
      .simulate("click", {
        preventDefault: () => {},
      });
    // Input fild
    const inputName = mountWrapper.find("#name-input").at(0);
    const dayInput = mountWrapper.find("#dayPicker-input").at(0);
    const selectDate1 = mountWrapper.find("#date-input").at(0);
    const selectDate2 = mountWrapper.find("#date-input").at(1);
    const selectTime1 = mountWrapper.find("#timePicker-input").at(0);
    const selectTime2 = mountWrapper.find("#timePicker-input").at(1);
    // Button
    const submitButton = mountWrapper.find("form").at(0);

    inputName.props().value = "walid";
    dayInput.simulate("change", {
      target: {
        value: "Mon",
      },
    });
    selectDate1.props().value = "2020-11-10";
    selectDate2.props().value = "2020-12-10";
    selectTime1.props().value = "03:00";
    selectTime2.props().value = "06:00";

    //Submit form
    submitButton.props().onSubmit();

    expect(mountWrapper.find("#save_button").at(0).length).toBe(0);
    expect(mountWrapper.find("form").at(0).props()).toBe("bien");
  });
});
