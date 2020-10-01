import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import axios from "axios";
import { Row, Menu, Dropdown, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";

// Import const values to connect with graphQL
import { GRAPHQL_API, GET_STOPS_BY_MODES } from "../config/config";

// Import composents
import Info from "./info/Info";
import SearchInput from "./search/SearchInput";
import DragDrop from "./dnd/DragDrop";

// The new map to test map without react-leaflet
import NewMap from "./map/newMap";

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
      title: "Road",
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
        title: "Road",
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
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );

      setDistance([...vorschläge]);

      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
          },
        };
      });
    }
  }, [lastAutoSelectElem, stations, stateDND.trajekt.items]);

  // Select the Station when you click on the button to show the suggestion
  const clickOnDrop = useCallback(
    (e: { id: string | number; name: string }, index: number) => {
      const response = stations.filter((el) => el.name === e.name)[0];
      setSelected({ ...response, index });
      setlastAutoSelectElem(undefined);
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );

      setDistance([...vorschläge]);
      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
          },
        };
      });
    },
    [stations, stateDND.trajekt.items]
  );

  // add the stations on Road Field when you click on button suggestion
  const handleAddStopsOnCLick = useCallback(
    (e: { id: string | number; name: string }, index: number) => {
      const response = stations.filter((el, i) => el.name === e.name)[0];
      setlastAutoSelectElem({ ...response });
      setSelected(undefined);
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );
      setDistance([...vorschläge]);

      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Road",
            items: [
              ...prev.trajekt.items,
              {
                ...response,
              },
            ],
          },
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
          },
        };
      });
    },
    [stations, stateDND.trajekt.items]
  );

  // Delete the button from Drop Part
  const handleDeleteOnDND = useCallback(
    (
      e: { id: string | number; name: string },
      SourceOrTarget: string,
      index: number
    ) => {
      if (SourceOrTarget === "Road") {
        if (
          (e.name === lastAutoSelectElem?.name || e.name === selected?.name) &&
          stateDND.trajekt.items[index] === e &&
          stateDND.trajekt.items.length > 1
        ) {
          let newValue =
            stateDND.trajekt.items[stateDND.trajekt.items.length - 2];
          setlastAutoSelectElem(
            stations.filter((el) => el.name === newValue.name)[0]
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
              title: "Road",
              items: stateDND.trajekt.items.filter(
                (item: any) => item.id !== e.id
              ),
            },
          };
        });
      }
      if (SourceOrTarget === "Suggestion") {
        setStateDND((prev: any) => {
          return {
            ...prev,
            vorschlag: {
              title: "Suggestion",
              items: stateDND.vorschlag.items.filter(
                (item: any) => item.id !== e.id
              ),
            },
          };
        });
      }
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
    [
      stations,
      lastAutoSelectElem,
      selected,
      stateDND.trajekt.items,
      stateDND.vorschlag.items,
    ]
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
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );
      setDistance([...vorschläge]);
      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Road",
            items: [
              ...prev.trajekt.items,
              {
                ...elementSelected,
              },
            ],
          },
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
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
      setSelected(undefined);
      let lastElem: any;
      if (stateDND.trajekt.items.length) {
        lastElem = stateDND.trajekt.items[stateDND.trajekt.items.length - 1];
        if (lastElem.name) {
          lastElem = stations.filter((el) => el.name === lastElem.name)[0];
          setlastAutoSelectElem({ ...lastElem });
        }
      }
    },
    [stations, stateDND]
  );

  // Context menu to add the stop After the selected stops in the drop Menu
  const handleAddAfterSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el, i) => el.name === e)[0];
      setlastAutoSelectElem({ ...response });
      setSelected(undefined);
      var vorschläge = calculateDistanceAndSort(response, stations);
      // Delete the repetition from the Suggestion Field
      vorschläge = vorschläge.filter(
        (el: any) =>
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );
      setDistance([...vorschläge]);

      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Road",
            items: [
              ...prev.trajekt.items,
              {
                ...response,
              },
            ],
          },
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
          },
        };
      });
    },
    [stations, stateDND.trajekt.items]
  );

  // Context menu to add the stop before the selected stops in the drop Menu
  const handleAddBeforSelected = useCallback(
    (e: string) => {
      const response = stations.filter((el, i) => el.name === e)[0];
      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Road",
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
    },
    [stations]
  );

  // Click on Marker
  const clickOnMapMarker = useCallback(
    async (el: Tstations, index: number) => {
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
          !stateDND.trajekt.items.map((el: any) => el.name).includes(el.to.name)
      );
      setDistance([...vorschläge]);
      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                ...vorschläge[0].to,
              },
              {
                ...vorschläge[1].to,
              },
              {
                ...vorschläge[2].to,
              },
              {
                ...vorschläge[3].to,
              },
              {
                ...vorschläge[4].to,
              },
            ],
          },
        };
      });
      setlastAutoSelectElem(undefined);
    },
    [stations, stateDND.trajekt.items]
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
  const clearAll = () => {
    setSelected(undefined);
    setlastAutoSelectElem(undefined);
    setStateDND({
      vorschlag: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Road",
        items: [],
      },
    });
  };

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[14, 14]}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SearchInput stations={stations} handleEvent={onEvent} />
          <Dropdown overlay={menu}>
            <p
              className="ant-dropdown-link"
              style={{ margin: 20, cursor: "pointer" }}
            >
              <strong>Modes : </strong>
              {modes} <DownOutlined />
            </p>
          </Dropdown>
          ,
          <p style={{ margin: 20 }}>
            <strong>Current mode : </strong>
            {currentMode}
            <br />
            <strong>Update at : </strong>
            {updateDate}
          </p>
          <button
            style={
              isSending || modes !== "Choose Mode"
                ? {
                    margin: 20,
                    backgroundColor: "#3949ab",
                    color: "white",
                    borderRadius: "5px",
                    outline: "0",
                    cursor: "pointer",
                    boxShadow: "0px 2px 2px lightgray",
                  }
                : {
                    margin: 20,
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
                    margin: 20,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "5px",
                    outline: "0",
                    cursor: "pointer",
                    boxShadow: "0px 2px 2px lightgray",
                  }
                : {
                    margin: 20,
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
        </div>

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
            <NewMap
              stations={stations}
              stateDND={stateDND}
              selected={selected}
              lastAutoSelectElem={lastAutoSelectElem}
              onAddBeforSelected={handleAddBeforSelected}
              onAddAfterSelected={handleAddAfterSelected}
              selectMarkerOnMap={clickOnMapMarker}
            />
            <Info
              selected={selected}
              distance={distance}
              lastAutoSelectElem={lastAutoSelectElem}
            />
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default React.memo(Aufgabe);
