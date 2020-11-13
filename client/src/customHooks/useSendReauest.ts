import {useState} from "react"

// Import services
import stopsService from "../services/stopsService";
import {
  queryStopSequence,
} from "../services/stopSequenceService";

// Typescript
import {TstateDND, Tstations} from "../types/types"


export default async function useSendRequest(modes: string){
    const [stations, setStations] = useState<Tstations[]>([]);
    const [selected, setSelected] = useState<Tstations>();
    const [stateDND, setStateDND] = useState<TstateDND>({
      vorschlag: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    });
    const [isSending, setIsSending] = useState<boolean>(false);
    const [stopSequenceList, setStopSequenceList] = useState([]);
    const [updateDate, setUpdateDate] = useState<string>("");
    const [currentMode, setCurrentMode] = useState<string>("");

    if (isSending) return;
    // update state
    setIsSending(true);
    setSelected(undefined);
    setStateDND({
      vorschlag: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    });
    // send the actual request
    try {
      console.log("start fetching");
      // GraphQl
      const stops = await stopsService(modes);
      const stopSequence = await queryStopSequence(modes);

      console.log("end fetching");
      if (stops && stopSequence) {
        const { haltestelleByMode } = stops.data.data;
        const { stopSequenceByMode } = stopSequence.data.data;
        setStations(haltestelleByMode);
        setStopSequenceList(stopSequenceByMode);
        setCurrentMode(modes);
        setUpdateDate(Date().toString().substr(4, 24));
      } else {
        console.log("not authorized provid a token");
      }
    } catch (error) {
      console.error(error, "error from trycatch");
    }
    // once the request is sent, update state again
    setIsSending(false);

}