import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import { v4 } from 'uuid';

import { data } from './../data/data';

// Import composents
import OnMap from './map/OnMap';
import Info from './info/Info';
import SearchInput from './search/SearchInput';
import DND from './dnd/index';

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

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}

const Aufgabe = () => {
  const [stations, setStations] = useState<Tstations[]>([]);
  const [loading, setLoading] = useState<Tloading>(true);
  const [selected, setSelected] = useState();
  const [choose, setChoose] = useState('');
  const [state, setState] = useState({
    search: {
      title: 'Search',
      items: [],
    },
    traject: {
      title: 'Traject',
      items: [],
    },
  });

  const clickOnMap = (e: any) => {
    setSelected(e);
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
          console.error('Cannt fetch stations from backend ');
        }
      } catch (error) {
        console.error('error from trycatch');
      }
    };
    fetchDataFromBackend();
  }, []);

  const onEvent = (e: any) => {
    setChoose(e);
    setState((prev: any) => {
      return {
        ...prev,
        search: {
          title: 'Search',
          items: [
            {
              id: v4(),
              name: e,
            },
            ...prev.search.items,
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
      ...getProperty(state, source.droppableId).items[source.index],
    };
    setState((prev) => {
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
  console.log('stations', stations);
  console.log('state', state);

  return (
    <div className='site-card-wrapper'>
      <Row gutter={14}>
        <SearchInput stations={stations} handleEvent={(e: any) => onEvent(e)} />
        <DND
          choose={choose}
          state={state}
          handleDragEnd={(e: any) => handleDragEnd(e)}
        />
        <OnMap
          loading={loading}
          stations={stations}
          state={state}
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
