export const GRAPHQL_API = "http://ems-dev.m.mdv:8101";

export const TEST_API = "http://ems-dev.m.mdv:8101/result";

export const REST_API = "http://ems-dev.m.mdv:8101/data";

export const GET_HALTESTELLE_QUERY = ` query {haltestelles {
    _id
    name,
    coord{WGS84{lat,lon}},
    modes
  }}`;
