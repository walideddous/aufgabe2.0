import React from "react";
import { mount, shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import LoadStopSequence from "./LoadStopSequence";

// import data to test
import {
  stopSequenceList,
  stateDND,
  currentStopSequence,
} from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stopSequenceList: [],
  stateDND: {},
  currentStopSequence: {},
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

  const handleUpdateAfterSave = jest.fn();
  const onSendRequest = jest.fn();
  const ondisplayStopSequence = jest.fn();
  const handleDeleteStopSequence = jest.fn();
  const onClearAll = jest.fn();

  beforeEach(() => {
    shallowWrapper = setUp(
      makeProps({
        stopSequenceList,
        stateDND,
        currentStopSequence,
        handleUpdateAfterSave,
        onSendRequest,
        ondisplayStopSequence,
        handleDeleteStopSequence,
        onClearAll,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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
  });

  it("Should dispatch the handleUpdateAfterSave props function when we choose load button", () => {
    const radioButton = shallowWrapper.find("#radioButton");

    radioButton.simulate("change", {
      target: {
        value: "load",
      },
    });

    expect(handleUpdateAfterSave).toHaveBeenCalled();
  });

  it("Should dispatch ondisplayStopSequence props function on select value in Auto-complete field ", () => {
    const AutoCompleteInput = shallowWrapper.find("#stopSequence_autoComplete");

    AutoCompleteInput.simulate("select", {
      target: {
        value: "St. Gallen to Zürich HB",
      },
    });

    expect(ondisplayStopSequence).toHaveBeenCalled();
  });
});
