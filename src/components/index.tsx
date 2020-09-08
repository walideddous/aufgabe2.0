import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { v4 } from "uuid";

import { data } from "./../data/data";

// Import composents
import OnMap from "./map/OnMap";
import Info from "./info/Info";
import SearchInput from "./search/SearchInput";
import DND from "./dnd/index";

// Import the types of the state
import { Tstations, Tloading, Tchoose, Tdistance } from "./type/Types";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

const Aufgabe = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [loading, setLoading] = useState<Tloading>(true);
  const [selected, setSelected] = useState<Tstations>();
  const [choose, setChoose] = useState<Tchoose>("");
  const [distance, setDistance] = useState<Tdistance[]>([]);
  const [stateDND, setStateDND] = useState({
    vorschlag: {
      title: "Vorschlag",
      items: [],
    },
    trajekt: {
      title: "Trajekt",
      items: [],
    },
  });

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

  const clickOnDrop = (e: any) => {
    const response = stations.filter((el) => el.Haltestelle === e.name)[0];
    setSelected(response);

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

  const handleDeleteOnDND = (e: any) => {
    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Trajekt",
          items: stateDND.trajekt.items.filter(
            (item: any) => item.name !== e.name
          ),
        },
        vorschlag: {
          title: "Trajekt",
          items: stateDND.vorschlag.items.filter(
            (item: any) => item.name !== e.name
          ),
        },
      };
    });
  };

  const onEvent = (e: any) => {
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
      };
    });
  };

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
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={[14, 14]}>
        <SearchInput stations={stations} handleEvent={(e: any) => onEvent(e)} />
        <DND
          choose={choose}
          stateDND={stateDND}
          handleDragEnd={(e: any) => handleDragEnd(e)}
          Onclick={(e: any) => clickOnDrop(e)}
          onDelete={(e: any) => handleDeleteOnDND(e)}
        />
        <OnMap
          loading={loading}
          stations={stations}
          stateDND={stateDND}
          selected={selected}
        />
        <Info selected={selected} distance={distance} />
      </Row>
    </div>
  );
};

export default Aufgabe;
