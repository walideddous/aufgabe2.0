import React from "react";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import toJSON from "enzyme-to-json";
import Searchinput from "./SearchInput";

const setUp = (props: any) => {
  const component = mount(<Searchinput {...props} />);
  return component;
};

describe.only("Searchinput component", () => {
  let mountWrapper: any;
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
    handleSelectAutoSearch: jest.fn(),
  };
  const setSearch = jest.fn((search: string) => search);
  const useStateSpy = jest.spyOn(React, "useState");
  //@ts-ignore
  useStateSpy.mockImplementation((search: string) => [search, setSearch]);

  beforeEach(() => {
    mountWrapper = setUp(props);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("match snapShot with the Seachinput component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });

  it("should set the input value on change event  ", async () => {
    let searchField = mountWrapper.find('input[type="search"]');
    await act(async () => {
      searchField.simulate("change", {
        target: {
          value: "Basel",
        },
      });
    });
    expect(setSearch).toHaveBeenCalled();
  });
});
