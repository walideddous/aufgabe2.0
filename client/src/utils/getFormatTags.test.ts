import {getFormatTags} from "./getFormatTags";

const TestData0 = {
  name : "test0",
  schedule : [{
    date: "",
    dayTime: [{
      day: ["Mon","Tue"],
      time: ["2020.11.02","2020.11.04"]
    }]
  }]
};
const TestData1 = {
  name : "test1",
  schedule : [{
    date: "",
    dayTime: [{
      day: ["Mon"],
      time: ["2020.11.02","2020.11.04"]
    }]
  }]
};
const TestData2 = {
  name : "test2",
  schedule : [{
    date: "",
    dayTime: [{
      day: ["Mon", "Tue", "Wed","Thu","Fri", "Sat", "Sun", "Holiday"],
      time: ["2020.11.02","2020.11.04"]
    }]
  }]
};


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
