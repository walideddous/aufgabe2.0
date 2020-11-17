import React from "react";
import Aufgabe from "./index";
import { mount, shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import { renderHook, act } from "@testing-library/react-hooks";
import useIndexHooks from "../customHooks/useIndexHooks";

import { getStopsByMode } from "../services/stopsService";
import { queryStopSequence } from "../services/stopSequenceService";

const setUp = () => {
  const component = shallow(<Aufgabe />);
  return component;
};

// Mock the map component
jest.mock("./map/Map.tsx", () => () => <div id="mapMock">Map mocked</div>);

// Mock the different services that call the Backend API
jest.mock("../services/stopsService.ts", () => ({
  getStopsByMode: jest.fn(() =>
    Promise.resolve({
      data: {},
    })
  ),
}));

jest.mock("../services/stopSequenceService.ts", () => ({
  ...jest.requireActual("../services/stopSequenceService.ts"),
  queryStopSequence: jest.fn(() =>
    Promise.resolve({
      data: {},
    })
  ),
}));

describe("Aufgabe component => main component", () => {
  let wrappedComponent: any;
  let spyOnConsoleLog: any;
  let spyOnConsoleWarn: any;

  describe("Fetch data functionality", () => {
    beforeEach(() => {
      wrappedComponent = setUp();
      spyOnConsoleLog = spyOn(console, "log");
      spyOnConsoleWarn = spyOn(console, "error");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      //@ts-ignore
      getStopsByMode.mockRestore();
      //@ts-ignore
      queryStopSequence.mockRestore();
    });

    it("Should match snapShot with the Aufgabe(index) component", () => {
      expect(toJSON(wrappedComponent)).toMatchSnapshot();
    });

    it("Should dispatch the console log if we don't have stops or stopSequence in Backend", async () => {
      const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

      act(() => {
        result.current.sendRequest("4");
      });

      await waitForNextUpdate();

      expect(spyOnConsoleLog).toBeCalledWith(
        "stops or stopSequence don't exists"
      );
    });
    it("Should dispatch the console Warn if we catch error from tryCatch block", async () => {
      //@ts-ignore
      getStopsByMode.mockImplementation(() => Promise.reject("error"));
      //@ts-ignore
      queryStopSequence.mockImplementation(() => Promise.reject("error"));
      const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

      act(() => {
        result.current.sendRequest("4");
      });

      await waitForNextUpdate();

      expect(spyOnConsoleWarn).toBeCalled();
    });
    it("Should set the state if we get data from the Backend", async () => {
      //@ts-ignore
      getStopsByMode.mockImplementation(() =>
        Promise.resolve({
          data: {
            data: {
              haltestelleByMode: [
                { _id: "1", name: "Basel" },
                { _id: "2", name: "Genf" },
              ],
            },
          },
        })
      );
      //@ts-ignore
      queryStopSequence.mockImplementation(() =>
        Promise.resolve({
          data: {
            data: {
              stopSequenceByMode: [
                { _id: "1", name: "St. Gallen to Zürich HB" },
              ],
            },
          },
        })
      );
      const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

      act(() => {
        result.current.sendRequest("4");
      });

      await waitForNextUpdate();

      expect(result.current.stations.length).toBe(2);
      expect(result.current.stopSequenceList.length).toBe(1);
    });
  });
});
