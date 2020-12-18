import React, {
  Fragment,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import * as L from "leaflet";

import SearchInput from "../search/SearchInput";
// Import leaflet markerCluster
import "leaflet.markercluster";
import "./styles.min.css";

// Import leaflet context menu
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from "../../utils/getPathFromTrajekt";

// Typescript
import { Tstations, Tdistance, TstateDND } from "../../types/types";

interface TpropsOnMap {
  stations: Tstations[];
  stateDND: TstateDND;
  selected: Tstations | undefined;
  distance: Tdistance[];
  currentStopSequence: any;
  onSelectAutoSearch: (selectedStop: string) => void;
  onAddBeforSelected: (e: string) => void;
  onAddAfterSelected: (e: string) => void;
  onDeleteMarkerFromMap: (e: string) => void;
  onClickOnMapMarker: (el: Tstations, index: number) => void;
}

// Map component
const Map = ({
  stations,
  stateDND,
  selected,
  distance,
  currentStopSequence,
  onSelectAutoSearch,
  onAddBeforSelected,
  onAddAfterSelected,
  onDeleteMarkerFromMap,
  onClickOnMapMarker,
}: TpropsOnMap) => {
  const map: any = useRef(null);
  const layerRef: any = useRef(null);
  const polylineRef: any = useRef(null);

  const stationsRef = useRef(
    stations.map((el: any) => {
      return {
        ...el,
        coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
      };
    })
  );

  const stopSequenceMarkers = useMemo(() => {
    return stateDND.trajekt.items.map((el: any) => {
      return {
        ...el,
        coord: { WGS84: [el.coord.WGS84.lat, el.coord.WGS84.lon] },
      };
    });
  }, [stateDND]);

  // Center the Map
  const position = useMemo(() => {
    return {
      lat: 46.8155135,
      lng: 8.224471999999992,
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
    (el: any, index: number) => {
      onClickOnMapMarker(el, index);
    },
    [onClickOnMapMarker]
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
        ? [selected.coord.WGS84.lat, selected.coord.WGS84.lon]
        : [position.lat, position.lng],
      !selected ? position.zoom : responsiveZoom.zoom
    );
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
  }, []);

  // Update markers
  useEffect(() => {
    layerRef.current.clearLayers();

    const markers = L.markerClusterGroup();

    //@ts-ignore
    stationsRef.current.forEach((el: any, index: number) => {
      const marker = L.circleMarker(el.coord.WGS84, {
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
        color:
          selected && selected._id === el._id
            ? "red"
            : stateDND.suggestions.items.length &&
              stateDND.suggestions.items.map((el) => el._id).includes(el._id)
            ? "green"
            : "blue",
      }).addTo(markers);

      markers.addTo(layerRef.current);

      marker.bindTooltip(el.name);
      marker.on("click", () => clickOnMarker(el, index));
    });
  }, [
    stateDND,
    selected,
    currentStopSequence,
    stopSequenceMarkers,
    addAfterSelected,
    addBeforSelected,
    deleteMarkerFromMap,
    clickOnMarker,
  ]);

  // Update polyline
  useEffect(() => {
    polylineRef.current.clearLayers();
    L.polyline(getPathFromTrajekt(stopSequenceMarkers), {
      color: "red",
    }).addTo(polylineRef.current);
  }, [stopSequenceMarkers]);

  // Center the map when we load the stopSequence
  useEffect(() => {
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
      map.current.fitBounds(bounds);
    }
  }, [currentStopSequence, selected]);

  return (
    <Fragment>
      <div id="mapId" style={{ height: "60vh", zIndex: 0 }} />
      <SearchInput
        stations={stations}
        handleSelectAutoSearch={onSelectAutoSearch}
      />
    </Fragment>
  );
};

export default React.memo(Map);

/*
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
import { Tstations, Tdistance, TstateDND } from "../../types/types";
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
  const map: any = useRef(null);
  const stationsRef = useRef();

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
    document.getElementById("mapId").innerHTML =
      "<div id='map' style='width: 100%; height: 100%;'></div>";
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
            : stateDND.suggestions.items.length &&
              stateDND.suggestions.items.map((el) => el._id).includes(el._id)
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
            : stateDND.suggestions.items.length &&
              stateDND.suggestions.items.map((el) => el._id).includes(el._id)
            ? "green"
            : "blue",
      });

      marker.bindTooltip(el.name);
      marker.on("click", () => clickOnMarker(el, index));

      markers2.addLayer(marker);
    });

    L.layerGroup([markers, markers2]).addLayer(Polyline).addTo(myMap);

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
*/
