import React, { Fragment } from "react";
import { Map, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Spin, Card, Col } from "antd";
import L from "leaflet";

// Import
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
  selectMarkerOnMap: (el: Tstations) => void;
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
    lat: 48.16517718624497,
    lng: 11.575250355866128,
    zoom: 11,
  };

  const clickOnMarker = (el: any) => {
    selectMarkerOnMap(el);
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
                lastAutoSelectElem
                  ? [
                      lastAutoSelectElem.location.lat,
                      lastAutoSelectElem.location.lng,
                    ]
                  : [position.lat, position.lng]
              }
              zoom={lastAutoSelectElem ? 14 : position.zoom}
              style={{ height: "60vh" }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup disableClusteringAtZoom={20}>
                {stations &&
                  stations.map((el: Tstations, i: number) => (
                    <CircleMarker
                      id="map"
                      contextmenu={true}
                      contextmenuWidth={200}
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
                      center={[el.location.lat, el.location.lng]}
                      key={el._id}
                      color={
                        stateDND.trajekt.items.length &&
                        stateDND.trajekt.items[
                          stateDND.trajekt.items.length - 1
                        ].name === el.Haltestelle
                          ? "red"
                          : stateDND.vorschlag.items.length &&
                            stateDND.vorschlag.items
                              .map((el) => el.name)
                              .includes(el.Haltestelle)
                          ? "green"
                          : "blue"
                      }
                      radius={15}
                      onclick={() => clickOnMarker(el)}
                    >
                      <Tooltip>{el.Haltestelle}</Tooltip>
                    </CircleMarker>
                  ))}
              </MarkerClusterGroup>
              <Polyline
                positions={getPathFromTrajekt(stateDND, stations)}
                color="red"
              ></Polyline>
            </Map>
          )}
        </Card>
      </Col>
    </Fragment>
  );
};

export default OnMap;
