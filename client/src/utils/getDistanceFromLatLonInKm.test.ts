import {calculateDistanceAndSort} from "./getDistanceFromLatLonInKm"


describe("calculateDistanceAndSort function", ()=>{
    const response = {
    coord: {WGS84: { lat: 46.17857 , lon :6.08606 }},
    modes: ["4", "5"],
    name: "Bernex (CH), P+R Bernex",
    _id: "5f6206390d5658001cd959b4",
    }

    const stations = [
        {
          coord: { WGS84: { lat: 46.19161, lon: 6.21145 } },
          modes: ["4"],
          name: "Gaillard, Libération",
          _id: "5f6203cc0d5658001cd8fae8",
        },
        {
          coord: { WGS84: { lat: 46.19138, lon: 6.21661 } },
          modes: ["4"],
          name: "Gaillard, Millet",
          _id: "5f6203cc0d5658001cd8fae9",
        },
      ];

      const result =  [ 
        {
            from: "Bernex (CH), P+R Bernex",
            to:    {
                coord: { WGS84: { lat: 46.19161, lon: 6.21145 } },
                modes: ["4"],
                name: "Gaillard, Libération",
                _id: "5f6203cc0d5658001cd8fae8",
              },
              distance: 9.76127798048934,
              angle: 84.06283704930443
        },{
            from: "Bernex (CH), P+R Bernex",  
            to:     {
                coord: { WGS84: { lat: 46.19138, lon: 6.21661 } },
                modes: ["4"],
                name: "Gaillard, Millet",
                _id: "5f6203cc0d5658001cd8fae9",
              },
              distance: 10.150678535338718,
              angle: 84.39588750680919 
        }
        ]




    it("Should run the funcion without crashing", ()=>{
        //@ts-ignore
        const testResult = calculateDistanceAndSort(response , stations)
        expect(testResult).toEqual(result)
    })
})