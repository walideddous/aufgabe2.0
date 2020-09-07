function getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
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

function deg2rad(deg: any) {
  return deg * (Math.PI / 180);
}

// Calculate the distance from a fixed punkt to every punkt of the table
export function calculateDistanceAndSort(objClicked: any, tabData: any) {
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
    let distance = getDistanceFromLatLonInKm(
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
  const sortedTable = result.sort((a: any, b: any) => {
    return a.distance - b.distance;
  });

  return sortedTable;
}
