import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Searchinput from "./SearchInput";

const setUp = (props: any) => {
  const component = mount(<Searchinput {...props} />);
  return component;
};

describe("Searchinput component", () => {
  let mountWrapper: any;
  let props = {
    stations: [],
    handleSelectAutoSearch: jest.fn(),
  };

  beforeEach(() => {
    mountWrapper = setUp(props);
  });
  it("match snapShot with the Seachinput component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });
});
