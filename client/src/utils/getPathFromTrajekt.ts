// (lat,lon) => return  [[lat,lon],[lat,lon]....]
export const getPathFromTrajekt = (stopSequenceMarkers: any) => {
  return stopSequenceMarkers.map((el: any) => {
    return [el.coord[0], el.coord[1]];
  });
};
