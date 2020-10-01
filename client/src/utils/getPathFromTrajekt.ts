import { TstateDND, Tstations } from "../components/type/Types";

// Get the table of table of coordination(lat,lon) => [[lat,lon],[lat,lon]....]
export const getPathFromTrajekt = (
  stateDND: TstateDND,
  stations: Tstations[]
) => {
  const getTrajekt = stateDND.trajekt.items.map((el: any) => el._id);
  let result = [];
  for (let i = 0; i < getTrajekt.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      if (getTrajekt[i] === stations[j]._id) {
        result.push(stations[j]);
      }
    }
  }
  return result.map((el: any) => [el.coord.WGS84.lat, el.coord.WGS84.lon]);
};
