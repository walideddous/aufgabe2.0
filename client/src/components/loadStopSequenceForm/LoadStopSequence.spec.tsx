import React from "react";
import { shallow } from "enzyme";
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
  onSendRequest() {},
  ondisplayStopSequence() {},
  handleDeleteStopSequence() {},
  onClearAll() {},
  ...props,
});

const setUp = (props: any) => {
  const component = shallow(<LoadStopSequence {...props} />);
  return component;
};

describe("LoadStopSequence component", () => {
  let shallowWrapper: any;

  const onLoadMode = jest.fn();
  const onSendRequest = jest.fn();
  const onUpdateAfterSave = jest.fn();
  const onClearAll = jest.fn();
  const onDeleteStopSequence = jest.fn();
  const ondisplayStopSequence = jest.fn();

  beforeEach(() => {
    shallowWrapper = setUp(
      makeProps({
        stopSequenceList,
        currentStopSequence,
        onLoadMode,
        onSendRequest,
        onUpdateAfterSave,
        onClearAll,
        onDeleteStopSequence,
        ondisplayStopSequence,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should match the LoadStopSequence component snapshot", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });

  it("Should disptach the onSendRequest props function when we choose the mode", () => {
    const modeSelector = shallowWrapper.find("#mode_selector");

    expect(modeSelector.props().value).toEqual("Choose mode");

    modeSelector.simulate("change", "4");

    expect(onSendRequest).toHaveBeenCalledWith("4");
  });

  it("Should dispatch the onClearAll props function when we choose the new button", () => {
    const radioButton = shallowWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "new",
      },
    });

    expect(onClearAll).toHaveBeenCalled();
    expect(onLoadMode).toHaveBeenCalledWith(false);
  });

  it("Should dispatch the handleUpdateAfterSave props function when we choose load button", () => {
    const radioButton = shallowWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    expect(onUpdateAfterSave).toHaveBeenCalled();
    expect(onLoadMode).toHaveBeenCalledWith(true);
  });

  it("Should dispatch ondisplayStopSequence props function on select value in Auto-complete field ", () => {
    const radioButton = shallowWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    const AutoCompleteInput = shallowWrapper.find("#stopSequence_autoComplete");

    AutoCompleteInput.props().onChange("Test");
    AutoCompleteInput.props().onSelect("Test");

    expect(ondisplayStopSequence).toHaveBeenCalled();
  });

  it("Schould delete the stop sequence when we click on the delete stop sequence button", () => {
    const radioButton = shallowWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    const AutoCompleteInput = shallowWrapper.find("#stopSequence_autoComplete");

    AutoCompleteInput.props().onChange("Test");
    AutoCompleteInput.props().onSelect("Test");

    shallowWrapper.find("#delete_stopSequence").at(0).simulate("click");

    expect(onDeleteStopSequence).toBeCalledWith(currentStopSequence._id);
  });
});