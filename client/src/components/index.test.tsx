import React from "react";
import Aufgabe from "./index";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const setUp = () => {
  const div = global.document.createElement("div");
  global.document.body.appendChild(div);

  const component = mount(<Aufgabe />, { attachTo: div });
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
