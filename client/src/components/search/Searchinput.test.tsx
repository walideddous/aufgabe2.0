import React from "react";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import toJSON from "enzyme-to-json";
import Searchinput from "./SearchInput";

describe.only("Searchinput component", () => {
  let shallowWrapper: any;
  let props = {
    stations: [
      {
        _id: "5f6203bb0d5658001cd8f85a",
        name: "Basel",
        coord: {
          WGS84: {
            lat: 47.54741,
            lon: 7.58956,
          },
        },
        modes: [],
      },
      {
        _id: "5f6203bb0d5658001cd8f85b",
        name: "Lyon",
        coord: {
          WGS84: {
            lat: 45.74506,
            lon: 4.84184,
          },
        },
        modes: [],
      },
    ],
  };
  const spyOnhandleSelectAutoSearch = jest.fn();
  const setSearch = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  //@ts-ignore
  useStateSpy.mockImplementation((search: string) => [search, setSearch]);

  beforeEach(() => {
    shallowWrapper = shallow(
      //@ts-ignore
      <Searchinput
        {...props}
        handleSelectAutoSearch={spyOnhandleSelectAutoSearch}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should match snapShot with the Seachinput component", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });

  it("Should set the input value on change event", async () => {
    const mountWrapper = mount(
      //@ts-ignore
      <Searchinput
        {...props}
        handleSelectAutoSearch={spyOnhandleSelectAutoSearch}
      />
    );
    let searchField = mountWrapper.find('input[type="search"]');

    searchField.simulate("change", {
      target: {
        value: "Basel",
      },
    });

    expect(setSearch).toHaveBeenCalled();
  });

  it("Should dispatch the props function handleSelectAutoSearch onSelect", async () => {
    let searchField = shallowWrapper.find("#search");
    searchField.simulate("select");
    expect(spyOnhandleSelectAutoSearch).toHaveBeenCalled();
  });
});
