import React, { Fragment, useMemo, useCallback, useRef } from "react";
import { Card, Col } from "antd";
import * as L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  CircleMarker,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

// Import leaflet context menu
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

//Import search Component
import SearchInput from "../search/SearchInput";

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

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
  modes: [string];
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

interface TpropsOnMap {
  stations: Tstations[];
  stateDND: TstateDND;
  selected: Tstations | undefined;
  distance: Tdistance[];
  currentStopSequence: any;
  handleSelectAutoSearch: (selectedStop: string) => void;
  onAddBeforSelected: (e: string) => void;
  onAddAfterSelected: (e: string) => void;
  onDeleteMarkerFromMap: (e: string) => void;
  selectMarkerOnMap: (el: Tstations, index: number) => void;
}

// Map component
const ReactLeaflet = ({
  stations,
  stateDND,
  selected,
  distance,
  currentStopSequence,
  handleSelectAutoSearch,
  onAddAfterSelected,
  onAddBeforSelected,
  onDeleteMarkerFromMap,
  selectMarkerOnMap,
}: TpropsOnMap) => {
  L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";
  const stationsRef = useRef(
    stations.map((el: any) => {
      return {
        ...el,
        coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
      };
    })
  );
  // Center the Map
  const position = useMemo(() => {
    return {
      lat: 46.8155135,
      lng: 8.224471999999992,
      zoom: 5,
    };
  }, []);
  // Zoom reactive
  const responsiveZoom = useMemo(() => {
    //@ts-ignore
    if (distance.length && distance[0].distance > 0.6) {
      return {
        zoom: 14,
      };
    } else {
      return {
        zoom: 15,
      };
    }
  }, [distance]);

  const clickOnMarker = useCallback(
    (el: any, index: number) => {
      selectMarkerOnMap(el, index);
    },
    [selectMarkerOnMap]
  );

  const addBeforSelected = useCallback(
    (e: any) => {
      onAddBeforSelected(e.relatedTarget._tooltip._content);
    },
    [onAddBeforSelected]
  );

  const addAfterSelected = useCallback(
    (e: any) => {
      onAddAfterSelected(e.relatedTarget._tooltip._content);
    },
    [onAddAfterSelected]
  );

  const deleteMarkerFromMap = useCallback(
    (e: any) => {
      onDeleteMarkerFromMap(e.relatedTarget._tooltip._content);
    },
    [onDeleteMarkerFromMap]
  );

  console.log("stations", stations);

  return (
    <Fragment>
      <Col xxl={12} xs={24}>
        <Card bordered={true} title="Map">
          <MapContainer
            style={{ height: "880px", zIndex: 0 }}
            center={
              selected
                ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
                : [position.lat, position.lng]
            }
            zoom={!selected ? position.zoom : responsiveZoom.zoom}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {stations &&
              stations.map((el: any, index: number) => (
                <Marker
                  //@ts-ignore
                  contextmenu={true}
                  contextmenuWidth="200"
                  contextmenuInheritItems={false}
                  contextmenuItems={[
                    { text: "Close" },
                    {
                      text: "Add before the highlighted stations",
                      callback: addBeforSelected,
                    },
                    {
                      text: "Add after the highlighted stations",
                      callback: addAfterSelected,
                    },
                    {
                      text: "Delete",
                      callback: deleteMarkerFromMap,
                    },
                  ]}
                  color={
                    selected && selected._id === el._id
                      ? "red"
                      : stateDND.vorschlag.items.length &&
                        stateDND.vorschlag.items
                          .map((el) => el._id)
                          .includes(el._id)
                      ? "green"
                      : "blue"
                  }
                  key={index}
                  position={[el.coord.WGS84.lat, el.coord.WGS84.lon]}
                  onClick={() => clickOnMarker(el, index)}
                >
                  <Tooltip>{el.name}</Tooltip>
                </Marker>
              ))}
          </MapContainer>
          <SearchInput
            stations={stations}
            handleSelectAutoSearch={handleSelectAutoSearch}
          />
        </Card>
      </Col>
    </Fragment>
  );
};

export default React.memo(ReactLeaflet);
