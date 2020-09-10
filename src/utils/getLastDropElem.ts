// Import types
import { TstateDND, Tstations } from "../components/type/Types";

export function getLastDropElem(stations: Tstations[], stateDND: TstateDND) {
  let lastElem: any;
  if (stateDND.trajekt.items.length) {
    lastElem = stateDND.trajekt.items[stateDND.trajekt.items.length - 1];
  }
  const result = stations.filter((el) => el.Haltestelle === lastElem);
  return result;
}
