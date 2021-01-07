import React from "react";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import LoadStopSequence from "./LoadStopSequence";

// import data to test
import {
  stopSequenceList,
  currentStopSequence,
} from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stopSequenceList: [],
  currentStopSequence: {},
  loadMode() {},
  handleUpdateAfterSave() {},
  onStopsQuery() {},
  ondisplayStopSequence() {},
  handleDeleteStopSequenceMutation() {},
  onClearAll() {},
  ...props,
});

const setUp = (props: any) => {
  const component = mount(<LoadStopSequence {...props} />);
  return component;
};

describe("LoadStopSequence component", () => {
  let mountWrapper: any;

  const currentMode = ["4"];

  const onLoadMode = jest.fn();
  const onStopsQuery = jest.fn();
  const onUpdateAfterSave = jest.fn();
  const onClearAll = jest.fn();
  const onDeleteStopSequence = jest.fn();
  const ondisplayStopSequence = jest.fn();
  const onStopSequenceSearch = jest.fn();

  beforeEach(() => {
    mountWrapper = setUp(
      makeProps({
        stopSequenceList,
        currentStopSequence,
        currentMode,
        onStopSequenceSearch,
        onLoadMode,
        onStopsQuery,
        onClearAll,
        onDeleteStopSequence,
        ondisplayStopSequence,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });

  it("Should match the LoadStopSequence component snapshot", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should disptach the onStopsQuery props function when we choose the mode", () => {
    console.log(mountWrapper);

    const radioButton = mountWrapper.find("#radioButton");

    radioButton.props().value = "new";

    const modeSelector = mountWrapper.find("#mode_selector");

    expect(modeSelector.props().value).toEqual("Choose mode");

    modeSelector.simulate("change", "4");

    expect(onStopsQuery).toHaveBeenCalledWith(["4"]);
  });

  it("Should dispatch the onClearAll props function when we choose the new button", () => {
    const radioButton = mountWrapper.find("#radioButton");

    console.log(radioButton);

    radioButton.simulate("change", {
      target: {
        value: "new",
      },
    });

    expect(onClearAll).toHaveBeenCalled();
    expect(onLoadMode).toHaveBeenCalledWith(false);
  });

  it("Should dispatch the handleUpdateAfterSave props function when we choose load button", () => {
    const radioButton = mountWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    expect(onUpdateAfterSave).toHaveBeenCalled();
    expect(onLoadMode).toHaveBeenCalledWith(true);
  });

  it("Should dispatch ondisplayStopSequence props function on select value in Auto-complete field ", () => {
    const radioButton = mountWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    const AutoCompleteInput = mountWrapper.find("#stopSequence_autoComplete");

    AutoCompleteInput.props().onChange("Test");
    AutoCompleteInput.props().onSelect("Test");

    expect(ondisplayStopSequence).toHaveBeenCalled();
  });

  it("Schould delete the stop sequence when we click on the delete stop sequence button", () => {
    const radioButton = mountWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    const AutoCompleteInput = mountWrapper.find("#stopSequence_autoComplete");

    AutoCompleteInput.props().onChange("Test");
    AutoCompleteInput.props().onSelect("Test");

    mountWrapper.find("#delete_stopSequence").at(0).simulate("click");

    expect(onDeleteStopSequence).toBeCalledWith(currentStopSequence._id);
  });
});
