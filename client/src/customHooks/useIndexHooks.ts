import { useEffect, useState, useCallback, useRef } from "react";
import { v4 } from "uuid";
import { message } from "antd";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_STOPS_BY_MODES } from "../graphql/stops";
import {
  GET_MANAGED_ROUTE_BY_KEY,
  GET_MANAGED_ROUTE_BY_NAME,
  DELETE_MANAGED_ROUTE,
  SAVE_MANAGED_ROUTE,
} from "../graphql/managedRoutes";

// Typescript
import {
  TstopSequence,
  Tstops,
  Tdistance,
  TManagedRoute,
} from "../types/types";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// Import function to format the PTStopItems => variable that comm from the GraphQl query
import { formatPTStopItems } from "../utils/formatPTStopItems";
//
import { formatManagedRouteItems } from "../utils/formatManagedRouteItems";

// get the function to compare the distance between a point and banch of points
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

export default function useIndexHooks() {
  const [stops, setStops] = useState<Tstops[]>([]);
  const [selectedStop, setSelectedStop] = useState<Tstops>();
  const [distance, setDistance] = useState<Tdistance[]>([]);
  const [stopSequence, setStopSequence] = useState<TstopSequence>({
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
  const [managedRoutes, setManagedRoutes] = useState<TManagedRoute[]>([]);
  const [currentMode, setCurrentMode] = useState<string[]>([]);
  const [
    currentManagedRoute,
    setCurrentManagedRoute,
  ] = useState<TManagedRoute>();
  const [
    loadStopSequenceSection,
    setLoadStopSequenceSection,
  ] = useState<boolean>(true);

  const [getStopsByMode, stopsResponse] = useLazyQuery(GET_STOPS_BY_MODES, {
    fetchPolicy: "no-cache",
  });
  const [queryManagedRouteByKey, queryManagedRouteByKeyResponse] = useLazyQuery(
    GET_MANAGED_ROUTE_BY_KEY,
    {
      fetchPolicy: "network-only",
    }
  );
  const [
    queryManagedRouteByName,
    queryManagedRouteByNameResponse,
  ] = useLazyQuery(GET_MANAGED_ROUTE_BY_NAME, {
    fetchPolicy: "no-cache",
  });
  const [deleteManagedRouteMutation] = useMutation(DELETE_MANAGED_ROUTE);
  const [saveManagedRouteMutation] = useMutation(SAVE_MANAGED_ROUTE);

  // Update the state when the managedRoute is queried by name
  useEffect(() => {
    if (queryManagedRouteByNameResponse.data) {
      const { RouteManagerItemsByName } = queryManagedRouteByNameResponse.data;

      setManagedRoutes(RouteManagerItemsByName);
    }
    if (queryManagedRouteByNameResponse.error) {
      console.error(
        "Error from queryManagedRouteByNameResponse " +
          queryManagedRouteByNameResponse.error.message
      );
    }
  }, [queryManagedRouteByNameResponse]);

  // Search managed Route by name
  const handleSearchManagedRouteQuery = useCallback(
    (name: string) => {
      queryManagedRouteByName({
        variables: { name },
      });
    },
    [queryManagedRouteByName]
  );

  // Update the state when the stops is queried
  useEffect(() => {
    if (stopsResponse.data && !queryManagedRouteByKeyResponse.data) {
      const { PTStopItems } = stopsResponse.data;

      //// -> Format stops and set the state
      const formattedStops = formatPTStopItems(PTStopItems);
      setStops(formattedStops);

      // End loading
      setIsSending(false);

      console.log("end fetching");
    }

    if (stopsResponse.error) {
      console.error("Error to fetch the stops " + stopsResponse.error.message);
      // End loading
      setIsSending(false);
    }
  }, [stopsResponse, queryManagedRouteByKeyResponse]);

  // Query stops from backend when we choose the mode
  const handleStopsQuery = useCallback(
    async (modes) => {
      if (isSending) return console.log("Please wait");
      if (!modes.length) return setCurrentMode([]);

      // Start loading
      setIsSending(true);
      console.log("start fetching");
      setCurrentMode(modes);

      // Dispatch the stops GraphQl query
      getStopsByMode({ variables: { modes } });
    },
    [isSending, getStopsByMode]
  );

  // Select the stop in drop part from the drapDrop component to show suggestions
  const handleClickOnDrop = useCallback(
    (stop: Tstops, index: number) => {
      setSelectedStop({ ...stop, index });
      var vorschläge = calculateDistanceAndSort(stop, stops);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stopSequence.trajekt.items
            .map((el: any) => el._id)
            .includes(el.to._id)
      );
      setDistance([...vorschläge]);
      setStopSequence((prev: any) => {
        return {
          ...prev,
          suggestions: {
            title: "Suggestion",
            items: vorschläge.map((el: any) => {
              return {
                ...el.to,
                angle: el.angle,
                distance: el.distance,
              };
            }),
          },
        };
      });
    },
    [stops, stopSequence.trajekt.items]
  );

  // Add stops to the Stop sequence field when we click on stops in suggestions field
  const handleAddStopsOnCLick = useCallback(
    (stop: Tstops) => {
      var vorschläge = calculateDistanceAndSort(stop, stops);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stopSequence.trajekt.items
            .map((el: any) => el._id)
            .includes(el.to._id)
      );
      setDistance([...vorschläge]);

      const index = stopSequence.trajekt.items
        .map((el: any) => el._id)
        .indexOf(selectedStop?._id);
      setSelectedStop({ ...stop, index: index + 1 });

      setStopSequence((prev: any) => {
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
            items: vorschläge.map((el: any) => {
              return {
                ...el.to,
                angle: el.angle,
                distance: el.distance,
              };
            }),
          },
        };
      });
    },
    [stops, stopSequence.trajekt.items, selectedStop]
  );

  // Delete stops from Drop Component
  const handleDeleteStop = useCallback(
    (stop: Tstops, index: number) => {
      let vorschläge: any;
      if (!selectedStop) {
        setStopSequence((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stopSequence.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== stop._id + index
              ),
            },
          };
        });
      }
      if (
        !stopSequence.trajekt.items.filter((item: any) => item._id === stop._id)
          .length
      )
        return;
      if (
        selectedStop &&
        stopSequence.trajekt.items.length > 1 &&
        stop._id + index === selectedStop._id + selectedStop.index
      ) {
        let newValue: any;
        let newIndex: any;
        if (!selectedStop.index) {
          newValue = stopSequence.trajekt.items[index + 1];
          newIndex = index;
        } else {
          newValue = stopSequence.trajekt.items[index - 1];
          newIndex = index - 1;
        }
        setSelectedStop({ ...newValue, index: newIndex });
        vorschläge = calculateDistanceAndSort(newValue, stops);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stopSequence.trajekt.items
              .filter((el) => stop._id !== el._id)
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStopSequence((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stopSequence.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== stop._id + index
              ),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge.map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              }),
            },
          };
        });
      }
      if (
        stopSequence.trajekt.items.length > 1 &&
        selectedStop &&
        stop._id + index !== selectedStop._id + selectedStop.index
      ) {
        //@ts-ignore
        if (index < selectedStop.index) {
          setSelectedStop((prev: any) => {
            return {
              ...prev,
              //@ts-ignore
              index: selectedStop.index - 1,
            };
          });
        }
        vorschläge = calculateDistanceAndSort(selectedStop, stops);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stopSequence.trajekt.items
              .filter((el) => stop._id !== el._id)
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStopSequence((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stopSequence.trajekt.items.filter(
                (item: any, i: number) => item._id + i !== stop._id + index
              ),
            },
            suggestions: {
              title: "Suggestion",
              items: vorschläge.map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              }),
            },
          };
        });
      }
      if (stopSequence.trajekt.items.length === 1) {
        setSelectedStop(undefined);
        setStopSequence((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: stopSequence.trajekt.items.filter(
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
    [stops, stopSequence, selectedStop]
  );

  // Select stops from the Stop search input field
  const handleSelectAutoSearch = useCallback(
    (stop: Tstops) => {
      if (selectedStop) {
        handleAddStopsOnCLick(stop);
      } else {
        var vorschläge = calculateDistanceAndSort(stop, stops);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stopSequence.trajekt.items
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);

        setSelectedStop({
          ...stop,
          index: stopSequence.trajekt.items.length,
        });
        setStopSequence((prev: any) => {
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
              items: vorschläge.map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              }),
            },
          };
        });
      }
    },
    [stops, stopSequence.trajekt.items, selectedStop, handleAddStopsOnCLick]
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
      if (
        destination.droppableId === "suggestions" &&
        source.droppableId === "suggestions"
      ) {
        return;
      }
      const itemCopy = {
        ...getProperty(stopSequence, source.droppableId).items[source.index],
      };

      setStopSequence((prev) => {
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

      const index = stopSequence.trajekt.items
        .map((el: any) => el._id)
        .indexOf(itemCopy._id);
      handleClickOnDrop(itemCopy, index);
    },
    [stopSequence, handleClickOnDrop]
  );

  // Add Stop before the selected Stop
  const handleAddBeforselectedStop = useCallback(
    (stopMarker: Tstops) => {
      if (
        selectedStop &&
        stopSequence.trajekt.items.filter(
          (item: any) => item._id === selectedStop._id
        ).length &&
        stopSequence.trajekt.items.filter(
          (item: any) => item._id === stopMarker._id
        ).length === 0
      ) {
        const index = stopSequence.trajekt.items
          .map((el: any, i: number) => el._id + i)
          .indexOf(selectedStop._id + selectedStop.index);
        setSelectedStop({ ...stopMarker, index });
        var vorschläge = calculateDistanceAndSort(stopMarker, stops);
        // Delete the repetition from the Suggestion Field
        vorschläge = vorschläge.filter(
          (el: any) =>
            !stopSequence.trajekt.items
              .map((el: any) => el._id)
              .includes(el.to._id)
        );
        setDistance([...vorschläge]);
        setStopSequence((prev: any) => {
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
              items: vorschläge.map((el: any) => {
                return {
                  ...el.to,
                  angle: el.angle,
                  distance: el.distance,
                };
              }),
            },
          };
        });
      }
    },
    [stops, stopSequence, selectedStop]
  );

  // Click on Marker in Map component
  const handleClickOnMapMarker = useCallback(
    (station: Tstops, index: number) => {
      if (selectedStop?._id === station._id) return;

      if (
        stopSequence.trajekt.items.filter(
          (item: any) => item._id === station._id
        ).length === 0
      ) {
        handleAddStopsOnCLick(station);
      } else {
        handleClickOnDrop(station, index);
      }
    },
    [
      stopSequence.trajekt.items,
      selectedStop,
      handleAddStopsOnCLick,
      handleClickOnDrop,
    ]
  );

  // Reset and delete all
  const handleResetManagedRoute = useCallback(() => {
    setSelectedStop(undefined);
    setStopSequence({
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
    handleResetManagedRoute();
    setCurrentManagedRoute(undefined);
  }, [handleResetManagedRoute]);

  // Save managed Route in data base
  const handleSaveManagedRouteMutation = useCallback(
    async (managedRouteForm: any) => {
      const { items } = stopSequence.trajekt;
      let body: any;

      if (isSending) return console.log("Please wait");
      if (!items.length) return console.log("Please create your stop sequence");

      if (currentManagedRoute) {
        body = {
          ...currentManagedRoute,
          name: managedRouteForm.name,
          desc: managedRouteForm.desc,
          schedule: managedRouteForm.schedule,
          stopSequence: items.map((item: any) => ({
            key: item.key,
            name: item.name,
          })),
        };
      } else {
        body = {
          ...managedRouteForm,
          key: v4(),
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
        const saveResponse = await saveManagedRouteMutation({
          variables: { data: body },
        });

        if (saveResponse.data.RouteManagerAdd) {
          console.log("Route successfully saved");
          message.success(`Linie erfolgreich gespeichert`);

          handleClearAll();
        } else {
          message.error("Konnte die Linie nicht speichern");
        }
      } catch (error) {
        console.error("Error from trycatch saveManagedRoute ", error);
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [
      stopSequence,
      isSending,
      currentMode,
      currentManagedRoute,
      handleClearAll,
      saveManagedRouteMutation,
    ]
  );

  // Load managed Route and stops when we dispatch handleLoadManagedRouteQuery function
  useEffect(() => {
    if (
      stopsResponse.data &&
      queryManagedRouteByKeyResponse.data &&
      loadStopSequenceSection
    ) {
      const { PTStopItems } = stopsResponse.data;
      const { RouteManagerItemByKey } = queryManagedRouteByKeyResponse.data;

      //// -> Format stops and set the state
      const stopsFormatted = formatPTStopItems(PTStopItems);
      setStops(stopsFormatted);

      // Check if the stops mode is equal to the stopSequence mode
      if (
        !(
          PTStopItems[0].data &&
          PTStopItems[0].data.modes.filter(
            (mode: string) => mode === RouteManagerItemByKey[0].modes[0]
          ).length
        )
      ) {
        return setIsSending(false);
      }

      //// -> Format managedRoute and set the state
      const routeManagerFormatted = formatManagedRouteItems(
        stopsFormatted,
        RouteManagerItemByKey
      );
      setCurrentManagedRoute({ ...routeManagerFormatted[0] });
      setStopSequence((prev) => {
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

      console.log("End fetching the managed Route");
    } else if (
      stopsResponse.data &&
      queryManagedRouteByKeyResponse.data &&
      !loadStopSequenceSection
    ) {
      queryManagedRouteByKeyResponse.data = undefined;
      setIsSending(false);
    }

    if (stopsResponse.error) {
      console.error("Error to fetch the stops " + stopsResponse.error.message);
      // End loading
      setIsSending(false);
    }

    if (queryManagedRouteByKeyResponse.error) {
      console.error(
        "Error to fetch the queryManagedRouteByKeyResponse" +
          queryManagedRouteByKeyResponse.error.message
      );
      // End loading
      setIsSending(false);
    }
  }, [stopsResponse, queryManagedRouteByKeyResponse, loadStopSequenceSection]);

  // Display the stop sequence on map when we load from the backend
  const handleLoadManagedRouteQuery = useCallback(
    (modes: string[], key: string) => {
      if (isSending) return console.log("Please Wait");
      setIsSending(true);
      console.log("Start fetching the managed Route");

      // Dispatch the stops GraphQl query
      getStopsByMode({ variables: { modes } });

      // Dispatch the managed Route GraphQl query
      queryManagedRouteByKey({ variables: { key } });
    },
    [isSending, getStopsByMode, queryManagedRouteByKey]
  );

  // Delete managed Route by Id
  const handleDeleteManagedRouteMutation = useCallback(
    async (key: string) => {
      if (isSending) return console.log("Please Wait");
      setIsSending(true);
      try {
        // GraphQL
        const deleteResponse = await deleteManagedRouteMutation({
          variables: { key },
        });
        if (deleteResponse.data.RouteManagerDelete) {
          message.success(`Linie erfolgreich gelöscht`);
          console.log(`Linie successfully deleted`);

          handleClearAll();
          setCurrentManagedRoute(undefined);
        } else {
          message.error("Konnte die Linie nicht löschen");
        }
      } catch (err) {
        console.error("Error from deleteManagedRoute tryCatch ", err);
      }
      setIsSending(false);
    },
    [isSending, deleteManagedRouteMutation, handleClearAll]
  );

  // Set the mode Load or New
  const handleLoadMode = useCallback(
    (value: boolean) => {
      handleClearAll();
      setLoadStopSequenceSection(value);
      setManagedRoutes([]);
    },
    [handleClearAll]
  );

  const [
    isHeaderSaveButtonDisabled,
    setIsHeaderSaveButtonDisabled,
  ] = useState<boolean>(true);
  const [clickedHeaderButton, setClickedHeaderButton] = useState<string>("");
  const [toggleLoadOrNew, setToggleLoadOrNew] = useState<boolean>(true);
  const SaveRef = useRef<{
    current: { saveManagedRouteMutation: () => void };
  }>();

  const handleClickOnHeaderCancelButton = () => {
    setClickedHeaderButton("");
    handleStopsQuery([]);
  };

  const handleClickOnHeaderLoadButton = () => {
    setToggleLoadOrNew(true);
    handleLoadMode(true);
    setClickedHeaderButton("laden");
  };

  const handleClickOnHeaderNewButton = () => {
    setToggleLoadOrNew(false);
    handleLoadMode(false);
    setClickedHeaderButton("erstellen");
  };

  const handleClickOnHeaderSaveButton = () => {
    //@ts-ignore
    SaveRef?.current?.onSaveManagedRouteMutation();
  };

  const handleIsHeaderSaveButtonDisabled = (value: boolean) => {
    setIsHeaderSaveButtonDisabled(value);
  };

  return {
    stops,
    SaveRef,
    distance,
    isSending,
    currentMode,
    stopSequence,
    selectedStop,
    managedRoutes,
    toggleLoadOrNew,
    currentManagedRoute,
    clickedHeaderButton,
    isHeaderSaveButtonDisabled,
    handleDragEnd,
    handleLoadMode,
    handleClearAll,
    handleDeleteStop,
    handleStopsQuery,
    handleClickOnDrop,
    handleAddStopsOnCLick,
    handleSelectAutoSearch,
    handleClickOnMapMarker,
    handleResetManagedRoute,
    handleAddBeforselectedStop,
    handleLoadManagedRouteQuery,
    handleClickOnHeaderNewButton,
    handleClickOnHeaderLoadButton,
    handleClickOnHeaderSaveButton,
    handleSearchManagedRouteQuery,
    handleSaveManagedRouteMutation,
    handleClickOnHeaderCancelButton,
    handleDeleteManagedRouteMutation,
    handleIsHeaderSaveButtonDisabled,
  };
}
