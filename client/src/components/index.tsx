import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Row, Button } from "antd";
import { v4 } from "uuid";

// Import const values to connect with graphQL
import { GET_HALTESTELLE_QUERY, GRAPHQL_API } from "../config/config";

// Import composents
import OnMap from "./map/OnMap";
import Info from "./info/Info";
import SearchInput from "./search/SearchInput";
import DragDrop from "./dnd/DragDrop";

// Import the types of the state
import {
  Tstations,
  TstateDND,
  Tloading,
  Tchoose,
  Tdistance,
} from "./type/Types";

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

const Aufgabe: React.FC = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [loading, setLoading] = useState<Tloading>(true);
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

  // Send the request when you click on get the Data button
  const sendRequest = useCallback(async () => {
    if (isSending) return;
    // update state
    setIsSending(true);
    // send the actual request
    try {
      const queryResult = await authAxios.post("", {
        query: GET_HALTESTELLE_QUERY,
      });
      if (queryResult) {
        const result = queryResult.data.data.haltestelles;
        setStations(result);
        setUpdateDate(Date().toString().substr(4, 24));
        setLoading(false);
      } else {
        console.log("not aithorized provid a token");
      }
    } catch (error) {
      console.error("error from trycatch");
    }
    // once the request is sent, update state again
    setIsSending(false);
  }, [isSending]);

  // Fetch the data from the Backend and set the state "Stations"
  /* useEffect(() => {
    // Simulation a call from the Backend
    const fetchDataFromBackend = async () => {
      try {
        const queryResult = await authAxios.post("", {
          query: GET_HALTESTELLE_QUERY,
        });
        if (queryResult) {
          const result = queryResult.data.data.haltestelles;
          setStations(result);
          setLoading(false);
        } else {
          console.log("not aithorized provid a token");
        }
      } catch (error) {
        console.error("error from trycatch");
      }
    };
    fetchDataFromBackend();
  }, []);
  */

  // Update the state of stateDND when you drag and drop
  useEffect(() => {
    if (lastAutoSelectElem) {
      const vorschläge = calculateDistanceAndSort(lastAutoSelectElem, stations);
      setDistance(vorschläge);

      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Suggestion",
            items: [
              {
                id: v4(),
                name: vorschläge[0].to.name,
              },
              {
                id: v4(),
                name: vorschläge[1].to.name,
              },
              {
                id: v4(),
                name: vorschläge[2].to.name,
              },
            ],
          },
        };
      });
    }
  }, [lastAutoSelectElem, stations]);

  // Select the Station when you click on the button to show the suggestion
  const clickOnDrop = (
    e: { id: string | number; name: string },
    index: number
  ) => {
    const response = stations.filter((el) => el.name === e.name)[0];
    setSelected({ ...response, index });
    setlastAutoSelectElem(undefined);

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        vorschlag: {
          title: "Suggestion",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.name,
            },
            {
              id: v4(),
              name: vorschläge[1].to.name,
            },
            {
              id: v4(),
              name: vorschläge[2].to.name,
            },
          ],
        },
      };
    });
  };

  // Delete the button from Drag and drop
  const handleDeleteOnDND = (
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
  };

  // to choose the station from the input options
  const onEvent = (e: string) => {
    const response = stations.filter((el) => el.name === e)[0];
    setlastAutoSelectElem(response);
    setSelected(undefined);

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setChoose(e);
    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Road",
          items: [
            ...prev.trajekt.items,
            {
              id: v4(),
              name: e,
            },
          ],
        },
        vorschlag: {
          title: "Suggestion",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.name,
            },
            {
              id: v4(),
              name: vorschläge[1].to.name,
            },
            {
              id: v4(),
              name: vorschläge[2].to.name,
            },
          ],
        },
      };
    });
  };

  // To Drag and Drop from source to the destination
  const handleDragEnd = ({ destination, source }: any) => {
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
  };

  const handleAddAfterSelected = (e: string) => {
    const response = stations.filter((el) => el.name === e)[0];

    setlastAutoSelectElem(response);
    setSelected(undefined);

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Road",
          items: [
            ...prev.trajekt.items,
            {
              id: v4(),
              name: e,
            },
          ],
        },
        vorschlag: {
          title: "Suggestion",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.name,
            },
            {
              id: v4(),
              name: vorschläge[1].to.name,
            },
            {
              id: v4(),
              name: vorschläge[2].to.name,
            },
          ],
        },
      };
    });
  };

  const handleAddBeforSelected = () => {
    console.log("last auto inside the function", lastAutoSelectElem);
    // setStateDND((prev: any) => {
    //   return {
    //     ...prev,
    //     trajekt: {
    //       title: "Road",
    //       items: [
    //         {
    //           id: v4(),
    //           name: e,
    //         },
    //         ...prev.trajekt.items,
    //       ],
    //     },
    //   };
    // });
  };

  const clickOnMapMarker = (el: Tstations, index: number) => {
    setSelected({ ...el, index });

    const vorschläge = calculateDistanceAndSort(el, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        vorschlag: {
          title: "Suggestion",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.name,
            },
            {
              id: v4(),
              name: vorschläge[1].to.name,
            },
            {
              id: v4(),
              name: vorschläge[2].to.name,
            },
          ],
        },
      };
    });
    setlastAutoSelectElem(undefined);
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={[14, 14]}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SearchInput stations={stations} handleEvent={onEvent} />
          <p style={{ margin: 20 }}>
            <strong>Update at : </strong>
            {updateDate}
          </p>
          <Button
            type="primary"
            style={{ margin: 20 }}
            disabled={isSending}
            onClick={sendRequest}
          >
            Get the Data
          </Button>
        </div>

        <DragDrop
          choose={choose}
          stateDND={stateDND}
          selected={selected}
          lastAutoSelectElem={lastAutoSelectElem}
          handleDragEnd={handleDragEnd}
          onclick={clickOnDrop}
          onDelete={handleDeleteOnDND}
        />
        <OnMap
          loading={loading}
          stations={stations}
          stateDND={stateDND}
          selected={selected}
          onAddBeforSelected={handleAddBeforSelected}
          onAddAfterSelected={handleAddAfterSelected}
          lastAutoSelectElem={lastAutoSelectElem}
          selectMarkerOnMap={clickOnMapMarker}
        />
        <Info
          selected={selected}
          distance={distance}
          lastAutoSelectElem={lastAutoSelectElem}
        />
      </Row>
    </div>
  );
};

export default Aufgabe;
