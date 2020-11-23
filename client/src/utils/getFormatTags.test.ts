import {getFormatTags} from "./getFormatTags";
import moment from "moment";

const TestData0 = {
  date: [moment(), moment()],
  day: ["Mon", "Tue", "Wed"],
  timeList: [
    {
      time: [moment(), moment()],
    },
    {
      time: [moment(), moment()],
    },
  ],
};
const TestData1 = {
  date: [moment(), moment()],
  day: ["Mon"],
  timeList: [
    {
      time: [moment(), moment()],
    },
    {
      time: [moment(), moment()],
    },
  ],
};
const TestData2 = {
  date: [moment(), moment()],
  day: ["Mon", "Tue", "Wed","Thu","Fri", "Sat", "Sun", "Holiday"],
  timeList: [
    {
      time: [moment(), moment()],
    },
    {
      time: [moment(), moment()],
    },
  ],
};

it("Test getFormatTags util function with the first testData0", () => {
  const resultat = getFormatTags(TestData0);

  expect(resultat.displayedtags).toBeTruthy();
});
it("Test getFormatTags util function  with the first testData1", () => {
  const resultat = getFormatTags(TestData1);

  expect(resultat.displayedtags).toBeTruthy();
});
it("Test getFormatTags util function with the first testData2", () => {
  const resultat = getFormatTags(TestData2);

  expect(resultat.displayedtags).toBeTruthy();
});
