import React from "react";
import SaveStopSequenceForm from "./SaveStopSequenceForm";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";

// import some data to run test with
import { stateDND, currentStopSequence } from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stateDND: {},
  currentStopSequence: {},
  loadStopSequenceSection: true,
  saveStopSequence() {},
  ...props,
});

const setUp = (props: any) => {
  const mountWrapper = mount(<SaveStopSequenceForm {...props} />);
  return mountWrapper;
};

describe("SaveStopSequenceForm component", () => {
  let mountWrapper: any;
  const spyOnConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
  const saveStopSequence = jest.fn();

  beforeEach(() => {
    mountWrapper = setUp(
      makeProps({
        saveStopSequence,
        stateDND,
        currentStopSequence,
        loadStopSequenceSection: false,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should matches snapshot with the SaveStopSequenceForm component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should display the input form when we click on add schedule button", () => {
    const addButton = mountWrapper.find("#addSchedule_button").at(0);
    addButton.simulate("click");

    expect(mountWrapper.find("#cancel_button").at(0).length).toBe(1);
  });

  it("Should display the input form when we click on add schedule button", () => {
    const addButton = mountWrapper.find("#addSchedule_button").at(0);
    addButton.simulate("click");

    expect(mountWrapper.find("#cancel_button").at(0).length).toBe(1);
  });

  it("Should hide the input form on click on Cancel", () => {
    const addButton = mountWrapper.find("#addSchedule_button").at(0);
    addButton.simulate("click");

    const cancelButton = mountWrapper.find("#cancel_button").at(0);
    cancelButton.simulate("click");

    expect(mountWrapper.find("#cancel_button").length).toBe(0);
  });

  it("Should remove timePicker on Click on remove time Picker button", () => {
    mountWrapper.find("#addSchedule_button").at(0).simulate("click");

    const timePickerButton = mountWrapper.find("#addTime_button").at(0);

    timePickerButton.simulate("click");
    expect(mountWrapper.find("#timePicker_input0").at(0).length).toBe(1);

    const removeTimePickerButton = mountWrapper
      .find("#remove_timePicker")
      .at(0);

    removeTimePickerButton.simulate("click");

    expect(mountWrapper.find("#timePicker_input0").at(0).length).toBe(0);
  });

  it("Should display console warn when we submit and the Fields are Empty", () => {
    mountWrapper.find("#addSchedule_button").at(0).simulate("click");

    const submitButton = mountWrapper.find("form").at(0);
    //Submit form
    submitButton.simulate("submit", (e: any) => {
      e.preventDefault();
    });

    expect(spyOnConsoleWarn).toHaveBeenCalled();
  });

  it("Should save information after click on the save stopSequence button", () => {
    // Click on the Button
    mountWrapper.find("#addSchedule_button").at(0).simulate("click");
    mountWrapper.find("#addTime_button").at(0).simulate("click");
    // Input field

    const inputName = mountWrapper.find("#name_input").at(0);
    const selectDate1 = mountWrapper.find("#date_input").at(0);
    const selectDate2 = mountWrapper.find("#date_input").at(1);
    const dayInput = mountWrapper.find("#dayPicker_input").at(0);
    const selectTime1 = mountWrapper.find("#timePicker_input0").at(0);
    const selectTime2 = mountWrapper.find("#timePicker_input0").at(1);
    // Button
    const submitButton = mountWrapper.find("#save_schedule").at(0);

    inputName.props().value = "Walid";
    dayInput.props().value = "Mon";
    selectDate1.props().value = "2020.11.24";
    selectDate2.props().value = "2020.12.16";
    selectTime1.props().value = "05:00";
    selectTime2.props().value = "11:00";

    //Submit form
    submitButton.simulate("click");

    const saveStopSequenceButton = mountWrapper
      .find("#save_stopSequence")
      .at(0);
    saveStopSequenceButton.simulate("click");

    expect(saveStopSequence).toBeCalled();
  });
});

/*
{
      name: "Walid",
      schedule: [
        {
          date: "2020.11.24-2020.12.16",
          dayTime: [
            {
              day: ["Mon"],
              time: ["05:00", "11:00"],
            },
          ],
        },
      ],
    }


*/
