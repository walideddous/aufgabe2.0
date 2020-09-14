import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { v4 } from "uuid";

import { data } from "./../data/data";

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

const Aufgabe: React.FC = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [loading, setLoading] = useState<Tloading>(true);
  const [selected, setSelected] = useState<Tstations>();
  const [choose, setChoose] = useState<Tchoose>("");
  const [distance, setDistance] = useState<Tdistance[]>([]);
  const [stateDND, setStateDND] = useState<TstateDND>({
    vorschlag: {
      title: "Vorschlag",
      items: [],
    },
    trajekt: {
      title: "Trajekt",
      items: [],
    },
  });
  const [lastAutoSelectElem, setlastAutoSelectElem] = useState<Tstations>();

  // Fetch the data from the Backend and set the state "Stations"
  useEffect(() => {
    // Simulation a call from the Backend
    const fetchDataFromBackend = async () => {
      try {
        const response = await data();
        if (response) {
          setStations(response);
          setLoading(false);
        } else {
          console.error("Cannt fetch stations from backend ");
        }
      } catch (error) {
        console.error("error from trycatch");
      }
    };
    fetchDataFromBackend();
  }, []);

  // Update the state of stateDND when you drag and drop
  useEffect(() => {
    if (lastAutoSelectElem) {
      const vorschläge = calculateDistanceAndSort(lastAutoSelectElem, stations);
      setDistance(vorschläge);

      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Vorschlag",
            items: [
              {
                id: v4(),
                name: vorschläge[0].to.Haltestelle,
              },
              {
                id: v4(),
                name: vorschläge[1].to.Haltestelle,
              },
              {
                id: v4(),
                name: vorschläge[2].to.Haltestelle,
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
    const response = stations.filter((el) => el.Haltestelle === e.name)[0];
    setSelected({ ...response, index });

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        vorschlag: {
          title: "Vorschlag",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[1].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[2].to.Haltestelle,
            },
          ],
        },
      };
    });
  };

  // Delete the button from Drag and drop
  const handleDeleteOnDND = (
    e: { id: string | number; name: string },
    SourceOrTarget: string
  ) => {
    if (SourceOrTarget === "Trajekt") {
      if (
        e.name === lastAutoSelectElem?.Haltestelle &&
        stateDND.trajekt.items.length > 1
      ) {
        let newValue =
          stateDND.trajekt.items[stateDND.trajekt.items.length - 2];
        setlastAutoSelectElem(
          stations.filter((el) => el.Haltestelle === newValue.name)[0]
        );
      }
      if (stateDND.trajekt.items.length === 1) {
        setlastAutoSelectElem(undefined);
      }
      setStateDND((prev: any) => {
        return {
          ...prev,
          trajekt: {
            title: "Trajekt",
            items: stateDND.trajekt.items.filter(
              (item: any) => item.id !== e.id
            ),
          },
        };
      });
    }
    if (SourceOrTarget === "Vorschlag") {
      setStateDND((prev: any) => {
        return {
          ...prev,
          vorschlag: {
            title: "Vorschlag",
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
            title: "Vorschlag",
            items: [],
          },
        };
      });
    }
  };

  // to choose the station from the input options
  const onEvent = (e: string) => {
    const response = stations.filter((el) => el.Haltestelle === e)[0];
    setlastAutoSelectElem(response);
    setSelected(undefined);

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setChoose(e);
    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Trajekt",
          items: [
            ...prev.trajekt.items,
            {
              id: v4(),
              name: e,
            },
          ],
        },
        vorschlag: {
          title: "Vorschlag",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[1].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[2].to.Haltestelle,
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
        lastElem = stations.filter((el) => el.Haltestelle === lastElem.name)[0];
        setlastAutoSelectElem({ ...lastElem });
      }
    }
  };

  const handleAddAfterSelected = (e: string) => {
    const response = stations.filter((el) => el.Haltestelle === e)[0];
    setSelected(undefined);
    setlastAutoSelectElem(response);

    const vorschläge = calculateDistanceAndSort(response, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Trajekt",
          items: [
            ...prev.trajekt.items,
            {
              id: v4(),
              name: e,
            },
          ],
        },
        vorschlag: {
          title: "Vorschlag",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[1].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[2].to.Haltestelle,
            },
          ],
        },
      };
    });
  };

  const handleAddBeforSelected = (e: any) => {
    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Trajekt",
          items: [
            {
              id: v4(),
              name: e,
            },
            ...prev.trajekt.items,
          ],
        },
      };
    });
  };

  const clickOnMapMarker = (el: Tstations) => {
    setSelected(el);
    setlastAutoSelectElem(undefined);
    const vorschläge = calculateDistanceAndSort(el, stations);
    setDistance(vorschläge);

    setStateDND((prev: any) => {
      return {
        ...prev,
        vorschlag: {
          title: "Vorschlag",
          items: [
            {
              id: v4(),
              name: vorschläge[0].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[1].to.Haltestelle,
            },
            {
              id: v4(),
              name: vorschläge[2].to.Haltestelle,
            },
          ],
        },
      };
    });
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={[14, 14]}>
        <SearchInput stations={stations} handleEvent={onEvent} />
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
