import React from "react";
import { ReactWrapper, shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import Header from "./Header";

const makeProps = (props: any) => ({
  radioButton: "",
  saveButtonDisabled: false,
  currentStopSequence: {},
  onClearAll() {},
  onSaveButton() {},
  onLadenButton() {},
  onErstellenButton() {},
  onAbbrechenButton() {},
  onDisplayStopSequenceQuery() {},
  onDeleteStopSequenceMutation() {},
  ...props,
});

const setUp = (props: any) => {
  const shallowWrapper = shallow(<Header {...props} />);
  return shallowWrapper;
};

describe("Test the Header Component", () => {
  let shallowWrapper: any;
  const radioButton = "";
  const saveButtonDisabled = false;
  const currentStopSequence = {};
  const onClearAll = jest.fn();
  const onSaveButton = jest.fn();
  const onLadenButton = jest.fn();
  const onErstellenButton = jest.fn();
  const onAbbrechenButton = jest.fn();
  const onDisplayStopSequenceQuery = jest.fn();
  const onDeleteStopSequenceMutation = jest.fn();

  beforeEach(() => {
    shallowWrapper = setUp(
      makeProps({
        radioButton,
        saveButtonDisabled,
        currentStopSequence,
        onClearAll,
        onSaveButton,
        onLadenButton,
        onErstellenButton,
        onAbbrechenButton,
        onDisplayStopSequenceQuery,
        onDeleteStopSequenceMutation,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });
  it("Should match the Header component snapshot", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
  it("Should test  ");
});
