import React, {
  Fragment,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import * as L from "leaflet";
import { DeleteOutlined } from "@ant-design/icons";

import SearchInput from "../search/SearchInput";
// Import leaflet markerCluster
import "leaflet.markercluster";
import "./styles.min.css";

// Import leaflet contextmenu
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

// Typescript
import {
  Tstations,
  Tdistance,
  TstateDND,
  TStopSequence,
} from "../../types/types";

interface TpropsOnMap {
  stations: Tstations[];
  stateDND: TstateDND;
  selected: Tstations | undefined;
  distance: Tdistance[];
  currentStopSequence: TStopSequence | undefined;
  onResetStopSequence: () => void;
  onSelectAutoSearch: (stop: Tstations) => void;
  onAddBeforSelected: (stopMarker: any) => void;
  onAddAfterSelected: (stopMarker: any) => void;
  onDeleteMarkerFromMap: (stopMarker: any) => void;
  onClickOnMapMarker: (el: Tstations, index: number) => void;
}

// Map component
const Map = ({
  stations,
  stateDND,
  selected,
  distance,
  currentStopSequence,
  onResetStopSequence,
  onSelectAutoSearch,
  onAddBeforSelected,
  onAddAfterSelected,
  onDeleteMarkerFromMap,
  onClickOnMapMarker,
}: TpropsOnMap) => {
  const map: any = useRef(null);
  const layerRef: any = useRef(null);
  const polylineRef: any = useRef(null);

  // Center the Map
  const position = useMemo(() => {
    return {
      lat: 46.8007,
      lng: 8.2227,
      zoom: 9,
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
    (stationMarker: Tstations, index: number) => {
      onClickOnMapMarker(stationMarker, index);
    },
    [onClickOnMapMarker]
  );

  const addBeforSelected = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      onAddBeforSelected(marker);
    },
    [onAddBeforSelected]
  );

  const addAfterSelected = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      onAddAfterSelected(marker);
    },
    [onAddAfterSelected]
  );

  const deleteMarkerFromMap = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      onDeleteMarkerFromMap(marker);
    },
    [onDeleteMarkerFromMap]
  );

  // Displaying the map
  useEffect(() => {
    map.current = L.map("mapId", {
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }),
      ],
    });
  }, []);

  // Setting dynamic zoom
  useEffect(() => {
    map.current.setView(
      selected
        ? [selected.coord[0], selected.coord[1]]
        : [position.lat, position.lng],
      !selected ? position.zoom : responsiveZoom.zoom
    );
    // set the min zoom
    map.current.options.minZoom = 8;
  }, [
    selected,
    position.lat,
    position.lng,
    position.zoom,
    responsiveZoom.zoom,
  ]);

  // Add layers
  useEffect(() => {
    layerRef.current = L.layerGroup().addTo(map.current);
    polylineRef.current = L.layerGroup().addTo(map.current);

    map.current.on("zoomend", function () {
      if (map.current.getZoom() < 9 && map.current.hasLayer(layerRef.current)) {
        map.current.removeLayer(layerRef.current);
      }
      if (
        map.current.getZoom() >= 9 &&
        map.current.hasLayer(layerRef.current) === false
      ) {
        map.current.addLayer(layerRef.current);
      }
    });
  }, []);

  // Update markers
  useEffect(() => {
    layerRef.current.clearLayers();

    const markers = L.markerClusterGroup({
      disableClusteringAtZoom: 14,
      chunkedLoading: true,
    });

    //@ts-ignore
    stations.forEach((stationMarker: any, index: number) => {
      const marker = L.circleMarker(stationMarker.coord, {
        //@ts-ignore
        contextmenu: true,
        contextmenuWidth: "200",
        contextmenuInheritItems: false,
        contextmenuItems: [
          { index: 0, text: "Close" },
          {
            index: 1,
            separator: true,
          },
          {
            index: 2,
            text: "Add before the highlighted stations",
            callback: addBeforSelected,
          },
          {
            index: 3,
            text: "Add after the highlighted stations",
            callback: addAfterSelected,
          },
          {
            index: 4,
            text: "Delete",
            callback: deleteMarkerFromMap,
          },
        ],
        id: "Marker",
        marker: stationMarker,
        color:
          selected && selected._id === stationMarker._id
            ? "red"
            : stateDND.suggestions.items.length &&
              stateDND.suggestions.items
                .map((el) => el._id)
                .includes(stationMarker._id)
            ? "green"
            : "blue",
      }).addTo(markers);

      markers.addTo(layerRef.current);

      marker.bindTooltip(stationMarker.name);
      marker.on("click", () => clickOnMarker(stationMarker, index));
    });
  }, [
    stations,
    stateDND,
    selected,
    currentStopSequence,
    addAfterSelected,
    addBeforSelected,
    deleteMarkerFromMap,
    clickOnMarker,
  ]);

  // Update polyline
  useEffect(() => {
    polylineRef.current.clearLayers();
    if (stateDND.trajekt.items.length) {
      const { items } = stateDND.trajekt;
      L.polyline(getPathFromTrajekt(items), {
        color: "red",
      }).addTo(polylineRef.current);
    }
  }, [stateDND]);

  // Center the map when we load the stopSequence
  useEffect(() => {
    if (currentStopSequence && !selected) {
      const { stopSequence } = currentStopSequence;
      var corner1 = L.latLng(
          stopSequence[0].coord[0],
          stopSequence[0].coord[1]
        ),
        corner2 = L.latLng(
          stopSequence[stopSequence.length - 1].coord[0],
          stopSequence[stopSequence.length - 1].coord[1]
        ),
        bounds = L.latLngBounds(corner1, corner2);
      map.current.fitBounds(bounds);
    }
  }, [currentStopSequence, selected]);

  return (
    <Fragment>
      <div id="mapId" style={{ height: "60vh", zIndex: 2 }} />
      <SearchInput
        stations={stations}
        handleSelectAutoSearch={onSelectAutoSearch}
      />
      {stateDND.trajekt.items.length ? (
        <div
          className="trash_button"
          onClick={() =>
            stateDND.trajekt.items.length ? onResetStopSequence() : null
          }
        >
          <DeleteOutlined style={{ paddingLeft: "8px" }} />
        </div>
      ) : null}
    </Fragment>
  );
};

export default React.memo(Map);
