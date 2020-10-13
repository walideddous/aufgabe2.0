export const GRAPHQL_API = "http://ems-dev.m.mdv:8101";

export const TEST_API = "http://ems-dev.m.mdv:8101/result";

export const REST_API = "http://ems-dev.m.mdv:8101/data";

export const GET_HALTESTELLE_QUERY = ` query {haltestelles {
    _id
    name,
    coord{WGS84{lat,lon}},
    modes
  }}`;

export const GET_STOPS_BY_MODES = (modes: string ) => {
  return ` query {haltestelleByMode(modes:"${modes}"){_id,name,modes,coord{WGS84{lat,lon}}}}
  `;
};

export const GET_STOP_SEQUENCE_BY_MODES = (modes: string ) => {
  return `query {stopSequence(modes:"${modes}"){_id,name,date,schedule{day,time{start,end}},stopSequence{_id,name,modes,coord{WGS84{lat,lon}}}}}`
}
