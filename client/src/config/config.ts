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

export const GET_STOP_SEQUENCE_BY_MODES = (modes: string[] ) => {
  return `query {RouteManagerItems(modes:"${modes}"){
    _id
    name
    schedule{
      date
      dayTime{
        day
        time
      }
    }
    modes
    stopSequence{
      _id
      name
      modes
      coord{
        WGS84{
          lat
          lon
        }
      }
    }
  }}`
}

export const SAVE_STOP_SEQUENCE_BY_MODES = (input:any) => {
  return `mutation{RouteManagerAdd(input:"${input}")
  }`
}

export const DELETE_STOP_SEQUENCE_BY_MODES = (id:string) => {
  return `mutation{
    RouteManagerDelete(_id:"${id}")
  }`
}


