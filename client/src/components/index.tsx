import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import axios from "axios";
import { uuid } from "uuidv4";
import { Row, Menu, Dropdown, Spin, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";

// Import const values to connect with graphQL
import { GRAPHQL_API, GET_STOPS_BY_MODES } from "../config/config";

// Import composents
import Info from "./info/Info";
import SearchInput from "./search/SearchInput";
import DragDrop from "./dnd/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./form/SaveStopsSequenceForm";

// Import the types of the state
import { Tstations, TstateDND, Tchoose, Tdistance } from "./type/Types";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

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
  const [choose, setChoose] = useState<Tchoose>("");
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
  const [lastAutoSelectElem, setlastAutoSelectElem] = useState<Tstations>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [updateDate, setUpdateDate] = useState<string>();
  const [modes, setModes] = useState<string>("Choose Mode");
  const [currentMode, setCurrentMode] = useState<string>("");

  // Send the request when you click on get the Data button
  const sendRequest = useCallback(async () => {
    if (isSending) return;
    if (modes === currentMode) return;
    // update state
    setIsSending(true);
    setSelected(undefined);
    setlastAutoSelectElem(undefined);
    setCurrentMode(modes);
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

      console.log("end fetching");
      if (queryResult) {
        const result = queryResult.data.data.haltestelleByMode;
        //const result = testResult.data;
        setStations([...result]);
        setUpdateDate(Date().toString().substr(4, 24));
      } else {
        console.log("not aithorized provid a token");
      }
    } catch (error) {
      console.error(error, "error from trycatch");
    }
    // once the request is sent, update state again
    setIsSending(false);
  }, [isSending, modes, currentMode]);

  // Update the state of stateDND when you drag and drop
  useEffect(() => {
    if (lastAutoSelectElem) {
      var vorschläge = calculateDistanceAndSort(lastAutoSelectElem, stations);
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
  }, [lastAutoSelectElem, stations, stateDND.trajekt.items]);

  // Select the Station when you click on the button to show the suggestion
  const clickOnDrop = useCallback(
    (e: any, index: number) => {
      const response = stations.filter((el) => el._id === e._id)[0];
      setSelected({ ...response, index });
      setlastAutoSelectElem(undefined);
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
    (e: any) => {
      const response = stations.filter((el) => el._id === e._id)[0];
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el._id).includes(el.to._id)
      );
      setDistance([...vorschläge]);

      if (selected) {
        const index = stateDND.trajekt.items
          .map((el: any) => el._id)
          .indexOf(selected._id);
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
        setSelected({ ...response });
      } else {
        setlastAutoSelectElem({ ...response });
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: [
                ...prev.trajekt.items,
                {
                  ...response,
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

  // Delete the button from Drop Part
  const handleDeleteOnDND = useCallback(
    (e: any, index: number) => {
      if (
        (e._id === lastAutoSelectElem?._id || e._id === selected?._id) &&
        stateDND.trajekt.items[index] === e &&
        stateDND.trajekt.items.length > 1
      ) {
        let newValue =
          stateDND.trajekt.items[stateDND.trajekt.items.length - 2];
        setlastAutoSelectElem(
          stations.filter((el) => el._id === newValue._id)[0]
        );
        setSelected(undefined);
      }
      if (stateDND.trajekt.items.length === 1) {
        setlastAutoSelectElem(undefined);
        setSelected(undefined);
      }
      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Stop sequence",
            items: stateDND.trajekt.items.filter(
              (item: any) => item._id !== e._id
            ),
          },
        };
      });
      if (stateDND.trajekt.items.length === 1) {
        setlastAutoSelectElem(undefined);
        setSelected(undefined);
        setStateDND((prev: any) => {
          return {
            ...prev,
            vorschlag: {
              title: "Suggestion",
              items: [],
            },
          };
        });
      }
    },
    [stations, lastAutoSelectElem, selected, stateDND.trajekt.items]
  );

  // to choose the station from the input options
  const onEvent = useCallback(
    (elementSelected: Tstations) => {
      setlastAutoSelectElem({ ...elementSelected });
      setSelected(undefined);
      setChoose(elementSelected.name);
      var vorschläge = calculateDistanceAndSort(elementSelected, stations);
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
    },
    [stations, stateDND.trajekt.items]
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
      setSelected(itemCopy);
      setlastAutoSelectElem(undefined);
    },
    [stateDND]
  );

  // Context menu to add the stop After the selected stops in the drop Menu
  const handleAddAfterSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el) => el.name === e)[0];
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0 &&
        !selected
      ) {
        setlastAutoSelectElem({ ...response });
        setSelected(undefined);
        var vorschläge = calculateDistanceAndSort(lastAutoSelectElem, stations);
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
              items: [
                ...prev.trajekt.items,
                {
                  ...response,
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
      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0
      ) {
        const index = stateDND.trajekt.items
          .map((el: any) => el._id)
          .indexOf(selected._id);
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
          };
        });
        setSelected({ ...response });
      }
    },
    [stations, stateDND.trajekt.items, lastAutoSelectElem, selected]
  );

  // Context menu to add the stop before the selected stops in the drop Menu
  const handleAddBeforSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el, i) => el.name === e)[0];
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0 &&
        !selected
      ) {
        setStateDND((prev: any) => {
          return {
            ...prev,
            trajekt: {
              title: "Stop sequence",
              items: prev.trajekt.items
                .filter(
                  (el: any, index: number, tab: any) => index !== tab.length - 1
                )
                .concat({
                  ...response,
                })
                .concat(prev.trajekt.items[prev.trajekt.items.length - 1]),
            },
          };
        });
      }

      if (
        selected &&
        stateDND.trajekt.items.filter((item: any) => item._id === selected._id)
          .length &&
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length === 0
      ) {
        const index = stateDND.trajekt.items
          .map((el: any) => el._id)
          .indexOf(selected._id);
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
          };
        });
      }
    },
    [stations, stateDND.trajekt.items, selected]
  );

  // Click on Marker
  const clickOnMapMarker = useCallback(
    (el: Tstations, index: number) => {
      const newValue = {
        ...el,
        coord: {
          //@ts-ignore
          WGS84: { lat: el.coord.WGS84[0], lon: el.coord.WGS84[1] },
        },
      };
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
      setlastAutoSelectElem(undefined);
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === el._id)
          .length === 0
      ) {
        handleAddStopsOnCLick(el);
      }
    },
    [stations, stateDND.trajekt.items, handleAddStopsOnCLick]
  );

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    setModes(event.item.props.children[1]);
  }, []);
  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        <Menu.Item key="2">13</Menu.Item>
        <Menu.Item key="3">5</Menu.Item>
        <Menu.Item key="4">8</Menu.Item>
        <Menu.Item key="5">9</Menu.Item>
        <Menu.Item key="6">2</Menu.Item>
        <Menu.Item key="7">4</Menu.Item>
      </Menu>
    ),
    [handleDropDownMenu]
  );

  // Reset and delete all
  const clearAll = useCallback(() => {
    setSelected(undefined);
    setlastAutoSelectElem(undefined);
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
      const { name, valid, time } = formInput;
      const { items } = stateDND.trajekt;
      if (isSending) return;
      // update state
      setIsSending(true);
      // send the actual request
      try {
        console.log("send the saved Stop sequence");
        // REST_API
        const result = await authAxios.post(
          "/savedStopSequence",

          { _id: uuid(), name, valid, time, stopSequence: items }
        );

        if (!result) {
          console.error("Result not found");
        }

        console.log(result.data.msg);
      } catch (error) {
        console.error(error, "error from trycatch");
      }
      // once the request is sent, update state again
      setIsSending(false);
    },
    [stateDND.trajekt, isSending]
  );

  const handleDeleteMarkerFromMap = useCallback(
    (e: any) => {
      const response = stations.filter((el, i) => el.name === e)[0];
      if (
        stateDND.trajekt.items.filter((item: any) => item._id === response._id)
          .length
      ) {
        const index = stateDND.trajekt.items
          .map((el: any) => el._id)
          .indexOf(response._id);
        handleDeleteOnDND(response, index);
        if (index === stateDND.trajekt.items.length - 1) {
          //@ts-ignore
          setlastAutoSelectElem(stateDND.trajekt.items[index - 1]);
        }
      }
    },
    [stations, stateDND.trajekt.items, handleDeleteOnDND]
  );

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <SearchInput stations={stations} handleEvent={onEvent} />
        </Col>
        <Col lg={3} xs={12}>
          <Dropdown overlay={menu}>
            <p
              className="ant-dropdown-link"
              style={{ margin: 20, cursor: "pointer" }}
            >
              <strong>Modes : </strong>
              {modes} <DownOutlined />
            </p>
          </Dropdown>
        </Col>
        <Col lg={3} xs={12}>
          <p style={{ margin: 20 }}>
            <strong>Current mode : </strong>
            {currentMode}
            <br />
            <strong>Update at : </strong>
            {updateDate}
          </p>
        </Col>
        <Col
          lg={6}
          xs={12}
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            style={
              isSending || modes !== "Choose Mode"
                ? {
                    width: "80%",
                    margin: 1,
                    backgroundColor: "#3949ab",
                    color: "white",
                    borderRadius: "5px",
                    outline: "0",
                    cursor: "pointer",
                    boxShadow: "0px 2px 2px lightgray",
                  }
                : {
                    width: "80%",
                    margin: 1,
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    outline: "0",
                    boxShadow: "0px 2px 2px lightgray",
                  }
            }
            disabled={isSending || modes !== "Choose Mode" ? false : true}
            onClick={sendRequest}
          >
            {modes === "Choose Mode"
              ? "Select a Mode"
              : `Get the Data with modes ${modes}`}
          </button>
          <button
            style={
              stateDND.trajekt.items.length
                ? {
                    width: "80%",
                    margin: 1,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "5px",
                    outline: "0",
                    cursor: "pointer",
                    boxShadow: "0px 2px 2px lightgray",
                  }
                : {
                    width: "80%",
                    margin: 1,
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    outline: "0",
                    boxShadow: "0px 2px 2px lightgray",
                  }
            }
            disabled={stateDND.trajekt.items.length ? false : true}
            onClick={clearAll}
          >
            Reset
          </button>
        </Col>
        {isSending ? (
          <div
            style={{
              margin: "0",
              position: "absolute",
              marginTop: "25%",
              left: "50%",
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
            <DragDrop
              choose={choose}
              stateDND={stateDND}
              selected={selected}
              lastAutoSelectElem={lastAutoSelectElem}
              handleAddStopsOnCLick={handleAddStopsOnCLick}
              handleDragEnd={handleDragEnd}
              onclick={clickOnDrop}
              onDelete={handleDeleteOnDND}
            />
            <Map
              stations={stations}
              stateDND={stateDND}
              selected={selected}
              lastAutoSelectElem={lastAutoSelectElem}
              onAddBeforSelected={handleAddBeforSelected}
              onAddAfterSelected={handleAddAfterSelected}
              onDeleteMarkerFromMap={handleDeleteMarkerFromMap}
              selectMarkerOnMap={clickOnMapMarker}
            />
            <Col lg={12} xs={24}>
              <Info
                selected={selected}
                distance={distance}
                lastAutoSelectElem={lastAutoSelectElem}
              />
              <SaveStopsSequenceForm
                handleSaveStopSequence={saveStopSequence}
                stateDND={stateDND}
              />
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default React.memo(Aufgabe);
