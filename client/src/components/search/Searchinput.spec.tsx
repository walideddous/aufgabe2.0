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

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });

  it("Should match snapShot with the Seachinput component", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should test the AutoComplete component", () => {
    const searchField = wrappedComponent.find("#stops_autoComplete");

    act(() => {
      searchField.props().onSearch("Basel");
      searchField.props().onSelect("Basel", { stop: { name: "Basel" } });
    });

    expect(searchField.props().value).toBe("");
    expect(handleSelectAutoSearch).toBeCalled();
  });
});
