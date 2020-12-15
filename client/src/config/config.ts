export const GRAPHQL_API = "http://ems-dev.m.mdv:8059";

export const GET_STOPS_BY_MODES = (modes: string[] ) => {
  return`query{PTStopItems(modes:"${modes}"){
    type
    name
    geojson{
      type
      geometry{
        type
        coordinates
      }
    }
    data
  }}`;
};

export const GET_STOP_SEQUENCE_BY_MODES = (modes: string ) => {
  return `query {stopSequenceByMode(modes:"${modes}"){_id,name,modes,schedule{date,dayTime{day,time}},stopSequence{_id,name,modes,coord{WGS84{lat,lon}}}}}`
}

export const GET_ALL_STOP_SEQUENCE = `query {stopSequence{_id,name,modes , schedule{date,dayTime{day,time}},stopSequence{_id,name,modes,coord{WGS84{lat,lon}}}}}`

