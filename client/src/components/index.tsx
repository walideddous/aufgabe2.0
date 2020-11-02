import React, { useState, useCallback, Fragment } from "react";
import axios from "axios";
import { v4 } from "uuid";
import { Row, Spin, Col, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Import const values to connect with graphQL
import {
  GRAPHQL_API,
  GET_STOPS_BY_MODES,
  GET_STOP_SEQUENCE_BY_MODES,
} from "../config/config";

// Import composents
import DragDrop from "./dnd/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./form/SaveStopsSequenceForm";
import LoadStopSequence from "./loadStopSequenceForm/LoadStopSequence";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

// Typescript
export interface Tstations {
  index?: number;
  _id: string;
  name: string;
  coord: {
    WGS84: {
      lat: number;
      lon: number;
    };
  };
  modes: [String];
}

export interface Tdistance {
  from: string;
  to: Tstations;
  distance: number;
}

export interface TstateDND {
  vorschlag: {
    title: string;
    items: {
      _id: string;
      name: string;
    }[];
  };
  trajekt: {
    title: string;
    items: {
      _id: string;
      name: string;
    }[];
  };
}

const authAxios = axios.create({
  baseURL: GRAPHQL_API,
  headers: {
    authorization: "Bearer " + process.env.REACT_APP_JSON_SECRET_KEY,
  },
});

// Custom Loader
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

const Aufgabe: React.FC = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [selected, setSelected] = useState<Tstations>();
  const [distance, setDistance] = useState<Tdistance[]>([]);
  const [stateDND, setStateDND] = useState<TstateDND>({
    vorschlag: {
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

  // Send the request when you click on get the Data button
  const sendRequest = useCallback(
    async (modes) => {
      if (isSending) return;
      // update state
      setIsSending(true);
      setSelected(undefined);
      setStateDND({
        vorschlag: {
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
        // GraphQl
        const queryResult = await authAxios.post("/graphql", {
          query: GET_STOPS_BY_MODES(modes),
        });
        const queryStopSequence = await authAxios.post("/graphql", {
          query: GET_STOP_SEQUENCE_BY_MODES(modes),
        });

        console.log("end fetching");
        if (queryResult && queryStopSequence) {
          const { haltestelleByMode } = queryResult.data.data;
          const { stopSequenceByMode } = queryStopSequence.data.data;
          setStations([...haltestelleByMode]);
          setStopSequenceList(stopSequenceByMode);
          setCurrentMode(modes);
          setUpdateDate(Date().toString().substr(4, 24));
        } else {
          console.log("not authorized provid a token");
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
          vorschlag: {
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
          vorschlag: {
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
            vorschlag: {
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
            vorschlag: {
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
            vorschlag: {
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
    (elementSelected: Tstations) => {
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
            vorschlag: {
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
            vorschlag: {
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
            vorschlag: {
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
            vorschlag: {
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
            vorschlag: {
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
    (e: any) => {
      const response = stations.filter((el, i) => el.name === e)[0];
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
    setSelected(undefined);
    setCurrentStopSequence({});
    setStateDND({
      vorschlag: {
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
        console.log("send the saved Stop sequence");
        // REST_API
        const result = await authAxios.put("/savedStopSequence", body);
        if (!result) {
          console.error("Result not found");
          message.error("cannot save the stop sequence");
        }
        console.log(result.data.msg);
        if (result.data.msg) {
          message.success(result.data.msg);
          // Set the state of stopSequence List
          setSavedStopSequence((prev) => {
            return prev.concat({ ...body });
          });
          clearAll();
        }
      } catch (error) {
        console.error(error, "error from trycatch");
        message.error(error);
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
  /*
      clickOnDrop(
        input.stopSequence[input.stopSequence.length - 1],
        input.stopSequence.length - 1
      );
  */

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
        const result = await authAxios.delete(`/savedStopSequence/${id}`);
        if (!result) {
          console.error("Result not found");
          message.error("cannot delete the stop sequence");
        }
        console.log(result.data.msg);
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
        message.error(error);
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [clearAll, isSending]
  );

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <LoadStopSequence
            stateDND={stateDND}
            stopSequenceList={stopSequenceList}
            currentStopSequence={currentStopSequence}
            onSendRequest={sendRequest}
            handleUpdateAfterSave={handleUpdateAfterSave}
            onClearAll={clearAll}
            handleDeleteStopSequence={handleDeleteStopSequence}
            ondisplayStopSequence={handledisplayStopSequence}
          />
        </Col>
        {isSending ? (
          <div
            style={{
              marginTop: "20%",
              marginLeft: "50%",
              marginRight: " -50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spin
              indicator={antIcon}
              style={{
                display: "flex",
              }}
            />
          </div>
        ) : (
          <Fragment>
            <Col xs={24}>
              <SaveStopsSequenceForm />
            </Col>
            <Map
              stations={stations}
              stateDND={stateDND}
              selected={selected}
              distance={distance}
              handleSelectAutoSearch={onSelectAutoSearch}
              currentStopSequence={currentStopSequence}
              onAddBeforSelected={handleAddBeforSelected}
              onAddAfterSelected={handleAddAfterSelected}
              onDeleteMarkerFromMap={handleDeleteMarkerFromMap}
              selectMarkerOnMap={clickOnMapMarker}
            />
            <Col xxl={12} xs={24}>
              <DragDrop
                stateDND={stateDND}
                selected={selected}
                handleAddStopsOnCLick={handleAddStopsOnCLick}
                handleDragEnd={handleDragEnd}
                onclick={clickOnDrop}
                onDelete={handleDeleteOnDND}
              />
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default Aufgabe;

/*
        {addStopSequence && (
          <Fragment>
            <Col xxl={8} xs={12}>
              <SearchInput
                stations={stations}
                handleSelectAutoSearch={onSelectAutoSearch}
              />
            </Col>
            <NavBar
              isSending={isSending}
              stateDND={stateDND}
              stopSequenceList={stopSequenceList}
              updateDate={updateDate}
              currentMode={currentMode}
              currentStopSequence={currentStopSequence}
              savedStopSequence={savedStopSequence}
              handleDeleteStopSequence={handleDeleteStopSequence}
              onSendRequest={sendRequest}
              onClearAll={clearAll}
              handleUpdateAfterSave={handleUpdateAfterSave}
              ondisplayStopSequence={handledisplayStopSequence}
            />
          </Fragment>
        )}
*/
