export  const getFormatTags = (values: any) => {
  return values.schedule.map((element: any) => {
    const { dayTime, date } = element;
    return {
      date,
      displayedTags : dayTime.map((dayTime: any) => {
        const { day, time } = dayTime;
        if (day.length === 1) {
          return  `${day[0]} ${time[0]} - ${time[1]}`

        } else if (day.length === 8) {
          return `All days ${time[0]} - ${time[1]}`
        } else {
          return `${day[0]} - ${day[day.length - 1]} ${time[0]} - ${time[1]}`
        }
      })
    }
  });
};


