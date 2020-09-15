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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndhbGlkIiwiaWF0IjoxNTE2MjM5MDIyfQ.j1VE5hBFsznHMN6CgGOqVhe1RVYnaKWuaU6MwxcZMuk";
