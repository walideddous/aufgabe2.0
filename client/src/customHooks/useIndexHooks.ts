import { useEffect, useState, useCallback } from "react";
import { v4 } from "uuid";
import { message } from "antd";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_STOPS_BY_MODES } from "../graphql/stopsQuery";
import {
  GET_STOP_SEQUENCE_BY_MODES,
  DELETE_STOP_SEQUENCE_BY_MODES,
  SAVE_STOP_SEQUENCE_BY_MODES
} from "../graphql/stopSequencesQuery";

// Typescript
import { TstateDND, Tstations, Tdistance } from "../types/types";

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
  const [stopSequenceList, setStopSequenceList] = useState([]);
  const [savedStopSequence, setSavedStopSequence] = useState([]);
  const [updateDate, setUpdateDate] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<string[]>([]);
  const [currentStopSequence, setCurrentStopSequence] = useState({});
  const [
    loadStopSequenceSection,
    setLoadStopSequenceSection,
  ] = useState<boolean>(true);

  const [queryStopSequenceRequest, stopSequenceResponse] = useLazyQuery(
    GET_STOP_SEQUENCE_BY_MODES
  );
  const [getStopsByMode, stopsResponse] = useLazyQuery(GET_STOPS_BY_MODES);
  const [
    deleteStopSequenceMutation,
  ] = useMutation(DELETE_STOP_SEQUENCE_BY_MODES);
  const [saveStopSequenceMutation] = useMutation(SAVE_STOP_SEQUENCE_BY_MODES)

  // Update the state when the data is queried from graphql 
  useEffect(() => {
    if (stopsResponse.data && stopSequenceResponse.data) {
      const { PTStopItems } = stopsResponse.data;
      const { RouteManagerItems } = stopSequenceResponse.data;

      //// -> Format stops and set the state
      const stopsFormatted = formatPTStopItems(PTStopItems);
      setStations(stopsFormatted);
      setUpdateDate(Date().toString().substr(4, 24));

      //// -> Format stopSequence and set the state
      const routeManagerFormatted = formatStopSequenceItems(
        stopsFormatted,
        RouteManagerItems
      );
      setStopSequenceList(routeManagerFormatted);

      // End loading
      setIsSending(false);
    }

    if (stopsResponse.error && stopSequenceResponse.error) {
      message.error("Couldn't query the data");
      // End loading
      setIsSending(false);
    }
  }, [stopsResponse, stopSequenceResponse]);

  // Send the request when you click on get the Data button
  const handleSendRequest = useCallback(
    async (modes) => {
      if (isSending) return console.log("Please wait");
      // Start loading
      setIsSending(true);
      setCurrentMode(modes);
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
      console.log("start fetching");

      // Dispatch the stops GraphQl query
      getStopsByMode({ variables: { modes } });
      // Dispatch the stopSequence GraphQl query
      queryStopSequenceRequest({ variables: { modes } });

      console.log("end fetching");
    },
    [isSending, getStopsByMode, queryStopSequenceRequest]
  );

    // set the mode Load or New
    const handleLoadMode = useCallback((value: boolean) => {
      setLoadStopSequenceSection(value);
    }, []);

  // Select the Station in drop part from the drapDrop component to show the suggestion
  const handleClickOnDrop = useCallback(
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

  // add the stations to the Stop sequence field when we click on button suggestion
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

  // Delete stops from Drop Component
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

  // to select stops from the Stop search input field
  const handleSelectAutoSearch = useCallback(
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
      handleClickOnDrop(itemCopy, index);
    },
    [stateDND, handleClickOnDrop]
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
  const handleClickOnMapMarker = useCallback(
    (el: Tstations, index: number) => {
      const newValue = {
        ...el,
        coord: {
          //@ts-ignore
          WGS84: { lat: el.coord.WGS84[0], lon: el.coord.WGS84[1] },
        },
      };

      if (selected?._id === el._id) return;

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
    [stations, stateDND.trajekt.items, selected, handleAddStopsOnCLick]
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
    setCurrentStopSequence({});
  }, [handleResetStopSequence]);


  // Save the stop sequence
  const handleSaveStopSequence = useCallback(
    async (formInput: any) => {
      const { items } = stateDND.trajekt;
      let body:any

      if (isSending) return console.log("Please wait") ;
      if (!items.length) return console.log("Please create your stop sequence") ;

      if(Object.keys(currentStopSequence).length){
        body={
          ...currentStopSequence,
          name: formInput.name,
          schedule: formInput.schedule,
          stopSequence: items.map((item:any)=> ({
            key:  item.key,
            name: item.name
          })),
        }
      } else {    
       body = {
        ...formInput,
        _id: v4(),
        key: v4(),
        desc: formInput.desc ? formInput.desc  : "Exemple hard coded" ,
        modes: currentMode,
        stopSequence: items.map((item:any)=> ({
          key:  item.key,
          name: item.name
        })),
      };
      }

      // update state
      setIsSending(true);
      // send the actual request
      try {
        // GraphQl
      console.log("body", body)
        const saveResponse = await saveStopSequenceMutation({
          variables:{data: body}
        });

        if (saveResponse.data.RouteManagerAdd) {
          console.log("Stop sequence successfully saved");
          message.success(`Stop sequence succesfully saved`);
          // Set the state of stopSequence List
          setStopSequenceList((prev:any) => {
            const savedObject = {
              ...body,
              stopSequence: stateDND.trajekt.items
            }
            if(prev.filter((el:any)=> el._id === savedObject._id).length){
            return  prev.map((el:any)=> el._id === savedObject._id ? el = savedObject : el)
            } else {
            return prev.concat({ ...savedObject });
            }


          });
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
    [stateDND.trajekt, isSending, currentMode, currentStopSequence,handleClearAll, saveStopSequenceMutation]
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
          setCurrentStopSequence({});
        } else {
          message.error("Couldn't delete the stop sequence");
        }

      } catch (err) {
        console.log("Error from deleteStopSequence tryCatch", err);
      }
      setIsSending(false);
    },
    [
      isSending,
      deleteStopSequenceMutation,
      handleClearAll,
    ]
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
    handleUpdateAfterSave,
    handleDeleteStopSequence,
  };
}
