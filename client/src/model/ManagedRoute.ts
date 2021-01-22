import moment from "moment";
import "moment/locale/de";

class ManagedRoute {
  newFormData: {
    from: string;
    to: string;
    timeSlices: {
      weekDays: string[];
      startTime: string;
      endTime: string;
    }[];
  };

  constructor(date: any, days: string[], time: string, timeList: any) {
    if (timeList) {
      const timeListTable = timeList.filter((el: any) => el.time);
      timeList = [{ time }];
      for (let i = 0; i < timeListTable.length; i++) {
        // delete the bug in antd timeList
        timeList = timeList.concat(timeListTable[i]);
      }
    } else {
      timeList = [{ time }];
    }

    this.newFormData = {
      from: date[0].format("DD-MM-YYYY"),
      to: date[1].format("DD-MM-YYYY"),
      timeSlices: timeList.map((element: any) => {
        return {
          weekDays: days,
          startTime: element.time[0].format("HH:mm"),
          endTime: element.time[1].format("HH:mm"),
        };
      }),
    };
  }

  getWeekDayLabel(value: string) {
    switch (value) {
      case "MON":
        return "Montag";
      case "DIE":
        return "Dienstag";
      case "MIT":
        return "Mittwoch";
      case "DON":
        return "Donnerstag";
      case "FRE":
        return "Freitag";
      case "SAM":
        return "Samstag";
      case "SON":
        return "Sonntag";
    }
  }

  getFormatedData() {
    return this.newFormData;
  }

  validationMessages(prevFormData: any) {
    let validationMessages: {
      type: string;
      message: string;
    }[] = [];

    if (prevFormData && prevFormData.schedule) {
      const { schedule: prevSchedule } = prevFormData;
      // Check if the date already exist
      if (
        prevSchedule.filter(
          (el: any) =>
            el.from === this.newFormData.from && el.to === this.newFormData.to
        ).length
      ) {
        const sameDateIndex = prevSchedule
          .map((el: any) => `${el.from} ${el.to}`)
          .indexOf(`${this.newFormData.from} ${this.newFormData.to}`);

        for (let index = 0; index < prevSchedule.length; index++) {
          // Check if the value is duplicated

          if (
            sameDateIndex === index &&
            JSON.stringify(
              prevSchedule[index].timeSlices[
                prevSchedule[index].timeSlices.length - 1
              ]
            ) ===
              JSON.stringify({
                ...this.newFormData.timeSlices[0],
                weekDays: this.newFormData.timeSlices[0].weekDays.map(
                  (weekDay: string) => weekDay
                ),
              })
          ) {
            return validationMessages.concat({
              type: "error",
              message: "Bitte vermeiden Sie doppelte Gültigkeiten",
            });
          }

          // Check if the time overlap the old time
          if (sameDateIndex === index) {
            for (let i = 0; i < prevSchedule[index].timeSlices.length; i++) {
              const {
                startTime: prevStartTime,
                endTime: prevEndTime,
                weekDays: prevWeekDays,
              } = prevSchedule[index].timeSlices[i];
              const {
                startTime,
                endTime,
                weekDays,
              } = this.newFormData.timeSlices[0];
              let existDays =
                prevWeekDays.length >= weekDays.length
                  ? prevWeekDays.filter((prevWeekDay: string) =>
                      weekDays
                        .map((weekDay: string) => weekDay)
                        .includes(prevWeekDay)
                    ).length
                  : weekDays
                      .map((weekDay: string) => weekDay)
                      .filter((weekDay: string) =>
                        prevWeekDays.includes(weekDay)
                      ).length;

              // Check if the days are already exists and the time overlap
              if (
                existDays &&
                !(startTime > prevEndTime || endTime < prevStartTime)
              ) {
                return validationMessages.concat({
                  type: "error",
                  message: "Die ZeitIntervalle überlappen sich",
                });
              }
            }
          }
        }
      }

      // Validating the number of day selected in the date and it should be more than 7 days
      // if the perioed less than 7 days check if the selected Days are valid in this period
      const { to, from, timeSlices } = this.newFormData;
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
        let i: number = 0;
        let arrayDays: string[] = [];
        while (i <= daysNumber) {
          arrayDays[i] = moment(from, "DD-MM-YYYY")
            .add(i, "d")
            .locale("de")
            .format("dddd")
            .toUpperCase()
            .substr(0, 3);
          i = i + 1;
        }

        for (let i = 0; i < timeSlices[0].weekDays.length; i++) {
          if (!arrayDays.includes(timeSlices[0].weekDays[i])) {
            validationMessages[i] = {
              type: "error",
              message: `${this.getWeekDayLabel(
                timeSlices[0].weekDays[i]
              )} ist nicht gültig`,
            };
          }
        }

        return validationMessages;
      }

      //Check if the date overlap the old date
      for (let i = 0; i < prevSchedule.length; i++) {
        const {
          from: prevFrom,
          to: prevTo,
          timeSlices: prevTimeSlices,
        } = prevSchedule[i];
        const { from, to, timeSlices } = this.newFormData;

        const diff1 = moment(prevFrom, "DD-MM-YYYY").diff(
          moment(to, "DD-MM-YYYY"),
          "days"
        );

        const diff2 = moment(from, "DD-MM-YYYY").diff(
          moment(prevTo, "DD-MM-YYYY"),
          "days"
        );

        if (!(diff1 > 0 || diff2 > 0) && diff1 - diff2 !== 0) {
          return validationMessages.concat({
            type: "error",
            message: "Die gültigkeiten überlappen sich",
          });
        }
      }
    }

    return validationMessages;
  }
}

export default ManagedRoute;
