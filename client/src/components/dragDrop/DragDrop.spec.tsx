import React from "react";
import { mount, ReactWrapper } from "enzyme";
import toJSON from "enzyme-to-json";
import DragDrop from "./DragDrop";

// Import data to test
import { stateDND, selected } from "../../testUtils/testData";

// Mock the
jest.mock("react-beautiful-dnd", () => ({
  //@ts-ignore
  Droppable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {}
    ),
  //@ts-ignore
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {}
    ),
  //@ts-ignore
  DragDropContext: ({ children }) => children,
}));

const makeProps = (props: any) => ({
  stateDND: {},
  selected: {},
  onResetStopSequence() {},
  handleDragEnd() {},
  handleAddStopsOnCLick() {},
  onClick() {},
  onDelete() {},
  ...props,
});

const setUp = (props: any) => {
  const component = mount(<DragDrop {...props} />);
  return component;
};

describe("DragDrop component", () => {
  let mountWrapper: ReactWrapper;

  const onResetStopSequence = jest.fn();
  const onAddStopsOnCLick = jest.fn();
  const onDragEnd = jest.fn();
  const onClickOnDrop = jest.fn();
  const onDeleteStop = jest.fn();

  beforeEach(() => {
    mountWrapper = setUp(
      makeProps({
        stateDND,
        selected,
        onResetStopSequence,
        onAddStopsOnCLick,
        onDragEnd,
        onClickOnDrop,
        onDeleteStop,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });

  it("Should match snapshot of the DrapDrop component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should dispatch handleAddStopsOnCLick function when we click on addStopsButton span", () => {
    const button = mountWrapper.find("#addStopsButton").at(0);
    button.simulate("click");
    expect(onAddStopsOnCLick).toHaveBeenCalled();
  });

  it("Should dispatch onclick function when we click on clickStops span", () => {
    const button = mountWrapper.find("#clickStops");
    button.simulate("click");
    expect(onClickOnDrop).toHaveBeenCalled();
  });

  it("Should dispatch onDelete function when we click on delete Icon", () => {
    const button = mountWrapper.find("#deleteStopButton");
    button.simulate("click");
    expect(onDeleteStop).toHaveBeenCalled();
  });

  it("Should test the window size to hide some button", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    const button = mountWrapper.find("#item-suggestion");

    expect(button.length).toBeLessThan(10);
  });
  it("Should reset the stop sequence onClick on the reset Button ", () => {
    const clearAllButton = mountWrapper.find("#clearAll_button").at(0);
    clearAllButton.simulate("click");
    expect(onResetStopSequence).toBeCalled();
  });
});
