export const GRAPHQL_API = "http://ems-dev.m.mdv:8101/graphql";

export const REST_API = "http://ems-dev.m.mdv:8101/data";

export const GET_HALTESTELLE_QUERY = ` query haltestelles{
    haltestelles{
        _id,
        name,
        modes,
        coord{WGS84{lat,lng}
        }
    }
} `;
