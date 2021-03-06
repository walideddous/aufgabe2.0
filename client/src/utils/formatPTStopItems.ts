export const formatPTStopItems = (PTStopItems: any) => {
  return PTStopItems.map((PTStopItem: any) => {
    return {
      _id: PTStopItem.data._id,
      name: PTStopItem.data.name,
      modes: PTStopItem.data.modes,
      key: PTStopItem.data.key,
      coord: [
        PTStopItem.geojson.geometry.coordinates[1],
        PTStopItem.geojson.geometry.coordinates[0],
      ],
    };
  });
};
