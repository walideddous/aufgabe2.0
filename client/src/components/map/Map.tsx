import React, {
  Fragment,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Card, Col } from "antd";
import * as L from "leaflet";

// Import leaflet markerCluster
import "leaflet.markercluster";
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
const Map = ({
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
  const stationsRef = useRef();

  console.log("stations", stations);
  console.log("stateDND", stateDND);
  console.log("selected", selected);
  console.log("distance", distance);
  console.log("currentStopSequence", currentStopSequence);

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

  // Showing the map
  useEffect(() => {
    //@ts-ignore
    stationsRef.current = stations;
    if (stationsRef.current) {
      //@ts-ignore
      stationsRef.current = stationsRef.current
        .filter(
          (el: any) =>
            !stateDND.trajekt.items.map((el: any) => el._id).includes(el._id)
        )
        .map((el: any) => {
          return {
            ...el,
            coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
          };
        });
    }
    const stopSequenceMarkers = stateDND.trajekt.items.map((el: any) => {
      return {
        ...el,
        coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
      };
    });
    //@ts-ignore
    document.getElementById("mapId").innerHTML =
      "<div id='map' style='width: 100%; height: 100%;'></div>";
    const myMap = L.map("map").setView(
      selected
        ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
        : [position.lat, position.lng],
      !selected ? position.zoom : responsiveZoom.zoom
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(myMap);

    var markers = new L.MarkerClusterGroup();
    //@ts-ignore
    stationsRef.current.forEach((el: any, index: number) => {
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
          {
            text: "Delete",
            callback: deleteMarkerFromMap,
          },
        ],
        color:
          selected && selected._id === el._id
            ? "red"
            : stateDND.vorschlag.items.length &&
              stateDND.vorschlag.items.map((el) => el._id).includes(el._id)
            ? "green"
            : "blue",
      });

      marker.bindTooltip(el.name);
      marker.on("click", () => clickOnMarker(el, index));

      markers.addLayer(marker);
    });

    const Polyline = L.polyline(getPathFromTrajekt(stopSequenceMarkers), {
      color: "red",
    }).addTo(myMap);

    var markers2 = new L.MarkerClusterGroup();
    stopSequenceMarkers.forEach((el: any, index: number) => {
      const marker = L.circleMarker(el.coord.WGS84, {
        //@ts-ignore
        contextmenu: true,
        contextmenuWidth: "200",
        contextmenuInheritItems: false,
        contextmenuItems: [
          { text: "Close" },
          {
            text: "Add before the highlighted stop",
            callback: addBeforSelected,
          },
          {
            text: "Add after the highlighted stop",
            callback: addAfterSelected,
          },
          {
            text: "Delete",
            callback: deleteMarkerFromMap,
          },
        ],
        color:
          selected && selected._id === el._id
            ? "red"
            : stateDND.vorschlag.items.length &&
              stateDND.vorschlag.items.map((el) => el._id).includes(el._id)
            ? "green"
            : "blue",
      });

      marker.bindTooltip(el.name);
      marker.on("click", () => clickOnMarker(el, index));

      markers2.addLayer(marker);
    });

    L.layerGroup([markers, markers2]).addLayer(Polyline).addTo(myMap);

    L.control
      .layers(undefined, {
        "Show all markers": markers,
      })
      .addTo(myMap);

    if (Object.keys(currentStopSequence).length && !selected) {
      const { stopSequence } = currentStopSequence;
      var corner1 = L.latLng(
          stopSequence[0].coord.WGS84.lat,
          stopSequence[0].coord.WGS84.lon
        ),
        corner2 = L.latLng(
          stopSequence[stopSequence.length - 1].coord.WGS84.lat,
          stopSequence[stopSequence.length - 1].coord.WGS84.lon
        ),
        bounds = L.latLngBounds(corner1, corner2);
      myMap.fitBounds(bounds);
    }
  }, [
    stations,
    selected,
    stateDND,
    currentStopSequence,
    position.lat,
    position.lng,
    position.zoom,
    responsiveZoom.zoom,
    addAfterSelected,
    addBeforSelected,
    deleteMarkerFromMap,
    clickOnMarker,
  ]);

  return (
    <Fragment>
      <Col xxl={12} xs={24}>
        <Card bordered={true} title="Map">
          <div id="mapId" style={{ height: "880px", zIndex: 0 }}></div>
          <SearchInput
            stations={stations}
            handleSelectAutoSearch={handleSelectAutoSearch}
          />
        </Card>
      </Col>
    </Fragment>
  );
};

export default React.memo(Map);

/*
  // Display the markers
  useEffect(() => {
    //@ts-ignore
    stationsRef.current = stations;
    if (stationsRef.current) {
      //@ts-ignore
      stationsRef.current = stations.map((el: any) => {
        return {
          ...el,
          coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
        };
      });
    }

    // Display the markers on map
    var markers = new L.MarkerClusterGroup();
    //@ts-ignore
    stationsRef.current.forEach((el: any, index: number) => {
      const marker = L.circleMarker(el.coord.WGS84, {
        //@ts-ignore
        contextmenu: true,
        disabled: true,
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
          {
            text: "Delete",
            callback: deleteMarkerFromMap,
          },
        ],
        color:
          selected && selected._id === el._id
            ? "red"
            : stateDND.vorschlag.items.length &&
              stateDND.vorschlag.items.map((el) => el._id).includes(el._id)
            ? "green"
            : "blue",
      });

      marker.bindTooltip(el.name);
      marker.on("click", () => clickOnMarker(el, index));

      markers.addLayer(marker);
    });
    L.layerGroup([markers]).addTo(myMap.current);

    // to center the map when we load the stopSequence Path
    if (Object.keys(currentStopSequenceName).length && !selected) {
      const { stopSequence } = currentStopSequenceName;
      var corner1 = L.latLng(
          stopSequence[0].coord.WGS84.lat,
          stopSequence[0].coord.WGS84.lon
        ),
        corner2 = L.latLng(
          stopSequence[stopSequence.length - 1].coord.WGS84.lat,
          stopSequence[stopSequence.length - 1].coord.WGS84.lon
        ),
        bounds = L.latLngBounds(corner1, corner2);
      myMap.current.fitBounds(bounds);
    }

    // Center and zoom the map on markers
    myMap.current.setView(
      selected
        ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
        : [position.lat, position.lng],
      !selected ? position.zoom : responsiveZoom.zoom
    );
  }, [
    stations,
    selected,
    stateDND,
    currentStopSequenceName,
    position.lat,
    position.lng,
    position.zoom,
    responsiveZoom.zoom,
    addAfterSelected,
    addBeforSelected,
    deleteMarkerFromMap,
    clickOnMarker,
  ]);
  */
