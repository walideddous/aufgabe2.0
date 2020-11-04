import React from "react";
import { mount, shallow } from "enzyme";
import toJSON from "enzyme-to-json";
import LoadStopSequence from "./LoadStopSequence";

const setUp = (props: any) => {
  const component = shallow(<LoadStopSequence {...props} />);
  return component;
};

describe("LoadStopSequence component", () => {
  let shallowWrapper: any;
  let props = {
    stopSequenceList: [
      {
        _id: "c03295ea-5a3f-43e8-83ea-7736ce82cfd9",
        name: "St. Gallen to Zürich HB",
        date: ["2020-10-16", "2020-11-27"],
        schedule: [
          {
            day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            time: [
              {
                start: "07:00",
                end: "12:00",
              },
              {
                start: "13:00",
                end: "18:00",
              },
            ],
          },
          {
            day: ["saturday", "sunday"],
            time: [
              {
                start: "07:00",
                end: "12:00",
              },
            ],
          },
        ],
        modes: "13",
        stopSequence: [
          {
            _id: "5f62045b0d5658001cd910c4",
            name: "St. Gallen",
            modes: ["13", "5"],
            coord: {
              WGS84: {
                lat: 47.42318,
                lon: 9.3699,
              },
            },
          },
          {
            _id: "5f62045b0d5658001cd910c1",
            name: "St. Gallen Bruggen",
            modes: ["13"],
            coord: {
              WGS84: {
                lat: 47.4072,
                lon: 9.32965,
              },
            },
          },
        ],
      },
    ],
    stateDND: {
      vorschlag: {
        title: "Suggestion",
        items: [],
      },
      trajekt: {
        title: "Stop sequence",
        items: [],
      },
    },
    currentStopSequence: {},
  };

  const spyOnHandleUpdateAfterSave = jest.fn();
  const spyOnOnSendRequest = jest.fn();
  const spyOnOndisplayStopSequence = jest.fn();
  const spyOnHandleDeleteStopSequence = jest.fn();
  const spyOnClearAll = jest.fn();

  beforeEach(() => {
    shallowWrapper = shallow(
      <LoadStopSequence
        {...props}
        handleUpdateAfterSave={spyOnHandleUpdateAfterSave}
        onSendRequest={spyOnOnSendRequest}
        ondisplayStopSequence={spyOnOndisplayStopSequence}
        handleDeleteStopSequence={spyOnHandleDeleteStopSequence}
        onClearAll={spyOnClearAll}
      />
    );
  });

  it("match snapShot with the LoadStopSequence component", () => {
    expect(toJSON(shallowWrapper)).toMatchSnapshot();
  });
});
