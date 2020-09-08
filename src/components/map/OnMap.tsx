import React, { Fragment } from "react";
import { Map, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Spin, Card, Col } from "antd";
import L from "leaflet";

// import the function to filter the table of the trajeckt and drw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

const OnMap = ({ loading, stations, stateDND, selected }: any) => {
  // Icon per default
  L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

  // Center the Map
  const position = {
    lat: 48.16517718624497,
    lng: 11.575250355866128,
    zoom: 11,
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
                selected
                  ? [selected.location.lat, selected.location.lng]
                  : [position.lat, position.lng]
              }
              zoom={selected ? 14 : position.zoom}
              style={{ height: "60vh" }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup disableClusteringAtZoom={20}>
                {stations &&
                  stations.map((el: any, i: any) => (
                    <CircleMarker
                      center={[el.location.lat, el.location.lng]}
                      key={el._id}
                      color={"blue"}
                      radius={20}
                    >
                      <Tooltip permanent>{el.Haltestelle}</Tooltip>
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
