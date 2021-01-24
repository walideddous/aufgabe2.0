export const formatManagedRouteItems = (
  stopsBymode: any,
  routeManagerItems: any
) => {
  return routeManagerItems.map((routeManagerItem: any) => {
    return {
      ...routeManagerItem,
      stopSequence: routeManagerItem.stopSequence.map((stopSeq: any) => {
          return stopsBymode.filter((stop: any) => stop.key === stopSeq.key)[0];
      }),
    };
  });
};