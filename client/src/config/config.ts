export const GRAPHQL_API = "http://localhost:5000/graphql";

export const GET_HALTESTELLE_QUERY = ` query haltestelles{
    haltestelles{
        id
        name
        adresse
        location{
            lat,lng
        }
    }
} `;
