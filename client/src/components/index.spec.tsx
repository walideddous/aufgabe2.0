import React from "react";
import { mount, ReactWrapper } from "enzyme";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "@apollo/client/testing";

import { renderHook, act } from "@testing-library/react-hooks";
import useIndexHooks from "../customHooks/useIndexHooks";

import { GET_STOPS_BY_MODES } from "../graphql/stopsQuery";
import {
  DELETE_STOP_SEQUENCE,
  GET_STOP_SEQUENCE_BY_KEY,
  GET_STOP_SEQUENCE_BY_NAME,
  SAVE_STOP_SEQUENCE,
} from "../graphql/stopSequencesQuery";

// Test utils
import { graphQlStopsQuery, stations } from "../testUtils/testData";

// Mock the map component
jest.mock("./map/Map.tsx", () => () => <div id="mapMock">Map mocked</div>);

const queryStopsMocked = [
  {
    request: {
      query: GET_STOPS_BY_MODES,
      variables: {
        modes: ["4"],
      },
    },
    data: {
      PTStopItems: graphQlStopsQuery,
    },
  },
];

const queryStopsMockedErrorMock = {
  request: {
    query: GET_STOPS_BY_MODES,
    variables: {
      modes: ["4"],
    },
  },
  error: new Error("Ohh Ohh!"),
};

describe("Test the customHooks of the /components/index.tsx", () => {
  const MainRoot = require("../components/index").default;

  let wrappedComponent: ReactWrapper;

  const setUp = () => {
    const component = mount(
      <MockedProvider mocks={queryStopsMocked} addTypename={false}>
        <MainRoot />
      </MockedProvider>
    );
    return component;
  };

  beforeEach(() => {
    wrappedComponent = setUp();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should test the jest framework", () => {
    expect(true).toBe(true);
  });

  it("Should match snapShot with the main component => component/index", () => {
    expect(toJSON(wrappedComponent)).toMatchSnapshot();
  });

  it("Should return an array of stops when we choose the mode", async () => {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={queryStopsMocked} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks(), {
      wrapper,
    });

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toEqual(1);
  });
  it("Should return error when request fails", async () => {
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={[queryStopsMockedErrorMock]} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks(), {
      wrapper,
    });

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toEqual(1);
  });
});

/*
describe("Test the customHooks of the /components/index.tsx", () => {
  const MainRoot = require("../components/index").default;

  let wrappedComponent: ReactWrapper;
  let spyOnConsoleLog: any;
  let spyOnConsoleError: any;

  const setUp = () => {
    const component = mount(<MainRoot />);
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
            PTStopItems: [
              {
                type: "stop",
                name: "Basel",
                geojson: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [7.58956, 47.54741],
                  },
                },
                data: {
                  _id: "5f6203bb0d5658001cd8f85a",
                  key: "100050",
                  name: "Basel",
                  keyMapping: {
                    gid: "134",
                    diva: {
                      ojp: "50",
                    },
                  },
                  loc: {
                    name: "Basel",
                    omc: "23022212",
                    placeId: "2",
                    coord: null,
                  },
                  routes: [
                    "ojp9101ZYHj20",
                    "ojp9105LYHj20",
                    "ojp9101ZYRj20",
                    "ojp9105LYRj20",
                  ],
                  modes: ["4"],
                },
              },
              {
                type: "stop",
                name: "Lyon",
                geojson: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [4.84184, 45.74506],
                  },
                },
                data: {
                  _id: "5f6203bb0d5658001cd8f85b",
                  key: "100050",
                  name: "Lyon",
                  keyMapping: {
                    gid: "134",
                    diva: {
                      ojp: "50",
                    },
                  },
                  loc: {
                    name: "Lyon",
                    omc: "23022212",
                    placeId: "2",
                    coord: null,
                  },
                  routes: [
                    "ojp9101ZYHj20",
                    "ojp9105LYHj20",
                    "ojp9101ZYRj20",
                    "ojp9105LYRj20",
                  ],
                  modes: ["4"],
                },
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
            RouteManagerItems: [
              { _id: "1", name: "St. Gallen to Zürich HB", modes: ["4"] },
            ],
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
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalled();
  });

  it("Should display stopSequence when we trigger the handledisplayStopSequenceQuery  function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    expect(result.current.stations.length).toBe(2);
    expect(result.current.stopSequenceList.length).toBe(1);
    act(() => {
      result.current.handledisplayStopSequenceQuery("St. Gallen to Zürich HB");
    });

    expect(result.current.currentStopSequence).not.toBeNull();
  });
  it("Should select the stop and calculate the distance when we trigger the clickOnDrop function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
  it("Should check if the deleting was succesful when we trigger the handleDeleteStopSequenceMutation function", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() => Promise.resolve({}));
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleDeleteStopSequenceMutation("1");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith(
      "Couldn't delete the Stop sequence"
    );
  });
  it("Should catch the error when the handleDeleteStopSequenceMutation function reject error", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() => Promise.reject("error"));
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleDeleteStopSequenceMutation("1");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("error", "error from trycatch");
  });
  it("Should delete the stop Sequence when we trigger the handleDeleteStopSequenceMutation function", async () => {
    //@ts-ignore
    deleteStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            RouteManagerDelete: 1,
          },
        },
      })
    );
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());
    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    const beforeDeleteStopSequenceLength =
      result.current.stopSequenceList.length;

    act(() => {
      result.current.handleDeleteStopSequenceMutation("1");
    });

    await waitForNextUpdate();

    expect(result.current.stopSequenceList.length).toEqual(
      beforeDeleteStopSequenceLength - 1
    );
  });
  it("Should not save the stop if the stop sequence field is empty", () => {
    const { result } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleSaveStopSequenceMutation("1");
    });

    expect(spyOnConsoleError).not.toBeCalled();
  });
  it("Should save the stop sequence when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            RouteManagerAdd: 1,
          },
        },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequenceMutation("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleLog).toBeCalledWith("Stop sequence successfully saved");
  });
  it("Should catch the catch error when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() => Promise.reject("error"));

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequenceMutation("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("error", "error from trycatch");
  });
  it("Should check if the saving was succesful when we trigger the saveStopSequence function", async () => {
    //@ts-ignore
    saveStopSequenceRequest.mockImplementation(() => Promise.resolve({}));

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequenceMutation("formInput");
    });

    await waitForNextUpdate();

    expect(spyOnConsoleError).toBeCalledWith("Couldn't save the stop sequence");
  });
  it("Should check the handleAddAfterSelected function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
          data: {
            RouteManagerAdd: 1,
          },
        },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
    });

    await waitForNextUpdate();

    act(() => {
      result.current.handleSelectAutoSearch("Basel");
    });

    act(() => {
      result.current.handleSaveStopSequenceMutation("formInput");
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
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleStopsQuery(["4"]);
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
  it("Should check the handleDeleteStop function", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIndexHooks());

    act(() => {
      result.current.handleStopsQuery(["4"]);
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
      result.current.handleDeleteStop(
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
      result.current.handleDeleteStop(
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
*/
