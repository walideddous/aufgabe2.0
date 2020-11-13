import React from "react";
import Aufgabe from "./index";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";

// Import the data to test with
import { stations } from "../testUtils/testData";
// Import services

import { act } from "@testing-library/react";

const setUp = () => {
  const component = mount(<Aufgabe />);
  return component;
};

// Mock the map component
jest.mock("./map/Map.tsx", () => () => <div id="mapMock">Map mocked</div>);

// Mock the antdesign Select component
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  const Select = ({ children, onChange }: any) => {
    return (
      <select
        onChange={(e: any) => {
          onChange(e.target.value);
        }}
      >
        {children}
      </select>
    );
  };

  Select.Option = ({ children, otherProps }: any) => {
    return <option {...otherProps}>{children}</option>;
  };

  return {
    ...antd,
    Select,
  };
});

describe("Aufgabe component => main component", () => {
  let wrappedComponent: any;

  beforeEach(() => {
    wrappedComponent = setUp();
  });

  afterEach(() => {
    jest.clearAllMocks;
  });

  it("Should match snapShot with the Aufgabe(index) component", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should dispatch the sendRequest function to fetch the Data", async () => {
    const modeSelector = await wrappedComponent.find("#mode_selector").first();

    act(() => {
      modeSelector.simulate("change", { target: { value: "4" } });
    });
  });
});
