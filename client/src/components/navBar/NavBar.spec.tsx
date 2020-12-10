import React from "react";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import NavBar from "./NavBar";

// import the data to test with
import { stateDND, stopSequenceList } from "../../testUtils/testData";

const makeProps = (props: any) => ({
  isSending: false,
  stateDND: {},
  stopSequenceList: [],
  savedStopSequence: {},
  updateDate: "",
  currentMode: [],
  currentStopSequenceName: [],
  onSendRequest() {},
  onClearAll() {},
  handleUpdateAfterSave() {},
  handleDeleteStopSequence() {},
  ondisplayStopSequence() {},
  ...props,
});

const setUp = (props: any) => {
  const wrapper = mount(<NavBar {...props} />);
  return wrapper;
};

describe("NavBar component", () => {
  let wrapper: any;

  const onSendRequest = jest.fn();
  const onClearAll = jest.fn();
  const handleUpdateAfterSave = jest.fn();
  const handleDeleteStopSequence = jest.fn();
  const ondisplayStopSequence = jest.fn();

  beforeEach(() => {
    wrapper = setUp(
      makeProps({
        stateDND,
        stopSequenceList,
        onSendRequest,
        onClearAll,
        handleUpdateAfterSave,
        handleDeleteStopSequence,
        ondisplayStopSequence,
      })
    );
  });

  it("Should Match snapshot with the Navbar component", () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
