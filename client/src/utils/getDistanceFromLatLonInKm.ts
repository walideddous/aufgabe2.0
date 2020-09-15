// Import type
import { Tstations } from "../components/type/Types";

function getpreciseDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Calculate the distance from a fixed punkt to every punkt of the table
export function calculateDistanceAndSort(
  objClicked: any,
  tabData: Tstations[]
) {
  const result = [];
  const { location } = objClicked;

  const filteredTable = tabData.filter(
    (el: any) => el.Haltestelle !== objClicked.Haltestelle
  );

  for (let i = 0; i < filteredTable.length; i++) {
    // get the lat and lng from the table
    const lat1 = filteredTable[i].location.lat;
    const lng1 = filteredTable[i].location.lng;

    // calculate the distance betyeen a fix point and and others points
    let distance = getpreciseDistanceFromLatLonInKm(
      location.lat,
      location.lng,
      lat1,
      lng1
    );
    result.push({
      from: objClicked.Haltestelle,
      to: filteredTable[i],
      distance,
    });
  }

  // Sort the table By distance
  const sortedTable = result.sort(
    (a: { distance: number }, b: { distance: number }) => {
      return a.distance - b.distance;
    }
  );

  return sortedTable;
}

/*
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var lat = Math.pow(lat2 - lat1, 2);
  var lon = Math.pow(lon2 - lon1, 2);
  var d = lat + lon;
  return d;
}
*/
