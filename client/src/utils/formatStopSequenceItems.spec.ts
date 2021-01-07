import { formatStopSequenceItems } from "./formatStopSequenceItems"

describe("Test the formatStopSequenceItems function",()=>{
   
   const stopInput = [
    {
      coord: [46.19161, 6.21145],
      key: "100713",
      modes: ["4"],
      name: "Gaillard, Libération",
      _id: "5f6203cc0d5658001cd8fae8",
    },
  ];

  const RouteManagerItemByKey = [{
    created: "2021-01-07T09:40:05Z",
    desc: "description du mode  4 asdfsdfsdgf",
    key: "55be6995-f314-48f7-9227-c9e7640133c7",
    modes: ["4"],
    modified: "2021-01-07T09:49:42Z",
    name: "test avec le mode 4 254",
    schedule:  [{from: "2021-01-07", to: "2021-02-19", timeSlices: [{weekDays: ["Mon"], startTime: "03:00", endTime: "06:00"}]  }],
    stopSequence:  [{
        key: "100713",
        name: "Gaillard, Libération",
    }]  ,
    _id: "2202ac35-7448-4cf5-a977-a0159bb347f8"
  }]

  const result = [{
    created: "2021-01-07T09:40:05Z",
    desc: "description du mode  4 asdfsdfsdgf",
    key: "55be6995-f314-48f7-9227-c9e7640133c7",
    modes: ["4"],
    modified: "2021-01-07T09:49:42Z",
    name: "test avec le mode 4 254",
    schedule:  [{from: "2021-01-07", to: "2021-02-19", timeSlices: [{weekDays: ["Mon"], startTime: "03:00", endTime: "06:00"}]  }],
    stopSequence:  [    {
        coord: [46.19161, 6.21145],
        key: "100713",
        modes: ["4"],
        name: "Gaillard, Libération",
        _id: "5f6203cc0d5658001cd8fae8",
      },]  ,
    _id: "2202ac35-7448-4cf5-a977-a0159bb347f8"
  }]
   
    it("Should test the jest framework", ()=>{
        expect(true).toBe(true)
    })

    it("Should test the function without crashing", ()=>{
        expect(formatStopSequenceItems(stopInput, RouteManagerItemByKey)).toEqual(result)
    })
})