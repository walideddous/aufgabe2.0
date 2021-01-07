import {getFormatTags} from "./getFormatTags";

const TestData0 = {
  name : "test0",
  schedule : [{
    from: "",
    to: "",
    timeSlices: [{
      weekDays: ["Mon","Tue"],
      startTime: "2020.11.02",
      endTime: "2020.11.04",
    }]
  }]
};
const TestData1 = {
  name : "test1",
  schedule : [{
    from: "",
    to: "",
    timeSlices: [{
      weekDays: ["Mon"],
      startTime: "2020.11.02",
      endTime: "2020.11.04",
    }]
  }]
};
const TestData2 = {
  name : "test2",
  schedule : [{
    from: "",
    to: "",
    timeSlices: [{
      weekDays: ["Mon", "Tue", "Wed","Thu","Fri", "Sat", "Sun", "Holiday"],
      startTime: "2020.11.02",
      endTime: "2020.11.04",
    }]
  }]
};

it("Should test the jest framework", ()=>{
  expect(true).toBe(true)
})

it("Test getFormatTags util function with the first testData0", () => {
  const resultat = getFormatTags(TestData0);

  resultat.forEach((element: any) => {
    expect(element.displayedTags.length).toBeTruthy()
  });
});
it("Test getFormatTags util function  with the first testData1", () => {
  const resultat = getFormatTags(TestData1);

  resultat.forEach((element: any) => {
    expect(element.displayedTags.length).toBeTruthy()
  });
});
it("Test getFormatTags util function with the first testData2", () => {
  const resultat = getFormatTags(TestData2);

  resultat.forEach((element: any) => {
    expect(element.displayedTags.length).toBeTruthy()
  });
});
