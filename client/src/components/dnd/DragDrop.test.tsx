import React from "react";
import { mount, ReactWrapper } from "enzyme";
import toJSON from "enzyme-to-json";
import DragDrop from "./DragDrop";

// Import data to test
import { stateDND, selected } from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stateDND: {},
  selected: {},
  handleDragEnd() {},
  handleAddStopsOnCLick() {},
  onclick() {},
  onDelete() {},
  ...props,
});

const setUp = (props: any) => {
  const component = mount(<DragDrop {...props} />);
  return component;
};

describe("DragDrop component", () => {
  let mountWrapper: ReactWrapper;

  const handleDragEnd = jest.fn();
  const handleAddStopsOnCLick = jest.fn();
  const onclick = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    mountWrapper = setUp(
      makeProps({
        stateDND,
        selected,
        handleDragEnd,
        handleAddStopsOnCLick,
        onclick,
        onDelete,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should match snapshot of the DrapDrop component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should dispatch handleAddStopsOnCLick function when we click on addStopsButton span", () => {
    const button = mountWrapper.find("#addStopsButton").at(0);
    button.simulate("click");
    expect(handleAddStopsOnCLick).toHaveBeenCalled();
  });

  it("Should dispatch onclick function when we click on clickStops span", () => {
    const button = mountWrapper.find("#clickStops");
    button.simulate("click");
    expect(onclick).toHaveBeenCalled();
  });

  it("Should dispatch onDelete function when we click on delete Icon", () => {
    const button = mountWrapper.find("#deleteStopButton");
    button.simulate("click");
    expect(onDelete).toHaveBeenCalled();
  });
});
