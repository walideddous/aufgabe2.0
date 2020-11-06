import React from "react";
import Aufgabe from "./index";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

const setUp = () => {
  const component = shallow(<Aufgabe />);
  return component;
};

describe("Aufgabe component => main component", () => {
  let mountWrapper: any;

  beforeEach(() => {
    mountWrapper = setUp();
  });

  it("Should match snapShot with the Aufgabe(index) component", () => {
    expect(toJSON(mountWrapper)).toMatchSnapshot();
  });
});
