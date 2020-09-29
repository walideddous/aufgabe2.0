import React, { Fragment, useMemo, useEffect, useCallback } from "react";
import { Card, Col } from "antd";
import * as L from "leaflet";

// Import leaflet markerCluster
import "leaflet.markercluster";
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

const NewMap = ({
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

  // Showing the map
  useEffect(() => {
    const MarkerPositions = stations.map((el: any) => {
      return {
        ...el,
        coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
      };
    });
    //@ts-ignore
    document.getElementById("mapId").innerHTML =
      "<div id='map' style='width: 100%; height: 100%;'></div>";
    const myMap = L.map("map").setView(
      lastAutoSelectElem && !selected
        ? [
            lastAutoSelectElem.coord.WGS84.lat,
            lastAutoSelectElem.coord.WGS84.lon,
          ]
        : selected && lastAutoSelectElem
        ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
        : selected && !lastAutoSelectElem
        ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
        : [position.lat, position.lng],
      !lastAutoSelectElem && !selected ? position.zoom : 17
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(myMap);

    var markers = new L.MarkerClusterGroup();
    MarkerPositions.forEach((el: any) => {
      const marker = L.circleMarker(el.coord.WGS84, {
        //@ts-ignore
        contextmenu: true,
        contextmenuWidth: "200",
        contextmenuInheritItems: false,
        contextmenuItems: [
          { text: "Close" },
          {
            text: "Add before the highlighted stations",
            callback: addBeforSelected,
          },
          {
            text: "Add after the highlighted stations",
            callback: addAfterSelected,
          },
        ],
        color:
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
            : "blue",
      });
      marker.bindTooltip(el.name);

      markers.addLayer(marker);
    });
    myMap.addLayer(markers);

    var polyline = L.polyline(getPathFromTrajekt(stateDND, stations), {
      color: "red",
    }).addTo(myMap);
  }, [stations, selected, lastAutoSelectElem, stateDND]);

  return (
    <Fragment>
      <Col span={12}>
        <Card bordered={true} title="Map">
          <div id="mapId" style={{ height: "60vh" }}></div>
        </Card>
      </Col>
    </Fragment>
  );
};

export default React.memo(NewMap);
