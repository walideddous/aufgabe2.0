// Get the table of table of coordination(lat,lon) => [[lat,lon],[lat,lon]....]
export const getPathFromTrajekt = (RoadMarkers: any) => {
  return RoadMarkers.map((el: any) => {
    return [el.coord.WGS84[0], el.coord.WGS84[1]];
  });
};
