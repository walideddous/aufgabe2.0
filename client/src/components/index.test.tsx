import React from "react";
import Aufgabe from "./index";
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";

import { renderHook, act } from "@testing-library/react-hooks";
import useIndexHooks from "../customHooks/useIndexHooks";

import stopService from "../services/stopsService";
import { queryStopSequence } from "../services/stopSequenceService";
import { mock } from "sinon";

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
  let spyOnConsole: any;

  beforeEach(() => {
    wrappedComponent = setUp();
    spyOnConsole = spyOn(console, "log");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("Should match snapShot with the Aufgabe(index) component", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should dispatch the console log if we don't have stop in Backend", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.sendRequest("4");
    });

    await waitForNextUpdate();

    expect(spyOnConsole).toHaveBeenCalledWith(
      "stops or stopSequence don't exists"
    );
  });
});

/*
jest.mock("../services/stopsService.ts", () => {
  return {
    __esModule: true,
    default: jest.fn(async () => [
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
    ]),
  };
});
jest.mock("../services/stopSequenceService.ts", () => {
  return {
    __esModule: true,
    default: jest.fn(async () => [
      {
        _id: "c03295ea-5a3f-43e8-83ea-7736ce82cfd9",
        name: "St. Gallen to Zürich HB",
        date: ["2020-10-16", "2020-11-27"],
        schedule: [
          {
            day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            time: [
              {
                start: "07:00",
                end: "12:00",
              },
              {
                start: "13:00",
                end: "18:00",
              },
            ],
          },
          {
            day: ["saturday", "sunday"],
            time: [
              {
                start: "07:00",
                end: "12:00",
              },
            ],
          },
        ],
        modes: "13",
        stopSequence: [
          {
            _id: "5f62045b0d5658001cd910c4",
            name: "St. Gallen",
            modes: ["13", "5"],
            coord: {
              WGS84: {
                lat: 47.42318,
                lon: 9.3699,
              },
            },
          },
          {
            _id: "5f62045b0d5658001cd910c1",
            name: "St. Gallen Bruggen",
            modes: ["13"],
            coord: {
              WGS84: {
                lat: 47.4072,
                lon: 9.32965,
              },
            },
          },
        ],
      },
    ]),
  };
});

*/
