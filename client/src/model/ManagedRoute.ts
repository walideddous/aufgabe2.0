import moment from "moment";

class ManagedRoute {
  messageValidation(prevFormData: any, formData: any) {
    let resultMessage: string = "";

    if (prevFormData && prevFormData.schedule) {
      const { schedule: prevSchedule } = prevFormData;
      // Check if the date already exist
      if (
        prevSchedule.filter(
          (el: any) => el.from === formData.from && el.to === formData.to
        ).length
      ) {
        const sameDateIndex = prevSchedule
          .map((el: any) => `${el.from} ${el.to}`)
          .indexOf(`${formData.from} ${formData.to}`);

        for (let index = 0; index < prevSchedule.length; index++) {
          // Check if the value is duplicated
          if (
            sameDateIndex === index &&
            JSON.stringify(
              prevSchedule[index].timeSlices[
                prevSchedule[index].timeSlices.length - 1
              ]
            ) === JSON.stringify(formData.timeSlices[0])
          ) {
            return (resultMessage =
              "Bitte vermeiden Sie doppelte Gültigkeiten");
          }

          // Check if the time overlap the old time
          if (sameDateIndex === index) {
            for (let i = 0; i < prevSchedule[index].timeSlices.length; i++) {
              const {
                startTime: prevStartTime,
                endTime: prevEndTime,
                weekDays: prevWeekDays,
              } = prevSchedule[index].timeSlices[i];
              const { startTime, endTime, weekDays } = formData.timeSlices[0];
              let existDays =
                prevWeekDays.length >= weekDays.length
                  ? prevWeekDays.filter((prevWeekDay: string) =>
                      weekDays.includes(prevWeekDay)
                    ).length
                  : weekDays.filter((weekDay: string) =>
                      prevWeekDays.includes(weekDay)
                    ).length;

              // Check if the days are already exists and the time overlap
              if (
                existDays &&
                !(startTime > prevEndTime || endTime < prevStartTime)
              ) {
                return (resultMessage = "Die ZeitIntervalle überlappen sich");
              }
            }
          }
        }
      }

      // Validating the number of day selected in the date and it should be more than 7 days
      const { to, from } = formData;
      let daysNumber = moment(
        to
          .split("-")
          .reverse()
          .map((el: string) => parseInt(el, 10))
      ).diff(
        moment(
          from
            .split("-")
            .reverse()
            .map((el: string) => parseInt(el, 10))
        ),
        "days"
      );

      if (daysNumber < 7) {
        return (resultMessage =
          "Die gültigkeit muss mindesten eine Woche haben");
      }
    }

    //Check if the date overlap the old date
    if (prevFormData && prevFormData.schedule) {
      const { schedule: prevSchedule } = prevFormData;

      for (let i = 0; i < prevSchedule.length; i++) {
        const { from: prevFrom, to: prevTo } = prevSchedule[i];
        const { from, to } = formData;

        const diff1 = moment(prevFrom, "DD-MM-YYYY").diff(
          moment(to, "DD-MM-YYYY"),
          "days"
        );

        const diff2 = moment(from, "DD-MM-YYYY").diff(
          moment(prevTo, "DD-MM-YYYY"),
          "days"
        );

        if (!(diff1 > 0 || diff2 > 0) && diff1 - diff2 !== 0) {
          return (resultMessage = "Die gültigkeiten überlappen sich");
        }
      }
    }

    return resultMessage;
  }
}

export default ManagedRoute;
