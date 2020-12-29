export const formatStopSequenceItems = (stopsBymode: any, routeManagerItems: any) => {
   return  routeManagerItems.map((routeManagerItem:any)=> {
        return {
            ...routeManagerItem,
            stopSequence: routeManagerItem.stopSequence.keys.map((key:any)=>{
                return stopsBymode.filter((stop:any)=> stop.key === key)[0]
            })
        }
    })
}