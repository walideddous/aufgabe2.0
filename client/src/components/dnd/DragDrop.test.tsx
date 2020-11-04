import React from "react";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import DragDrop from "./DragDrop";

const table = () => {
  const tab = new Array(16).fill({
    angle: -83.19868517601843,
    coord: { WGS84: { lat: 46.17857, lon: 6.08606 } },
    distance: 0.17031643195093935,
    modes: ["4", "5"],
    name: "Bernex 1",
    _id: "5f6206390d5658001cd959b4",
  });

  return tab;
};

describe("DragDrop component", () => {
  let mountWrapper: any;
  let props = {
    stateDND: {
      vorschlag: {
        title: "Suggestion",
        items: table(),
      },
      trajekt: {
        title: "Stop sequence",
        items: [
          {
            coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
            index: 0,
            modes: ["4", "5"],
            name: "Confignon, croisée",
            _id: "5f6205c60d5658001cd9480b",
          },
        ],
      },
    },
    selected: {
      coord: { WGS84: { lat: 46.17831, lon: 6.08824 } },
      index: 0,
      modes: ["4", "5"],
      name: "Confignon, croisée",
      _id: "5f6205c60d5658001cd9480b",
    },
  };

  const spyOnHandleDragEnd = jest.fn();
  const spyOnHandleAddStopsOnCLick = jest.fn();
  const spyOnOnclick = jest.fn();
  const spyOnDelete = jest.fn();

  beforeEach(() => {
    mountWrapper = mount(
      //@ts-ignore
      <DragDrop
        {...props}
        handleDragEnd={spyOnHandleDragEnd}
        handleAddStopsOnCLick={spyOnHandleAddStopsOnCLick}
        onclick={spyOnOnclick}
        onDelete={spyOnDelete}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot with the DrapDrop component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("Should dispatch handleAddStopsOnCLick function when we click on addStopsButton span", () => {
    const button = mountWrapper.find("#addStopsButton").at(0);
    button.simulate("click");
    expect(spyOnHandleAddStopsOnCLick).toHaveBeenCalled();
  });

  it("Should dispatch onclick function when we click on clickStops span", () => {
    const button = mountWrapper.find("#clickStops");
    button.simulate("click");
    expect(spyOnOnclick).toHaveBeenCalled();
  });

  it("Should dispatch onDelete function when we click on delete Icon", () => {
    const button = mountWrapper.find("#deleteStopButton");
    button.simulate("click");
    expect(spyOnDelete).toHaveBeenCalled();
  });
});
