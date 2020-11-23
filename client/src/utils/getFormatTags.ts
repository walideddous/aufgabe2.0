export  const getFormatTags = (values: any) => {
  const { date, day, timeList } = values;

  if (day.length === 1) {
    return {
      date: `${date[0].format("YYYY.MM.DD")} - ${date[1].format("YYYY.MM.DD")}`,
      displayedtags: timeList.map((element: any) => {
        return `${day[0]} ${element.time[0].format(
          "HH:mm"
        )} - ${element.time[1].format("HH:mm")}`;
      }),
    };
  } else if (day.length === 8) {
    return {
      date: `${date[0].format("YYYY.MM.DD")} - ${date[1].format("YYYY.MM.DD")}`,
      displayedtags: timeList.map((element: any) => {
        return `All days ${element.time[0].format(
          "HH:mm"
        )} - ${element.time[1].format("HH:mm")}`;
      }),
    };
  } else {
    return {
      date: `${date[0].format("YYYY.MM.DD")} - ${date[1].format("YYYY.MM.DD")}`,
      displayedtags: timeList.map((element: any) => {
        return `${day[0]} - ${day[day.length - 1]} ${element.time[0].format(
          "HH:mm"
        )} - ${element.time[1].format("HH:mm")}`;
      }),
    };
  }
};

export  const getFormatTags1 = (values: any) => {
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


