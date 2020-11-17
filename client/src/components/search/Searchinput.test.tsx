import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Searchinput from "./SearchInput";
// Import the data to test With
import { stations } from "../../testUtils/testData";
import { act } from "@testing-library/react";

const makeProps = (props: any) => ({
  stations: [],
  handleSelectAutoSearch() {},
  ...props,
});

const setUp = (props: any) => {
  const component = shallow(<Searchinput {...props} />);
  return component;
};

describe("Searchinput component", () => {
  let wrappedComponent: any;

  const handleSelectAutoSearch = jest.fn();

  // Test the state Changes of the setSearch
  const setSearch = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  //@ts-ignore
  useStateSpy.mockImplementation((search: string) => [search, setSearch]);

  beforeEach(() => {
    wrappedComponent = setUp(
      makeProps({
        stations,
        handleSelectAutoSearch,
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should match snapShot with the Seachinput component", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should test the AutoComplete component", () => {
    const searchField = wrappedComponent.find("#search");

    act(() => {
      searchField.simulate("change", "Basel");
    });

    const AutoCompleteOptionButton = wrappedComponent.find(
      '#search Option[value="Basel"]'
    );

    expect(AutoCompleteOptionButton.length).toBeTruthy();

    act(() => {
      searchField.simulate("select");
    });

    expect(searchField.props().value).toBe("");
    expect(handleSelectAutoSearch).toBeCalled();
  });
});
