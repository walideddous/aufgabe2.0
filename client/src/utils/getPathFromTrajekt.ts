import { TstateDND, Tstations } from "../components/type/Types";

export const getPathFromTrajekt = (
  stateDND: TstateDND,
  stations: Tstations[]
) => {
  const getTrajekt = stateDND.trajekt.items.map((el: any) => el.name);
  let result = [];
  for (let i = 0; i < getTrajekt.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      if (getTrajekt[i] === stations[j].name) {
        result.push(stations[j]);
      }
    }
  }
  return result.map((el: any) => [el.coord.WGS84.lat, el.coord.WGS84.lon]);
};
