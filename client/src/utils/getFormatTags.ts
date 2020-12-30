export  const getFormatTags = (values: any) => {
  return values.schedule.map((element: any) => {
    const { timeSlices, from, to } = element;
    return {
      from,
      to,
      displayedTags : timeSlices.map((dayTime: any, index:number) => {
        const { weekDays, startTime, endTime } = dayTime;
        if (weekDays.length === 1) {
          return  `${weekDays[0]} ${startTime} - ${endTime}`

        } else if (weekDays.length === 8) {
          return `All days ${startTime} - ${endTime}`
        } else {
          return `${weekDays} ${startTime} - ${endTime}`
        }
      })
    }
  });
};


