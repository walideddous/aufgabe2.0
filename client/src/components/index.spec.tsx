import React from "react";
import { mount, ReactWrapper } from "enzyme";
import toJSON from "enzyme-to-json";

import { renderHook, act } from "@testing-library/react-hooks";
import useIndexHooks from "../customHooks/useIndexHooks";

import { getStopsByMode } from "../services/stopsService";
import {
  queryStopSequenceRequest,
  deleteStopSequenceRequest,
  saveStopSequenceRequest,
} from "../services/stopSequenceService";

// Mock the map component
jest.mock("./map/Map.tsx", () => () => <div id="mapMock">Map mocked</div>);

// Mock the stops services that call the Backend API
jest.mock("../services/stopsService.ts", () => ({
  getStopsByMode: jest.fn(),
}));

// Mock the stopSequence services that call the Backend API
jest.mock("../services/stopSequenceService.ts", () => ({
  queryStopSequenceRequest: jest.fn(),
  deleteStopSequenceRequest: jest.fn(),
  saveStopSequenceRequest: jest.fn(),
}));

describe("Test the customHooks of the /components/index.tsx", () => {
  const Aufgabe = require("../components/index").default;

  let wrappedComponent: ReactWrapper;
  let spyOnConsoleLog: any;
  let spyOnConsoleError: any;

  const setUp = () => {
    const component = mount(<Aufgabe />);
    return component;
  };

  beforeEach(() => {
    wrappedComponent = setUp();
    spyOnConsoleLog = spyOn(console, "log");
    spyOnConsoleError = spyOn(console, "error");

    //@ts-ignore
    getStopsByMode.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            haltestelleByMode: [
              {
                _id: "5f6203bb0d5658001cd8f85a",
                name: "Basel",
                coord: {
                  WGS84: {
                    lat: 47.54741,
                    lon: 7.58956,
                  },
                },
                modes: ["4"],
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
                modes: ["4"],
              },
            ],
          },
        },
      })
    );
    //@ts-ignore
    queryStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            stopSequenceByMode: [{ _id: "1", name: "St. Gallen to Zürich HB" }],
          },
        },
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should match snapShot with the main component => component/index", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should store the data in local if we send a request to the Backend", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);
  });

  it("Should dispatch the console log if we don't find stops or stopSequence in Backend", async () => {
    // Mock the response of the backend to get an empty object
    //@ts-ignore
    getStopsByMode.mockImplementation(() => Promise.resolve({}));
    //@ts-ignore
    queryStopSequenceRequest.mockImplementation(() => Promise.resolve({}));

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleLog).toBeCalledWith(
      "stops or stopSequence don't exists"
    );
  });
  it("Should dispatch the console Warn if we catch error from tryCatch block", async () => {
    // Mock the response of the backend to get an error
    //@ts-ignore
    getStopsByMode.mockImplementation(() => Promise.reject("error"));
    //@ts-ignore
    queryStopSequenceRequest.mockImplementation(() => Promise.reject("error"));
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalled();
  });
  it("Should select the stop when we trigger the onSelectAutoSearch function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });
    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stateDND.trajekt.items.length).toBe(0);
    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(1);
  });
  it("Should display stopSequence when we trigger the handledisplayStopSequence  function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);
    act(() => {
      result.current.handledisplayStopSequence("St. Gallen to Zürich HB");
    });

    expect(result.current.currentStopSequence).not.toBeNull();
  });
  it("Should select the stop and calculate the distance when we trigger the clickOnDrop function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);
    act(() => {
      result.current.handleClickOnDrop(
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
        1
      );
    });

    expect(result.current.selected?.name).toBe("Lyon");
  });
  it("Should select the stop when we trigger the clickOnDrop function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);
    act(() => {
      result.current.handleClickOnDrop(
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
        1
      );
    });

    expect(result.current.selected?.name).toBe("Lyon");
  });
  it("Should add stop on stopSequence field when we trigger the handleAddStopsOnCLick  function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);

    act(() => {
      result.current.handleAddStopsOnCLick({
        _id: "5f6203bb0d5658001cd8f85b",
        name: "Lyon",
        coord: {
          WGS84: {
            lat: 45.74506,
            lon: 4.84184,
          },
        },
        modes: [],
      });
    });

    expect(
      result.current.stateDND.trajekt.items.filter((el) => el.name === "Lyon")
        .length
    ).toBeTruthy();
  });
  it("Should add stop on stopSequence field when we trigger the clickOnMapMarker function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);

    act(() => {
      result.current.handleClickOnMapMarker(
        {
          _id: "5f6203bb0d5658001cd8f85b",
          name: "Lyon",
          coord: {
            WGS84: {
              lat: 45.74506,
              lon: 4.84184,
            },
          },
          modes: ["4"],
        },
        1
      );
    });

    expect(
      result.current.stateDND.trajekt.items.filter((el) => el.name === "Lyon")
        .length
    ).toBeTruthy();
  });
  it("Should check if the deleting was succesful when we trigger the handleDeleteStopSequence function", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() => Promise.resolve({}));
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleDeleteStopSequence("1");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith(
      "Couldn't delete the Stop sequence"
    );
  });
  it("Should catch the error when the handleDeleteStopSequence function reject error", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() => Promise.reject("error"));
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleDeleteStopSequence("1");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("error", "error from trycatch");
  });
  it("Should delete the stop Sequence when we trigger the handleDeleteStopSequence function", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          msg: "deleted successfully",
        },
      })
    );
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());
    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    const beforeDeleteStopSequenceLength =
      result.current.stopSequenceList.length;

    act(() => {
      result.current.handleDeleteStopSequence("1");
    });

    await waitForNextUpdate();

    expect(result.current.stopSequenceList.length).toEqual(
      beforeDeleteStopSequenceLength - 1
    );
  });
  it("Should not save the stop if the stop sequence field is empty", () => {
    const { result } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSaveStopSequence("1");
    });

    expect(spyOnConsoleError).not.toBeCalled();
  });
  it("Should save the stop sequence when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          msg: "succesfuly saved",
        },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequence("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleLog).toBeCalledWith("Stop sequence succesfully saved");
  });
  it("Should catch the catch error when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() => Promise.reject("error"));

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequence("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("error", "error from trycatch");
  });
  it("Should check if the saving was succesful when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() => Promise.resolve({}));

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequence("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("Couldn't save the stop sequence");
  });
  it("Should check the handleAddAfterSelected function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleAddAfterSelected("Lyon");
    });

    expect(result.current.stateDND.trajekt.items[1].name).toBe("Lyon");
  });
  it("Should check the handleAddBeforeSelected function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleAddBeforSelected("Lyon");
    });

    expect(result.current.stateDND.trajekt.items[0].name).toBe("Lyon");
  });
  it("Should check the handleUpdateAfterSave function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          msg: "succesfuly saved",
        },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequence("formInput");
    });

    await waitForNextUpdate();
    expect(result.current.savedStopSequence.length).toBe(1);

    act(() => {
      result.current.handleUpdateAfterSave();
    });

    expect(result.current.savedStopSequence.length).toBe(0);
  });
  it("Should check the handleDeleteMarkerFromMap function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stateDND.trajekt.items.length).toBe(0);

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(1);

    act(() => {
      result.current.handleDeleteMarkerFromMap("Basel");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(0);
  });
  it("Should check the handleDeleteMarkerFromMap function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stateDND.trajekt.items.length).toBe(0);

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });
    act(() => {
      result.current.handleSelectAutoSearch("Lyon");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(2);

    act(() => {
      result.current.handleClickOnMapMarker(
        {
          _id: "5f6203bb0d5658001cd8f85a",
          name: "Basel",
          coord: {
            WGS84: {
              lat: 47.54741,
              lon: 7.58956,
            },
          },
          modes: ["4"],
        },
        1
      );
    });

    expect(result.current.selected?.name).toBe("Basel");
  });
  it("Should check the handleDeleteOnDND function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSendRequest("4");
    });

    await waitForNextUpdate();

    expect(result.current.stateDND.trajekt.items.length).toBe(0);

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });
    act(() => {
      result.current.handleSelectAutoSearch("Lyon");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(2);

    act(() => {
      result.current.handleDeleteOnDND(
        {
          _id: "5f6203bb0d5658001cd8f85a",
          name: "Basel",
          coord: {
            WGS84: {
              lat: 47.54741,
              lon: 7.58956,
            },
          },
          modes: ["4"],
        },
        0
      );
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(1);

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(2);

    act(() => {
      result.current.handleDeleteOnDND(
        {
          _id: "5f6203bb0d5658001cd8f85a",
          name: "Basel",
          coord: {
            WGS84: {
              lat: 47.54741,
              lon: 7.58956,
            },
          },
          modes: ["4"],
        },
        1
      );
    });

    expect(result.current.stateDND.trajekt.items.length).toBe(1);
  });
});
