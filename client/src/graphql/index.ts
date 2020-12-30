import {ApolloClient, InMemoryCache} from "@apollo/client"

export const client = new ApolloClient({
    uri:"http://ems-dev.m.mdv:8059/graphql",
    cache: new InMemoryCache({
        addTypename: false
    })
})

