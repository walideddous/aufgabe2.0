import { useEffect, useState, useCallback } from "react";
import { v4 } from "uuid";
import { message } from "antd";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_STOPS_BY_MODES } from "../graphql/stopsQuery";
import {
  GET_STOP_SEQUENCE_BY_KEY,
  GET_STOP_SEQUENCE_BY_NAME,
  DELETE_STOP_SEQUENCE,
  SAVE_STOP_SEQUENCE,
} from "../graphql/stopSequencesQuery";

// Typescript
import { TstateDND, Tstations, Tdistance, TStopSequence } from "../types/types";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// Import function to format the PTStopItems => variable that comm from the GraphQl query
import { formatPTStopItems } from "../utils/formatPTStopItems";
//
import { formatStopSequenceItems } from "../utils/formatStopSequenceItems";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

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
  const [stopSequenceList, setStopSequenceList] = useState<TStopSequence[]>([]);
  const [updateDate, setUpdateDate] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<string[]>([]);
  const [currentStopSequence, setCurrentStopSequence] = useState<TStopSequence>();
  const [
    loadStopSequenceSection,
    setLoadStopSequenceSection,
  ] = useState<boolean>(true);

  const [queryStopSequenceByKey, stopSequenceByKeyResponse] = useLazyQuery(
    GET_STOP_SEQUENCE_BY_KEY,
    {
      fetchPolicy: "network-only",
    }
  );
  const [getStopsByMode, stopsResponse] = useLazyQuery(GET_STOPS_BY_MODES);
  const [queryStopSequenceByName, stopSequenceByNameResponse] = useLazyQuery(
    GET_STOP_SEQUENCE_BY_NAME,
    {
      fetchPolicy: "network-only",
    }
  );
  
  const [deleteStopSequenceMutation] = useMutation(
    DELETE_STOP_SEQUENCE
  );
  const [saveStopSequenceMutation] = useMutation(SAVE_STOP_SEQUENCE);

  // Update the state when the stopsSequence is queried by name
  useEffect(() => {
    if (stopSequenceByNameResponse.data) {
      const { RouteManagerItemsByName } = stopSequenceByNameResponse.data;

      setStopSequenceList(RouteManagerItemsByName);
    }
    if (stopSequenceByNameResponse.error) {
      console.error(
        "Error from stopSequenceByNameResponse " +
          stopSequenceByNameResponse.error.message
      );
    }
  }, [stopSequenceByNameResponse]);

  // Search the stop sequence by name function
  const handleStopSequenceSearch = useCallback(
    (name: string) => {
      queryStopSequenceByName({
          variables: { name },
        }); 
    },
    [queryStopSequenceByName]
  );

  // Update the state when the stops is queried
  useEffect(() => {
    if (stopsResponse.data) {
      const { PTStopItems } = stopsResponse.data;

      //// -> Format stops and set the state
      const stopsFormatted = formatPTStopItems(PTStopItems);
      setStations(stopsFormatted);
      setUpdateDate(Date().toString().substr(4, 24));

      // End loading
      setIsSending(false);
    }

    if (stopsResponse.error) {
      console.error("Error to fetch the stops " + stopsResponse.error.message);
      // End loading
      setIsSending(false);
    }
  }, [stopsResponse]);

  // Send the request when you click on get the Data button
  const handleSendRequest = useCallback(
    async (modes) => {
      if (isSending) return console.log("Please wait");
      // Start loading
      setIsSending(true);
      setCurrentMode(modes);

      console.log("start fetching");

      // Dispatch the stops GraphQl query
      getStopsByMode({ variables: { modes } });

      console.log("end fetching");
    },
    [isSending, getStopsByMode]
  );

  // Select the Station in drop part from the drapDrop component to show the suggestion
  const handleClickOnDrop = useCallback(
    (stop: Tstations, index: number) => {
      setSelected({ ...stop, index });
      var vorschläge = calculateDistanceAndSort(stop, stations);
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

  // add the stations to the Stop sequence field when we click on button suggestion
  const handleAddStopsOnCLick = useCallback(
    (stop: Tstations) => {
      var vorschläge = calculateDistanceAndSort(stop, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
      );
      setDistance([...vorschläge]);

      const index = stateDND.trajekt.items
        .map((el: any) => el._id)
        .indexOf(selected?._id);
      setSelected({ ...stop, index: index + 1 });

      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Stop sequence",
            items: prev.trajekt.items
              .slice(0, index + 1)
              .concat({ ...stop })
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

  // Delete stops from Drop Component
  const handleDeleteOnDND = useCallback(
    (stop: Tstations, index: number) => {
      let vorschläge: any;
      if (
        selected &&
        stateDND.trajekt.items.length > 1 &&
        stop._id + index === selected?._id + selected?.index
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
              .filter((el) => stop._id !== el._id)
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
                (item: any, i: number) => item._id + i !== stop._id + index
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
        stop._id + index !== selected?._id + selected?.index
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
              .filter((el) => stop._id !== el._id)
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
                (item: any, i: number) => item._id + i !== stop._id + index
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
                (item: any, i: number) => item._id + i !== stop._id + index
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

  // to select stops from the Stop search input field
  const handleSelectAutoSearch = useCallback(
    (stop:Tstations) => {
      var vorschläge = calculateDistanceAndSort(stop, stations);
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
                .concat({ ...stop })
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
        setSelected({ ...stop, index: index + 1 });
      } else {
        setSelected({
          ...stop,
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
                  ...stop,
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
      if(destination.droppableId === "suggestions" && source.droppableId==="suggestions" ) {
         return 
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
      handleClickOnDrop(itemCopy, index);
    },
    [stateDND, handleClickOnDrop]
  );

  // Context menu to add the stop After the selected stops in the drop Menu
  const handleAddAfterSelected = useCallback(
    (stopMarker: Tstations) => {
      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === stopMarker._id)
          .length === 0
      ) {
        var vorschläge = calculateDistanceAndSort(stopMarker, stations);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
        );
        setDistance([...vorschläge]);

        const index = stateDND.trajekt.items
          .map((el: any, i: number) => el._id + i)
          .indexOf(selected._id + selected.index);
        setSelected({ ...stopMarker, index: index + 1 });

        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: prev.trajekt.items
                .slice(0, index + 1)
                .concat({ ...stopMarker })
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
    (stopMarker: Tstations) => {
      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === stopMarker._id)
          .length === 0
      ) {
        const index = stateDND.trajekt.items
          .map((el: any, i: number) => el._id + i)
          .indexOf(selected._id + selected.index);
        setSelected({ ...stopMarker, index });
        var vorschläge = calculateDistanceAndSort(stopMarker, stations);
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
                .concat({ ...stopMarker })
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
  const handleClickOnMapMarker = useCallback(
    (station: Tstations, index: number) => {

      if (selected?._id === station._id) return;

      if (
        stateDND.trajekt.items.filter((item: any) => item._id === station._id)
          .length === 0
      ) {
        handleAddStopsOnCLick(station);
      } else {
        setSelected({ ...station, index });
        var vorschläge = calculateDistanceAndSort(station, stations);
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
    [stations, stateDND.trajekt.items, selected, handleAddStopsOnCLick]
  );

  // Delete marker from map
  const handleDeleteMarkerFromMap = useCallback(
    (stopMarker: Tstations) => {
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === stopMarker._id)
          .length
      ) {
        const index = stateDND.trajekt.items
          .map((el: any) => el._id)
          .indexOf(stopMarker._id);
        handleDeleteOnDND(stopMarker, index);
      }
    },
    [ stateDND.trajekt.items, handleDeleteOnDND]
  );

  // Reset and delete all
  const handleResetStopSequence = useCallback(() => {
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
  }, []);

  // Clear all and delete all
  const handleClearAll = useCallback(() => {
    handleResetStopSequence();
    setCurrentStopSequence(undefined);
  }, [handleResetStopSequence]);

  // Save the stop sequence
  const handleSaveStopSequence = useCallback(
    async (formInput: any) => {
      const { items } = stateDND.trajekt;
      let body: any;

      if (isSending) return console.log("Please wait");
      if (!items.length) return console.log("Please create your stop sequence");

      if (currentStopSequence) {
        body = {
          ...currentStopSequence,
          name: formInput.name,
          schedule: formInput.schedule,
          stopSequence: items.map((item: any) => ({
            key: item.key,
            name: item.name,
          })),
        };
      } else {
        body = {
          ...formInput,
          _id: v4(),
          key: v4(),
          desc: formInput.desc ? formInput.desc : "Exemple hard coded",
          modes: currentMode,
          stopSequence: items.map((item: any) => ({
            key: item.key,
            name: item.name,
          })),
        };
      }

      // update state
      setIsSending(true);
      // send the actual request
      try {
        // GraphQl
        const saveResponse = await saveStopSequenceMutation({
          variables: { data: body },
        });

        if (saveResponse.data.RouteManagerAdd) {
          console.log("Stop sequence successfully saved");
          message.success(`Stop sequence succesfully saved`);

          handleClearAll();
        } else {
          console.log("Could't save the RouteManagerAdd value");
        }
      } catch (error) {
        console.error(error, "error from trycatch saveStopSequence");
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [
      stateDND,
      isSending,
      currentMode,
      currentStopSequence,
      handleClearAll,
      saveStopSequenceMutation,
    ]
  );

  // Load the stop sequence and the stop when we dispatch handledisplayStopSequence function
  useEffect(() => {
    if (stopsResponse.data && stopSequenceByKeyResponse.data) {
      const { PTStopItems } = stopsResponse.data;
      const { RouteManagerItemByKey } = stopSequenceByKeyResponse.data;

      //// -> Format stops and set the state
      const stopsFormatted = formatPTStopItems(PTStopItems);
      setStations(stopsFormatted);
      setUpdateDate(Date().toString().substr(4, 24));

      // Check if the stops mode is equal to the stopSequence mode 
      if(!PTStopItems[0].data.modes.filter((mode:string) => mode === RouteManagerItemByKey[0].modes[0]).length) return setIsSending(false);

      //// -> Format stopSequence and set the state
      const routeManagerFormatted = formatStopSequenceItems(
          stopsFormatted,
          RouteManagerItemByKey
        );

      setCurrentMode([...routeManagerFormatted[0].modes]);
      setCurrentStopSequence({ ...routeManagerFormatted[0] });
      setStateDND((prev) => {
        return {
          ...prev,
          trajekt: {
            title: "Stop sequence",
            items: routeManagerFormatted[0].stopSequence,
          },
        };
      });

      // End loading
      setIsSending(false);
    }

    if (stopsResponse.error) {
      console.error("Error to fetch the stops" + stopsResponse.error.message);
      // End loading
      setIsSending(false);
    }

    if (stopSequenceByKeyResponse.error) {
      console.error(
        "Error to fetch the stopSequenceByKeyResponse" +
          stopSequenceByKeyResponse.error.message
      );
      // End loading
      setIsSending(false);
    }
  }, [stopsResponse, stopSequenceByKeyResponse]);

  // Display the stop sequence on map
  const handledisplayStopSequence = useCallback(
    (modes: string[], key: string) => {
      // Dispatch the stops GraphQl query
      getStopsByMode({ variables: { modes } });

      // Dispatch the stop sequence GraphQl query
      queryStopSequenceByKey({ variables: { key } });
      setCurrentMode(modes)
    },
    [getStopsByMode, queryStopSequenceByKey]
  );

  // Delete the stop sequence by Id
  const handleDeleteStopSequence = useCallback(
    async (_id: string) => {
      if (isSending) return console.log("Please Wait");
      setIsSending(true);
      try {
        // GraphQL
        const deleteResponse = await deleteStopSequenceMutation({
          variables: { _id },
        });
        if (deleteResponse.data.RouteManagerDelete) {
          message.success(`Stop sequence successfully deleted`);

          // Set the state of stopSequence List
          setStopSequenceList((prev) => {
            return prev.filter((el: any) => el._id !== _id);
          });

          handleClearAll();
          setCurrentStopSequence(undefined);
        } else {
          message.error("Couldn't delete the stop sequence");
        }
      } catch (err) {
        console.log("Error from deleteStopSequence tryCatch", err);
      }
      setIsSending(false);
    },
    [isSending, deleteStopSequenceMutation, handleClearAll]
  );

  // set the mode Load or New
  const handleLoadMode = useCallback(
    (value: boolean) => {
      setLoadStopSequenceSection(value);
      if (!value) {
        handleClearAll();
        setSelected(undefined);
      }
    },
    [handleClearAll]
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
    loadStopSequenceSection,
    handleStopSequenceSearch,
    handleLoadMode,
    handleSendRequest,
    handleClickOnDrop,
    handleAddStopsOnCLick,
    handleDeleteOnDND,
    handleSelectAutoSearch,
    handleDragEnd,
    handleAddAfterSelected,
    handleAddBeforSelected,
    handleClickOnMapMarker,
    handleDeleteMarkerFromMap,
    handleClearAll,
    handleResetStopSequence,
    handleSaveStopSequence,
    handledisplayStopSequence,
    handleDeleteStopSequence,
  };
}
