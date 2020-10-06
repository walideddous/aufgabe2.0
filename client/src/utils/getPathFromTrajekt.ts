// Get the table of table of coordination(lat,lon) => [[lat,lon],[lat,lon]....]
export const getPathFromTrajekt = (stopSequenceMarkers: any) => {
  return stopSequenceMarkers.map((el: any) => {
    return [el.coord.WGS84[0], el.coord.WGS84[1]];
  });
};
