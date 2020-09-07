import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { v4 } from "uuid";

import { data } from "./../data/data";

// Import composents
import OnMap from "./map/OnMap";
import Info from "./info/Info";
import SearchInput from "./search/SearchInput";
import DND from "./dnd/index";

// Get the property from Utils
import { getProperty } from "../utils/getPropertyKey";

// get the function to compare the distance between a point fix and a banch of punkt
import { calculateDistanceAndSort } from "../utils/getDistanceFromLatLonInKm";

interface Tstations {
  _id: string;
  Haltestelle: string;
  adresse: string;
  location: {
    lat: number;
    lng: number;
  };
  Umstiegmöglischkeiten: string;
  weitereInformationen: string;
}

type Tloading = boolean;

const Aufgabe = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [loading, setLoading] = useState<Tloading>(true);
  const [selected, setSelected] = useState<Tstations>();
  const [choose, setChoose] = useState("");
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

  const clickOnMap = (e: any) => {
    setSelected(e);
  };

  const clickOnDrop = (e: any) => {
    const response = stations.filter((el) => el.Haltestelle === e.name)[0];
    console.log(
      "calculated and sorted",
      calculateDistanceAndSort(response, stations)
    );
    setSelected(response);

    const vorschläge = calculateDistanceAndSort(response, stations);

    console.log("vorassshcläge", vorschläge[0].to.Haltestelle);

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

  const clickDuble = (e: any) => {
    setStateDND((prev: any) => {
      return {
        ...prev,
        trajekt: {
          title: "Trajekt",
          items: stateDND.trajekt.items.filter(
            (item: any) => item.name !== e.name
          ),
        },
      };
    });
  };

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

  console.log("Strecke", stateDND);

  return (
    <div className="site-card-wrapper">
      <Row gutter={14}>
        <SearchInput stations={stations} handleEvent={(e: any) => onEvent(e)} />
        <DND
          choose={choose}
          stateDND={stateDND}
          handleDragEnd={(e: any) => handleDragEnd(e)}
          Onclick={(e: any) => clickOnDrop(e)}
          OnDubleClick={(e: any) => clickDuble(e)}
        />
        <OnMap
          loading={loading}
          stations={stations}
          stateDND={stateDND}
          Onclick={(e: any) => clickOnMap(e)}
        />
        <Info selected={selected} />
      </Row>
    </div>
  );
};

export default Aufgabe;

/*
       <Col span={12}>
          <Card bordered={true} title='Search Component'>
            <SearchedList choose={choose} loading={loading} />
            <Col span={24}>
              <Card bordered={true}>
                Stationen, die weniger als 1 Kilometer entfernt sind
              </Card>
            </Col>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={true} title='Drop Component'>
            <Timeline>
              {stations &&
                stations.map((el, i) => (
                  <Timeline.Item key={i}>
                    <Button
                      type='default'
                      style={{ width: '30vh' }}
                      onClick={() => {
                        handleClick(el);
                      }}
                    >
                      {el.Haltestelle}
                    </Button>
                    <Tooltip title='delete'>
                      <Button
                        type='dashed'
                        shape='circle'
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Timeline.Item>
                ))}
            </Timeline>
          </Card>
        </Col>
*/
