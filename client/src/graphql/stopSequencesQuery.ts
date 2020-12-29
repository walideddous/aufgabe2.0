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

  
  export const DELETE_STOP_SEQUENCE_BY_MODES = gql`
    mutation RouteManagerDelete ($_id: String!){
      RouteManagerDelete(_id:$_id)
    }
  `
  
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
  /*

      try {


        if (!Object.keys(result).length) {
          console.error("Couldn't delete the Stop sequence");
        }

        const { RouteManagerDelete } = result.data.data;
        if (RouteManagerDelete) {
          message.success(`Stop sequence successfully deleted`);
          // Set the state of stopSequence List
          setStopSequenceList((prev) => {
            return prev.filter((el: any) => el._id !== id);
          });
          handleClearAll();
          setCurrentStopSequence({});
        } else {
          console.log("Could't find the RouteManagerDelete value");
        }
      } catch (error) {
        console.error(error, "error from trycatch");
      }

  */