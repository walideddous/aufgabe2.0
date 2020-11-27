import React from "react";
import SaveStopSequenceForm from "./SaveStopSequenceForm";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import moment from "moment";

// import some data to run test with
import { stateDND, currentStopSequence } from "../../testUtils/testData";
import { act } from "@testing-library/react";

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
        stateDND,
        saveStopSequence,
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

  it("Should not display the save form if we are in load mode and we don't have any stop sequence loaded", () => {
    mountWrapper = setUp(
      makeProps({
        loadStopSequenceSection: true,
      })
    );
    const inputName = mountWrapper.find("#name_input").at(0);
    expect(inputName.length).toBe(0);
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
    const formValues = {
      name: "Walid",
      day: ["Mon", "Tue"],
      date: [moment(), moment()],
      time: [moment(), moment()],
      timeList: [{ time: [moment(), moment()] }],
    };

    mountWrapper.find("#addSchedule_button").at(0).simulate("click");

    mountWrapper.find("#formWrapper").at(0).props().onFinish(formValues);
    mountWrapper.update();

    mountWrapper.find("#save_stopSequence").at(0).simulate("click");

    expect(saveStopSequence).toBeCalled();
  });

  it("Should display tags when we load stop sequence", () => {
    mountWrapper = setUp(
      makeProps({
        currentStopSequence,
        stateDND,
      })
    );

    expect(mountWrapper.find("#dayTime_tags0").at(0).length).not.toBeNull();
  });
  it("Should clear all tags when we click on clearAll button", () => {
    mountWrapper = setUp(
      makeProps({
        currentStopSequence,
        stateDND,
      })
    );

    const clearAllButton = mountWrapper.find("#clear_all").at(0);
    clearAllButton.simulate("click");

    expect(mountWrapper.find("#dayTime_tags0").at(0).length).toBe(0);
  });
  it("Should delete Tag when we click on x icon on Tags  ", () => {
    mountWrapper = setUp(
      makeProps({
        currentStopSequence,
        stateDND,
      })
    );

    const closeTagButton = mountWrapper.find("#dayTime_tags0").at(0);
    act(() => {
      closeTagButton.props().onClose();
    });

    mountWrapper.update();

    expect(mountWrapper.find("#dayTime_tags0").at(0).length).toBe(0);
  });
});
