import { gql } from "@apollo/client"

export const GET_STOP_SEQUENCE_BY_MODES = gql`
    query RouteManagerItems($modes: [String]!){
    RouteManagerItems(modes:$modes){
    _id
    name
    schedule{
      from
      to
      timeSlices{
        weekDays
        startTime
        endTime        
      }
    }
    modes
    stopSequence{
      keys
    }
    }
    }`
  
  export const SAVE_STOP_SEQUENCE_BY_MODES = (input:any) => {
    return gql`mutation{RouteManagerAdd(data:{
      _id:"${input._id}"
      name:"${input.name}"
      schedule: [${input.schedule.map((el:any)=>(
        `
        {
        date: "${el.date}"
        dayTime: [${el.dayTime.map((el:any)=>(
            `
            {
              day: [${el.day.map((el:any)=>(`"${el}"`))}]
              time: ["${el.time[0]}","${el.time[1]}"]
            }
             `
          ))} 
        ]
        } `
      ))}
    ]
      modes: ["${input.modes}"]
      stopSequence: [${input.stopSequence.map((el:any)=>(
        `
        {
          _id: "${el._id}"
          name: "${el.name}"
          modes: [${el.modes.map((el:any)=>(`"${el}"`))}]
          coord: {
            WGS84:{
              lat: ${el.coord.WGS84.lat}
              lon: ${el.coord.WGS84.lon}
            }
          }
        }
        `
      ))}]
    })}`
  }
  
  export const DELETE_STOP_SEQUENCE_BY_MODES = (id:string) => {
    return gql`mutation{
      RouteManagerDelete(_id:"${id}")
    }`
  }
  