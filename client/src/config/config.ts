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

export const JSON_SECRET =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDAyNDEzNjAsImV4cCI6MTYzMTc3NzM2MCwiYXVkIjoiIiwic3ViIjoiIiwiR2l2ZW5OYW1lIjoid2FsaWQiLCJTdXJuYW1lIjoiZWRkb3VzIiwiRW1haWwiOiJ3YWxpZEBnbWFpbC5jb20ifQ.BUrX-GloO1kcOk_ssGSd5nloxEID863nrsgcUzLTvPo";
