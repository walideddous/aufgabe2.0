import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Searchinput from "./SearchInput";
import { act } from "react-dom/test-utils";
// Import the data to test With
import { stations } from "../../testUtils/testData";

const makeProps = (props: any) => ({
  stations: [],
  handleSelectAutoSearch() {},
  ...props,
});

const setUp = (props: any) => {
  const component = mount(<Searchinput {...props} />);
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
    jest.clearAllMocks();
  });

  it("Should match snapShot with the Seachinput component", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should set the input value on change event", async () => {
    let searchField = wrappedComponent.find('input[type="search"]');
    searchField.simulate("change", {
      target: {
        value: "Basel",
      },
    });

    expect(wrappedComponent.find('input[type="search"]').props().value).toBe(
      "Basel"
    );
  });

  it("Should dispatch the props function handleSelectAutoSearch onSelect", async () => {
    const shallowWrapper = shallow(
      <Searchinput
        {...makeProps({
          stations,
          handleSelectAutoSearch,
        })}
      />
    );

    const selectField = shallowWrapper.find("#search");

    selectField.simulate("select");

    expect(handleSelectAutoSearch).toHaveBeenCalled();
  });
});
