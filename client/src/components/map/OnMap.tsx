import React, { Fragment } from "react";
import { Map, TileLayer, CircleMarker, Tooltip, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Spin, Card, Col } from "antd";
import L from "leaflet";
import "leaflet-polylinedecorator";
// Import leaflet context menu
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

// Import type
import { Tloading, Tstations, TstateDND } from "../type/Types";

interface TpropsOnMap {
  loading: Tloading;
  stations: Tstations[];
  stateDND: TstateDND;
  selected: Tstations | undefined;
  lastAutoSelectElem: Tstations | undefined;
  onAddBeforSelected: (e: string) => void;
  onAddAfterSelected: (e: string) => void;
  selectMarkerOnMap: (el: Tstations, index: number) => void;
}

const OnMap = ({
  loading,
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
  const position = {
    lat: 46.8155135,
    lng: 8.224471999999992,
    zoom: 5,
  };

  const clickOnMarker = (el: any, index: number) => {
    selectMarkerOnMap(el, index);
  };

  const addBeforSelected = (e: any) => {
    onAddBeforSelected(e.relatedTarget._tooltip.options.children);
  };

  const addAfterSelected = (e: any) => {
    onAddAfterSelected(e.relatedTarget._tooltip.options.children);
  };

  return (
    <Fragment>
      <Col span={12}>
        <Card bordered={true} title="Map">
          {loading ? (
            <Spin
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "30px",
              }}
            />
          ) : (
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
              zoom={
                lastAutoSelectElem && !selected
                  ? 14
                  : selected && lastAutoSelectElem
                  ? 14
                  : selected && !lastAutoSelectElem
                  ? 14
                  : position.zoom
              }
              style={{ height: "60vh" }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup disableClusteringAtZoom={14}>
                {stations &&
                  stations.map((el: Tstations, index: number) => (
                    <CircleMarker
                      id="map"
                      contextmenu={true}
                      contextmenuWidth={200}
                      contextmenuInheritItems={false}
                      contextmenuItems={[
                        {
                          text: "Add before the selected Trajekt",
                          callback: addBeforSelected,
                        },
                        {
                          text: "Add after the selected Trajekt",
                          callback: addAfterSelected,
                        },
                      ]}
                      center={[el.coord.WGS84.lat, el.coord.WGS84.lon]}
                      key={el._id}
                      color={
                        (lastAutoSelectElem &&
                          !selected &&
                          lastAutoSelectElem.name === el.name) ||
                        (lastAutoSelectElem &&
                          selected &&
                          selected.name === el.name) ||
                        (selected &&
                          !lastAutoSelectElem &&
                          selected.name === el.name)
                          ? "red"
                          : stateDND.vorschlag.items.length &&
                            stateDND.vorschlag.items
                              .map((el) => el.name)
                              .includes(el.name)
                          ? "green"
                          : "blue"
                      }
                      radius={15}
                      onclick={() => clickOnMarker(el, index)}
                    >
                      <Tooltip>{el.name}</Tooltip>
                    </CircleMarker>
                  ))}
              </MarkerClusterGroup>
              <Polyline
                positions={getPathFromTrajekt(stateDND, stations)}
                color="red"
                arrowheads
              ></Polyline>
            </Map>
          )}
        </Card>
      </Col>
    </Fragment>
  );
};

export default OnMap;
