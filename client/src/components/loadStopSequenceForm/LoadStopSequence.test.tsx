import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import LoadStopSequence from "./LoadStopSequence";

const setUp = (props: any) => {
  const component = shallow(<LoadStopSequence {...props} />);
  return component;
};

describe("LoadStopSequence component", () => {
  let shallowWrapper: any;
  let props = {
    stopSequenceList: [],
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
    currentStopSequence: {},
    handleUpdateAfterSave: jest.fn(),
    onSendRequest: jest.fn(),
    ondisplayStopSequence: jest.fn(),
    handleDeleteStopSequence: jest.fn(),
    onClearAll: jest.fn(),
  };

  beforeEach(() => {
    shallowWrapper = setUp(props);
  });

  it("match snapShot with the LoadStopSequence component", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
});
