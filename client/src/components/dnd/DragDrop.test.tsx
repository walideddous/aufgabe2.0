import React from "react";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import DragDrop from "./DragDrop";

const setUp = (props: any) => {
  const component = mount(<DragDrop {...props} />);
  return component;
};

describe("DragDrop component", () => {
  let mountWrapper: any;
  let props = {
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
    selected: [],
    handleDragEnd: jest.fn(),
    handleAddStopsOnCLick: jest.fn(),
    onclick: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    mountWrapper = setUp(props);
  });

  it("match snapshot with the DrapDrop component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });
});
