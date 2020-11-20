const getFormatTags = (values: any) => {
  let date= `${(values.date[0]).format("YYYY.MM.DD")} - ${(
    values.date[1]
  ).format("YYYY.MM.DD")}`

  if(values.day.length===1){
    return {
      date,
      displayedtags:[`${values.day[0]} ${(values.time[0]).format(
        "HH:mm"
      )} - ${(values.time[1]).format("HH:mm")}`]
    }
  } else if(values.day.length === 8){
    return {
      date ,
      displayedtags: [`All days ${(values.time[0]).format("HH:mm")} - ${(
        values.time[1]
      ).format("HH:mm")}`]
    }
  } else {
    return {
      date,
      displayedtags:[`${values.day[0]} - ${
        values.day[values.day.length - 1]
      } ${(values.time[0]).format("HH:mm")} - ${(
        values.time[1]
      ).format("HH:mm")}`]
    }
  }
};

export default getFormatTags