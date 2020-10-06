import React, { Fragment, useCallback, useMemo } from "react";
import { Map, TileLayer, CircleMarker, Tooltip, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Card, Col } from "antd";
import L from "leaflet";
// Import leaflet context menu
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

// Import type
import { Tstations, TstateDND } from "../type/Types";

interface TpropsOnMap {
  stations: Tstations[];
  stateDND: TstateDND;
  selected: Tstations | undefined;
  lastAutoSelectElem: Tstations | undefined;
  onAddBeforSelected: (e: string) => void;
  onAddAfterSelected: (e: string) => void;
  selectMarkerOnMap: (el: Tstations, index: number) => void;
}

const OnMap = ({
  stations,
  stateDND,
  selected,
  lastAutoSelectElem,
  onAddAfterSelected,
  onAddBeforSelected,
  selectMarkerOnMap,
}: TpropsOnMap) => {
  // Icon per default
  L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";
  // Center the Map
  const position = useMemo(() => {
    return {
      lat: 46.8155135,
      lng: 8.224471999999992,
      zoom: 5,
    };
  }, []);

  const clickOnMarker = useCallback(
    (el: any, index: number) => {
      selectMarkerOnMap(el, index);
    },
    [selectMarkerOnMap]
  );

  const addBeforSelected = useCallback(
    (e: any) => {
      onAddBeforSelected(e.relatedTarget._tooltip.options.children);
    },
    [onAddBeforSelected]
  );

  const addAfterSelected = useCallback(
    (e: any) => {
      onAddAfterSelected(e.relatedTarget._tooltip.options.children);
    },
    [onAddAfterSelected]
  );

  const allMarkers = useMemo(() => {
    return stations.map((el: Tstations, index: number) => (
      <CircleMarker
        id="map"
        contextmenu={true}
        disabled={true}
        contextmenuWidth={200}
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
        ]}
        center={[el.coord.WGS84.lat, el.coord.WGS84.lon]}
        key={el._id}
        color={
          (lastAutoSelectElem &&
            !selected &&
            lastAutoSelectElem.name === el.name) ||
          (lastAutoSelectElem && selected && selected.name === el.name) ||
          (selected && !lastAutoSelectElem && selected.name === el.name)
            ? "red"
            : stateDND.vorschlag.items.length &&
              stateDND.vorschlag.items
                .map((el) => el.name.toLowerCase())
                .includes(el.name.toLowerCase())
            ? "green"
            : "blue"
        }
        radius={15}
        onclick={() => clickOnMarker(el, index)}
      >
        <Tooltip>{el.name}</Tooltip>
      </CircleMarker>
    ));
  }, [stations, lastAutoSelectElem, selected, stateDND.vorschlag.items]);

  return (
    <Fragment>
      <Col span={12}>
        <Card bordered={true} title="Map">
          {
            <Map
              center={
                lastAutoSelectElem && !selected
                  ? [
                      lastAutoSelectElem.coord.WGS84.lat,
                      lastAutoSelectElem.coord.WGS84.lon,
                    ]
                  : selected && lastAutoSelectElem
                  ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
                  : selected && !lastAutoSelectElem
                  ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
                  : [position.lat, position.lng]
              }
              zoom={!lastAutoSelectElem && !selected ? position.zoom : 17}
              style={{ height: "60vh" }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup disableClusteringAtZoom={20}>
                {allMarkers}
              </MarkerClusterGroup>
              {stateDND.trajekt.items.length && (
                <Polyline
                  positions={getPathFromTrajekt(stateDND)}
                  color="red"
                ></Polyline>
              )}
            </Map>
          }
        </Card>
      </Col>
    </Fragment>
  );
};

export default React.memo(OnMap);
