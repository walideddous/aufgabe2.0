import { useState, useCallback } from "react";
import { v4 } from "uuid";
import { message } from "antd";

// Typescript
import { TstateDND, Tstations, Tdistance } from "../types/types";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

// Import services
import { getStopsByMode } from "../services/stopsService";
import {
  saveStopSequenceRequest,
  deleteStopSequenceRequest,
  queryStopSequenceRequest,
} from "../services/stopSequenceService";

export default function useIndexHooks() {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [selected, setSelected] = useState<Tstations>();
  const [distance, setDistance] = useState<Tdistance[]>([]);
  const [stateDND, setStateDND] = useState<TstateDND>({
    suggestions: {
      title: "Suggestion",
      items: [],
    },
    trajekt: {
      title: "Stop sequence",
      items: [],
    },
  });
  const [isSending, setIsSending] = useState<boolean>(false);
  const [stopSequenceList, setStopSequenceList] = useState([]);
  const [savedStopSequence, setSavedStopSequence] = useState([]);
  const [updateDate, setUpdateDate] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<string>("");
  const [currentStopSequence, setCurrentStopSequence] = useState({});
  const [loadStopSequenceSection, setLoadStopSequenceSection] = useState(true);

  // set the mode Load or New
  const loadMode = useCallback((value: boolean) => {
    setLoadStopSequenceSection(value);
  },[]);

  // Send the request when you click on get the Data button
  const sendRequest = useCallback(
    async (modes) => {
      if (isSending) return;
      // update state
      setIsSending(true);
      setSelected(undefined);
      setStateDND({
        suggestions: {
          title: "Suggestion",
          items: [],
        },
        trajekt: {
          title: "Stop sequence",
          items: [],
        },
      });
      // send the actual request
      try {
        console.log("start fetching");
        // Stops
        const stops = await getStopsByMode(modes);
        //StopSequence
        const stopSequence = await queryStopSequenceRequest(modes);

        console.log("end fetching");
        if (Object.keys(stops).length || Object.keys(stopSequence).length) {
          const { haltestelleByMode } = stops.data.data;
          const { stopSequenceByMode } = stopSequence.data.data;
          setStations(haltestelleByMode);
          setStopSequenceList(stopSequenceByMode);
          setCurrentMode(modes);
          setUpdateDate(Date().toString().substr(4, 24));
        } else {
          console.log("stops or stopSequence don't exists");
        }
      } catch (error) {
        console.error(error, "error from trycatch");
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [isSending]
  );

  // Select the Station when you click on the button to show the suggestion
  const clickOnDrop = useCallback(
    (e: any, index: number) => {
      const { _id, name, coord, modes } = e;
      const response = { _id, name, coord, modes };
      setSelected({ ...response, index });
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
      );
      setDistance([...vorschläge]);
      setStateDND((prev: any) => {
        return {
          ...prev,
          suggestions: {
            title: "Suggestion",
            items: vorschläge
              .map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              })
              .slice(0, 16),
          },
        };
      });
    },
    [stations, stateDND.trajekt.items]
  );

  // add the stations to the Stop sequence Field when you click on button suggestion
  const handleAddStopsOnCLick = useCallback(
    (input: any) => {
      const { _id, name, modes, coord } = input;
      const response = { _id, name, modes, coord };
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
      );
      setDistance([...vorschläge]);

      const index = stateDND.trajekt.items
        .map((el: any) => el._id)
        .indexOf(selected?._id);
      setSelected({ ...response, index: index + 1 });

      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Stop sequence",
            items: prev.trajekt.items
              .slice(0, index + 1)
              .concat({ ...response })
              .concat(prev.trajekt.items.slice(index + 1)),
          },
          suggestions: {
            title: "Suggestion",
            items: vorschläge
              .map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              })
              .slice(0, 16),
          },
        };
      });
    },
    [stations, stateDND.trajekt.items, selected]
  );

  // Delete the button from Drop Part
  const handleDeleteOnDND = useCallback(
    (input: any, index: number) => {
      let vorschläge: any;
      if (
        selected &&
        stateDND.trajekt.items.length > 1 &&
        input._id + index === selected?._id + selected?.index
      ) {
        let newValue: any;
        let newIndex: any;
        if (!selected.index) {
          newValue = stateDND.trajekt.items[index + 1];
          newIndex = index;
        } else {
          newValue = stateDND.trajekt.items[index - 1];
          newIndex = index - 1;
        }
        setSelected({ ...newValue, index: newIndex });
        vorschläge = calculateDistanceAndSort(newValue, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items
              .filter((el) => input._id !== el._id)
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stateDND.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== input._id + index
              ),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }

      if (
        stateDND.trajekt.items.length > 1 &&
        //@ts-ignore
        input._id + index !== selected?._id + selected?.index
      ) {
        //@ts-ignore
        if (index < selected?.index) {
          setSelected((prev: any) => {
            return {
              ...prev,
              //@ts-ignore
              index: selected?.index - 1,
            };
          });
        }
        vorschläge = calculateDistanceAndSort(selected, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items
              .filter((el) => input._id !== el._id)
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stateDND.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== input._id + index
              ),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }
      if (stateDND.trajekt.items.length === 1) {
        setSelected(undefined);
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stateDND.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== input._id + index
              ),
            },
            suggestions: {
              title: "Suggestion",
              items: [],
            },
          };
        });
      }
    },
    [stations, stateDND, selected]
  );

  // to choose the station from the input options
  const onSelectAutoSearch = useCallback(
    (selectedStop: string) => {
      const elementSelected = stations.filter(
        (el) => el.name === selectedStop
      )[0];
      var vorschläge = calculateDistanceAndSort(elementSelected, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
      );
      setDistance([...vorschläge]);
      if (selected) {
        const index = stateDND.trajekt.items
          .map((el: any, index: number) => el._id + index)
          .indexOf(selected._id + selected.index);
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: prev.trajekt.items
                .slice(0, index + 1)
                .concat({ ...elementSelected })
                .concat(prev.trajekt.items.slice(index + 1)),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
        setSelected({ ...elementSelected, index: index + 1 });
      } else {
        setSelected({
          ...elementSelected,
          index: stateDND.trajekt.items.length,
        });
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: [
                ...prev.trajekt.items,
                {
                  ...elementSelected,
                },
              ],
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }
    },
    [stations, stateDND.trajekt.items, selected]
  );

  // To Drag and Drop from source to the destination
  const handleDragEnd = useCallback(
    ({ destination, source }: any) => {
      if (!destination) {
        return;
      }
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }
      const itemCopy = {
        ...getProperty(stateDND, source.droppableId).items[source.index],
      };

      setStateDND((prev) => {
        prev = { ...prev };

        // Remove from previous items array
        getProperty(prev, source.droppableId).items.splice(source.index, 1);

        // Adding to new items array location
        getProperty(prev, destination.droppableId).items.splice(
          destination.index,
          0,
          itemCopy
        );
        return prev;
      });

      const index = stateDND.trajekt.items
        .map((el: any) => el._id)
        .indexOf(itemCopy._id);
      clickOnDrop(itemCopy, index);
    },
    [stateDND, clickOnDrop]
  );

  // Context menu to add the stop After the selected stops in the drop Menu
  const handleAddAfterSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el) => el.name === e)[0];
      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0
      ) {
        var vorschläge = calculateDistanceAndSort(response, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
        );
        setDistance([...vorschläge]);

        const index = stateDND.trajekt.items
          .map((el: any, i: number) => el._id + i)
          .indexOf(selected._id + selected.index);
        setSelected({ ...response, index: index + 1 });

        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: prev.trajekt.items
                .slice(0, index + 1)
                .concat({ ...response })
                .concat(prev.trajekt.items.slice(index + 1)),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }
    },
    [stations, stateDND.trajekt.items, selected]
  );

  // Context menu to add the stop before the selected stops in the drop Menu
  const handleAddBeforSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el: any) => el.name === e)[0];
      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0
      ) {
        const index = stateDND.trajekt.items
          .map((el: any, i: number) => el._id + i)
          .indexOf(selected._id + selected.index);
        setSelected({ ...response, index });
        var vorschläge = calculateDistanceAndSort(response, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: prev.trajekt.items
                .slice(0, index)
                .concat({ ...response })
                .concat(prev.trajekt.items.slice(index)),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }
    },
    [stations, stateDND, selected]
  );

  // Click on Marker on Map
  const clickOnMapMarker = useCallback(
    (el: Tstations, index: number) => {
      const newValue = {
        ...el,
        coord: {
          //@ts-ignore
          WGS84: { lat: el.coord.WGS84[0], lon: el.coord.WGS84[1] },
        },
      };
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === el._id)
          .length === 0
      ) {
        handleAddStopsOnCLick(newValue);
      } else {
        setSelected({ ...newValue, index });

        var vorschläge = calculateDistanceAndSort(newValue, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStateDND((prev: any) => {
          return {
            ...prev,
            suggestions: {
              title: "Suggestion",
              items: vorschläge
                .map((el: any) => {
                  return {
                    ...el.to,
                    angle: el.angle,
                    distance: el.distance,
                  };
                })
                .slice(0, 16),
            },
          };
        });
      }
    },
    [stations, stateDND.trajekt.items, handleAddStopsOnCLick]
  );

  // Delete marker from map
  const handleDeleteMarkerFromMap = useCallback(
    (e: string) => {
      const response = stations.filter((el) => el.name === e)[0];
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length
      ) {
        const index = stateDND.trajekt.items
          .map((el: any, i: number) => el._id)
          .indexOf(response._id);
        handleDeleteOnDND(response, index);
      }
    },
    [stations, stateDND.trajekt.items, handleDeleteOnDND]
  );

  // Reset and delete all
  const clearAll = useCallback(() => {
    console.log("dispatched")
    setSelected(undefined);
    setCurrentStopSequence({});
    setStateDND({
      suggestions: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    });
  }, []);

  // Save the stop sequence
  const saveStopSequence = useCallback(
    async (formInput: any) => {
      const { items } = stateDND.trajekt;

      if (isSending) return;
      if (!items.length) return;

      const body = {
        _id: v4(),
        ...formInput,
        modes: currentMode,
        stopSequence: items,
      };

      // update state
      setIsSending(true);
      // send the actual request
      try {
        // REST_API
        const result = await saveStopSequenceRequest(body);
        if (!Object.keys(result).length) {
          console.error("Couldn't save the stop sequence");
        }
        console.log(result.data.msg);
        if (result.data.msg) {
          console.log("Stop sequence succesfully saved");
          message.success(`Stop sequence succesfully ${result.data.msg}`);
          // Set the state of stopSequence List
          setSavedStopSequence((prev) => {
            return prev.concat({ ...body });
          });
          clearAll();
        }
      } catch (error) {
        console.error(error, "error from trycatch");
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [stateDND.trajekt, isSending, currentMode, clearAll]
  );

  // Display the stop sequence on map
  const handledisplayStopSequence = useCallback((input: any) => {
    setCurrentStopSequence({ ...input });
    setStateDND((prev) => {
      return {
        ...prev,
        trajekt: {
          title: "Stop sequence",
          items: input.stopSequence,
        },
      };
    });
  }, []);

  // Update button after stop sequence have been saved
  const handleUpdateAfterSave = useCallback(() => {
    // filter the saved stop sequence by mode and added to th stopSequenceList
    if (savedStopSequence.length) {
      const flteredStopSeqenceByMode = savedStopSequence.filter(
        (el: any) => el.modes === currentMode
      );
      setStopSequenceList((prev) => {
        return prev.concat(flteredStopSeqenceByMode);
      });
      setSavedStopSequence([]);
    }
  }, [savedStopSequence, currentMode]);

  // Delete the stop sequence by Id
  const handleDeleteStopSequence = useCallback(
    async (id: string) => {
      if (isSending) return; // update state
      setIsSending(true);
      // send the actual request
      try {
        console.log("delete the stop sequence");
        // REST_API
        const result = await deleteStopSequenceRequest(id);
        if (!Object.keys(result).length) {
          console.error("Couldn't delete the Stop sequence");
        }
        if (result.data.msg) {
          message.success(result.data.msg);
          // Set the state of stopSequence List
          setStopSequenceList((prev) => {
            return prev.filter((el: any) => el._id !== id);
          });
          clearAll();
          setCurrentStopSequence({});
        }
      } catch (error) {
        console.error(error, "error from trycatch");
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [clearAll, isSending]
  );

  return {
    stations,
    selected,
    distance,
    stateDND,
    isSending,
    stopSequenceList,
    updateDate,
    currentMode,
    currentStopSequence,
    savedStopSequence,
    loadStopSequenceSection,
    loadMode,
    sendRequest,
    clickOnDrop,
    handleAddStopsOnCLick,
    handleDeleteOnDND,
    onSelectAutoSearch,
    handleDragEnd,
    handleAddAfterSelected,
    handleAddBeforSelected,
    clickOnMapMarker,
    handleDeleteMarkerFromMap,
    clearAll,
    saveStopSequence,
    handledisplayStopSequence,
    handleUpdateAfterSave,
    handleDeleteStopSequence,
  };
}
