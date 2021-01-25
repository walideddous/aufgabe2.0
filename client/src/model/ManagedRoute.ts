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
      const { from, to, timeSlices } = this.newFormData;

      for (let index = 0; index < prevSchedule.length; index++) {
        const {
          from: prevFrom,
          to: prevTo,
          timeSlices: prevTimeSlices,
        } = prevSchedule[index];

        // Check if the date already exist
        if (prevFrom === from && prevTo === to) {
          for (let j = 0; j < prevTimeSlices.length; j++) {
            const {
              weekDays: prevWeekDays,
              startTime: prevStartTime,
              endTime: prevEndTime,
            } = prevTimeSlices[j];
            const { weekDays, startTime, endTime } = timeSlices[0];

            let existDays =
              prevWeekDays.length >= weekDays.length
                ? prevWeekDays.filter((prevWeekDay: string) =>
                    weekDays
                      .map((weekDay: string) => weekDay)
                      .includes(prevWeekDay)
                  ).length
                : weekDays
                    .map((weekDay: string) => weekDay)
                    .filter((weekDay: string) => prevWeekDays.includes(weekDay))
                    .length;

            if (
              JSON.stringify(prevTimeSlices[j]) ===
              JSON.stringify({
                ...timeSlices[0],
                weekDays: timeSlices[0].weekDays.map(
                  (weekDay: string) => weekDay
                ),
              })
            ) {
              return validationMessages.concat({
                type: "error",
                message: "Bitte vermeiden Sie doppelte Gültigkeiten",
              });

              // Check if the days are already exists and the time overlap
            } else if (
              existDays &&
              !(startTime > prevEndTime || endTime < prevStartTime)
            ) {
              return validationMessages.concat({
                type: "error",
                message: "Die ZeitIntervalle überlappen sich",
              });
            }
          }
        } else if (
          (moment(to, "DD-MM-YYYY").diff(
            moment(prevFrom, "DD-MM-YYYY"),
            "days"
          ) >= 0 &&
            moment(prevTo, "DD-MM-YYYY").diff(
              moment(to, "DD-MM-YYYY"),
              "days"
            ) > 0) ||
          (moment(to, "DD-MM-YYYY").diff(
            moment(prevFrom, "DD-MM-YYYY"),
            "days"
          ) > 0 &&
            moment(prevTo, "DD-MM-YYYY").diff(
              moment(to, "DD-MM-YYYY"),
              "days"
            ) >= 0) ||
          (moment(from, "DD-MM-YYYY").diff(
            moment(prevFrom, "DD-MM-YYYY"),
            "days"
          ) >= 0 &&
            moment(prevTo, "DD-MM-YYYY").diff(
              moment(from, "DD-MM-YYYY"),
              "days"
            ) > 0) ||
          (moment(from, "DD-MM-YYYY").diff(
            moment(prevFrom, "DD-MM-YYYY"),
            "days"
          ) > 0 &&
            moment(prevTo, "DD-MM-YYYY").diff(
              moment(from, "DD-MM-YYYY"),
              "days"
            ) >= 0)
        ) {
          for (let j = 0; j < prevTimeSlices.length; j++) {
            const {
              weekDays: prevWeekDays,
              startTime: prevStartTime,
              endTime: prevEndTime,
            } = prevTimeSlices[j];
            const { weekDays, startTime, endTime } = timeSlices[0];

            let existDays =
              prevWeekDays.length >= weekDays.length
                ? prevWeekDays.filter((prevWeekDay: string) =>
                    weekDays
                      .map((weekDay: string) => weekDay)
                      .includes(prevWeekDay)
                  ).length
                : weekDays
                    .map((weekDay: string) => weekDay)
                    .filter((weekDay: string) => prevWeekDays.includes(weekDay))
                    .length;

            if (
              JSON.stringify(prevTimeSlices[j]) ===
              JSON.stringify({
                ...timeSlices[0],
                weekDays: timeSlices[0].weekDays.map(
                  (weekDay: string) => weekDay
                ),
              })
            ) {
              return validationMessages.concat({
                type: "error",
                message: "Die gültigkeiten überlappen sich",
              });

              // Check if the days are already exists and the time overlap
            } else if (
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

      // Validating the number of day selected in the date and it should be more than 7 days
      // if the perioed less than 7 days check if the selected Days are valid in this period
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
    }

    return validationMessages;
  }
}

export default ManagedRoute;
