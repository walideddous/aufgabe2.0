import React, {
  Fragment,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as L from 'leaflet';
import { DeleteOutlined } from '@ant-design/icons';

import SearchStopsInput from '../searchStops/SearchStopsInput';
// Import leaflet markerCluster
import 'leaflet.markercluster';
import './styles.min.css';

// Import leaflet contextmenu
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

// import the function to filter the table of the trajeckt and draw the linie on map
import { getPathFromTrajekt } from '../../utils/getPathFromTrajekt';

// Typescript
import {
  Tstops,
  Tdistance,
  TstopSequence,
  TManagedRoute,
} from '../../types/types';

interface TpropsOnMap {
  stops: Tstops[];
  stopSequence: TstopSequence;
  selectedStop: Tstops | undefined;
  distance: Tdistance[];
  currentManagedRoute: TManagedRoute | undefined;
  onDeleteStop: (stopMarker: Tstops, index: number) => void;
  onAddAfterSelectedStop: (stopMarker: Tstops) => void;
  onSelectAutoSearch: (stop: Tstops) => void;
  onClickOnMapMarker: (el: Tstops, index: number) => void;
  onAddBeforSelectedStop: (stopMarker: Tstops) => void;
  onResetManagedRoute: () => void;
}

// Map component
const Map = ({
  stops,
  stopSequence,
  selectedStop,
  distance,
  currentManagedRoute,
  onResetManagedRoute,
  onSelectAutoSearch,
  onAddBeforSelectedStop,
  onAddAfterSelectedStop,
  onDeleteStop,
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
    (stationMarker: Tstops, index: number) => {
      onClickOnMapMarker(stationMarker, index);
    },
    [onClickOnMapMarker]
  );

  const addBeforselectedStop = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      onAddBeforSelectedStop(marker);
    },
    [onAddBeforSelectedStop]
  );

  const addAfterselectedStop = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      if (
        selectedStop &&
        stopSequence.trajekt.items.filter(
          (item: any) => item._id === selectedStop._id
        ).length &&
        stopSequence.trajekt.items.filter(
          (item: any) => item._id === marker._id
        ).length === 0
      ) {
        onAddAfterSelectedStop(marker);
      }
    },
    [selectedStop, stopSequence.trajekt.items, onAddAfterSelectedStop]
  );

  const deleteMarkerFromMap = useCallback(
    (value: any) => {
      const { marker } = value.relatedTarget.options;
      const index = stopSequence.trajekt.items
        .map((item) => item._id)
        .indexOf(marker._id);
      onDeleteStop(marker, index);
    },
    [onDeleteStop, stopSequence.trajekt.items]
  );

  // Displaying the map
  useEffect(() => {
    map.current = L.map('mapId', {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
      selectedStop
        ? [selectedStop.coord[0], selectedStop.coord[1]]
        : [position.lat, position.lng],
      !selectedStop ? position.zoom : responsiveZoom.zoom
    );
    // set the min zoom
    map.current.options.minZoom = 8;
  }, [
    selectedStop,
    position.lat,
    position.lng,
    position.zoom,
    responsiveZoom.zoom,
  ]);

  // Add layers
  useEffect(() => {
    layerRef.current = L.layerGroup().addTo(map.current);
    polylineRef.current = L.layerGroup().addTo(map.current);

    map.current.on('zoomend', function () {
      if (map.current.getZoom() < 9 && map.current.hasLayer(layerRef.current)) {
        map.current.removeLayer(layerRef.current);
        map.current.removeLayer(polylineRef.current);
      }
      if (
        map.current.getZoom() >= 9 &&
        map.current.hasLayer(layerRef.current) === false &&
        map.current.hasLayer(polylineRef.current) === false
      ) {
        map.current.addLayer(layerRef.current);
        map.current.addLayer(polylineRef.current);
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
    stops.forEach((stationMarker: Tstops, index: number) => {
      //@ts-ignore
      const marker = L.circleMarker(stationMarker.coord, {
        //@ts-ignore
        contextmenu: true,
        contextmenuWidth: '200',
        contextmenuInheritItems: false,
        contextmenuItems: [
          { index: 0, text: 'Schließen' },
          {
            index: 1,
            separator: true,
          },
          {
            index: 2,
            text: 'Hinzufügen vor dem markierten Haltestellen',
            callback: addBeforselectedStop,
          },
          {
            index: 3,
            text: 'Hinzufügen nach dem markierten Haltestellen',
            callback: addAfterselectedStop,
          },
          {
            index: 4,
            text: 'Löschen',
            callback: deleteMarkerFromMap,
          },
        ],
        id: 'Marker',
        marker: stationMarker,
        index: index,
        color:
          selectedStop && selectedStop._id === stationMarker._id
            ? 'red'
            : stopSequence.suggestions.items.length &&
              stopSequence.suggestions.items
                .map((el) => el._id)
                .includes(stationMarker._id)
            ? 'green'
            : 'blue',
      }).addTo(markers);

      markers.addTo(layerRef.current);

      marker.bindTooltip(stationMarker.name);
      marker.on('click', () => clickOnMarker(stationMarker, index));
    });
  }, [
    stops,
    stopSequence,
    selectedStop,
    currentManagedRoute,
    addAfterselectedStop,
    addBeforselectedStop,
    deleteMarkerFromMap,
    clickOnMarker,
  ]);

  // Update polyline
  useEffect(() => {
    polylineRef.current.clearLayers();
    if (stopSequence.trajekt.items.length) {
      const { items } = stopSequence.trajekt;
      L.polyline(getPathFromTrajekt(items), {
        color: 'red',
      }).addTo(polylineRef.current);
    }
  }, [stopSequence]);

  // Center the map when we load the stopSequence
  useEffect(() => {
    if (currentManagedRoute && !selectedStop) {
      const { stopSequence } = currentManagedRoute;
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
  }, [currentManagedRoute, selectedStop]);

  return (
    <Fragment>
      <div id='mapId' style={{ height: '450px', zIndex: 2, width: '99%' }} />
      <SearchStopsInput
        stops={stops}
        handleSelectAutoSearch={onSelectAutoSearch}
      />
      {stopSequence.trajekt.items.length ? (
        <div
          className='trash_button'
          onClick={() => {
            if (stopSequence.trajekt.items.length) {
              onResetManagedRoute();
              map.current.setView([position.lat, position.lng], position.zoom);
            }
          }}
        >
          <DeleteOutlined style={{ paddingLeft: '8px', paddingTop: '8px' }} />
        </div>
      ) : null}
    </Fragment>
  );
};

export default React.memo(Map);
