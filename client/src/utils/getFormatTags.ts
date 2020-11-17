import moment from "moment";

const getFormatTags = (values: any) => {
  return {
    date: `${moment(values.date[0]).format("YYYY.MM.DD")} - ${moment(
      values.date[1]
    ).format("YYYY.MM.DD")}`,
    displayedtags: values.time.map((el: any) => {
      if (values.day.length === 8) {
        return `All days ${moment(el.timePicker[0]).format("hh:mm")} - ${moment(
          el.timePicker[1]
        ).format("hh:mm")}`;
      } else if (values.day.length === 1) {
        return `${values.day[0]} ${moment(el.timePicker[0]).format(
          "hh:mm"
        )} - ${moment(el.timePicker[1]).format("hh:mm")}`;
      } else {
        return `${values.day[0]} - ${
          values.day[values.day.length - 1]
        } ${moment(el.timePicker[0]).format("hh:mm")} - ${moment(
          el.timePicker[1]
        ).format("hh:mm")}`;
      }
    }),
  };
};


export default getFormatTags