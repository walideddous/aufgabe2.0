import React, { Fragment, useEffect, useCallback, useMemo } from "react";
import {
  Map,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polyline,
  GeoJSON,
  useLeaflet,
} from "react-leaflet";
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

function DirectionsRoute(props: any) {
  const ctx = useLeaflet();
  const { coords } = props;
  const { map } = ctx;

  function handleEachFeature(feature: any, layer: any) {
    //@ts-ignore
    L.polylineDecorator(layer, {
      patterns: [
        {
          offset: "10%",
          repeat: "20%",
          //@ts-ignore
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            pathOptions: { fillOpacity: 1, weight: 0 },
          }),
        },
      ],
    }).addTo(map);
  }

  return <GeoJSON data={coords} onEachFeature={handleEachFeature} />;
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
  const mapRef = React.useRef();

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
              stateDND.vorschlag.items.map((el) => el.name).includes(el.name)
            ? "green"
            : "blue"
        }
        radius={15}
        onclick={() => clickOnMarker(el, index)}
      >
        <Tooltip>{el.name}</Tooltip>
      </CircleMarker>
    ));
  }, [stations]);

  useEffect(() => {
    //@ts-ignore
    console.log("mapRef", mapRef?.current);
  }, [mapRef]);

  setTimeout(() => {
    //@ts-ignore
    console.log("mapRef", mapRef?.current);
  }, 6000);

  const onViewportChanged = (viewport: any) => {
    // The viewport got changed by the user, keep track in state
    console.log("viewport", viewport);
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
              //@ts-ignore
              ref={mapRef}
              preferCanvas={true}
              onViewportChanged={onViewportChanged}
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
              zoom={!lastAutoSelectElem && !selected ? position.zoom : 14}
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
                  positions={getPathFromTrajekt(stateDND, stations)}
                  color="red"
                ></Polyline>
              )}
              <DirectionsRoute
                coords={getPathFromTrajekt(stateDND, stations)}
              />
            </Map>
          )}
        </Card>
      </Col>
    </Fragment>
  );
};

export default React.memo(OnMap);

/*
          (lastAutoSelectElem &&
            !selected &&
            lastAutoSelectElem.name === el.name) ||
          (lastAutoSelectElem && selected && selected.name === el.name) ||
          (selected && !lastAutoSelectElem && selected.name === el.name)
            ? "red"
            : stateDND.vorschlag.items.length &&
              stateDND.vorschlag.items.map((el) => el.name).includes(el.name)
            ? "green"
            :

*/
