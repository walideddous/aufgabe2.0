import React from "react";
import Aufgabe from "./index";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

const setUp = () => {
  const div = global.document.createElement("div");
  global.document.body.appendChild(div);

  const component = mount(<Aufgabe />, { attachTo: div });
  return component;
};

describe("Aufgabe component => main component", () => {
  let wrapperComponent: any;

  beforeEach(() => {
    wrapperComponent = setUp();
  });

  it("Should match snapShot with the Aufgabe(index) component", () => {
    expect(toJSON(wrapperComponent)).toMatchSnapshot();
  });
});
