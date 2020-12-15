export const formatPTStopItems = (PTStopItems: any) => {
  return PTStopItems.map((PTStopItem: any) => {
    return {
      _id: PTStopItem.data._id,
      name: PTStopItem.data.name,
      modes: PTStopItem.data.modes,
      coord: {
        WGS84: {
          lat: PTStopItem.geojson.geometry.coordinates[1],
          lon: PTStopItem.geojson.geometry.coordinates[0],
        },
      },
    };
  });
};



