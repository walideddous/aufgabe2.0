import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import NavBar from "./NavBar";

const setUp = (props: any) => {
  const wrapper = mount(<NavBar {...props} />);
  return wrapper;
};

describe("NavBar component", () => {
  let wrapper: any;
  let props = {
    isSending: false,
    stateDND: {
      vorschlag: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    },
    stopSequenceList: [],
    savedStopSequence: {},
    updateDate: "",
    currentMode: [],
    currentStopSequenceName: [],
    onSendRequest: jest.fn(),
    onClearAll: jest.fn(),
    handleUpdateAfterSave: jest.fn(),
    handleDeleteStopSequence: jest.fn(),
    ondisplayStopSequence: jest.fn(),
  };
  beforeEach(() => {
    wrapper = setUp(props);
  });

  it("Should Match snapshot with the Navbar component", () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
