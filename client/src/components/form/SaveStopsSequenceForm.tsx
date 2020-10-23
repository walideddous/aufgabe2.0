/*
import React, { useEffect } from "react";
import {
  Card,
  Input,
  Col,
  TimePicker,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Collapse,
} from "antd";

// Import types
import { TstateDND } from "../type/Types";

import moment from "moment";

// Declare Props Types
interface TpropsForm {
  stateDND: TstateDND;
  currentStopSequence: any;
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;
const { Panel } = Collapse;

const SaveStopsSequenceForm = ({
  stateDND,
  currentStopSequence,
  handleSaveStopSequence,
}: TpropsForm) => {
  console.log("currentStopSequence", currentStopSequence);
  return (
    <Card bordered={true}>
      <Collapse>
        <Panel header="Stop sequence save form" key="1">
          <form>
            <label>
              Name :
              <Input
                style={{ width: "50%" }}
                value={currentStopSequence.name}
                required
              />
            </label>
            <br />
            <label>
              Date :
              <DatePicker.RangePicker
                value={
                  currentStopSequence.date
                    ? [
                        moment(currentStopSequence.date[0]),
                        moment(currentStopSequence.date[1]),
                      ]
                    : null
                }
              />
            </label>
            <br />
            <label>
              Days :
              <Checkbox.Group
                style={{ width: "80%", paddingLeft: "20px" }}
                value={
                  currentStopSequence.schedule
                    ? currentStopSequence.schedule[0].day
                    : null
                }
              >
                <Row>
                  <Col span={3}>
                    <Checkbox value="monday">Mo</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="tuesday">Tu</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="wednesday">We</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="thursday">Th</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="friday">Fr</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="saturday">Sa</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="sunday">Su</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="holiday" style={{ width: "80px" }}>
                      Holiday
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </label>
            <br />
            <label>
              Time :{" "}
              <RangePicker
                format="HH:mm"
                value={
                  currentStopSequence.schedule
                    ? [
                        moment(currentStopSequence.schedule[0].time[0].start),
                        moment(currentStopSequence.schedule[0].time[0].start),
                      ]
                    : null
                }
                onChange={(value) => {
                  console.log("value time", value);
                }}
              />
            </label>
            <br />
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </form>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default React.memo(SaveStopsSequenceForm);
*/

import React, { useCallback, useState } from "react";
import {
  Card,
  Form,
  Input,
  Col,
  TimePicker,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Collapse,
} from "antd";

import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";

// Import types
import { TstateDND } from "../type/Types";

const layout = {
  labelCol: { span: 2 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 20 },
};

// Declare Props Types
interface TpropsForm {
  stateDND: TstateDND;
  currentStopSequence: any;
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;
const { Panel } = Collapse;

const SaveStopsSequenceForm = ({
  stateDND,
  currentStopSequence,
  handleSaveStopSequence,
}: TpropsForm) => {
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [firstSelectedTimeRange, setFirstSelectedTimeRange] = useState({});
  const [secondSelectedTimeRange, setSecondSelectedTimeRange] = useState({});
  const [savedDaysTimes, setSavedDaysTimes] = useState<{}[]>([]);
  const [addTimeRange, setAddTimeRange] = useState(false);

  // Moment stored in variable to reset the value of TimeRangPiker
  const [firstTimeMoment, setFirstTimeMoment] = useState([]);
  const [secondTimeMoment, setSecondTimeMoment] = useState([]);

  const onFinish = (values: any) => {
    let formInput;
    if (Object.keys(firstSelectedTimeRange).length && !savedDaysTimes.length) {
      formInput = {
        name: values.Name,
        date: selectedDate,
        schedule: [{ day: selectedDay, time: [firstSelectedTimeRange] }],
      };
    }
    if (!selectedDay.length && savedDaysTimes.length) {
      formInput = {
        name: values.Name,
        date: selectedDate,
        schedule: savedDaysTimes,
      };
    }
    if (Object.keys(firstSelectedTimeRange).length && savedDaysTimes.length) {
      if (Object.keys(secondSelectedTimeRange).length) {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: savedDaysTimes.concat({
            day: selectedDay,
            time: [firstSelectedTimeRange, secondSelectedTimeRange],
          }),
        };
      } else {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: savedDaysTimes.concat({
            day: selectedDay,
            time: [firstSelectedTimeRange],
          }),
        };
      }
    }
    handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // save the first selected Time range
  const onFirstTimeRangePiker = useCallback((time: any, timeString: any) => {
    const newValue = {
      start: timeString[0],
      end: timeString[1],
    };
    setFirstTimeMoment(time);
    setFirstSelectedTimeRange({ ...newValue });
  }, []);

  // save the second selected Time range
  const onSecondTimeRangePiker = useCallback((time: any, timeString: any) => {
    const newValue = {
      start: timeString[0],
      end: timeString[1],
    };
    setSecondTimeMoment(time);
    setSecondSelectedTimeRange({ ...newValue });
  }, []);

  // save the selectedDays
  const daySelect = useCallback((value: any) => {
    setSelectedDay(value);
  }, []);

  // save the selected Date range
  const onDateRangePicker = useCallback((time: any, dateString: any) => {
    setSelectedDate(dateString);
  }, []);

  // Click on save date button
  const saveSelectedDate = useCallback(() => {
    if (Object.keys(secondSelectedTimeRange).length) {
      //@ts-ignore
      setSavedDaysTimes((prev) => {
        return [
          ...prev,
          {
            day: selectedDay,
            time: [firstSelectedTimeRange, secondSelectedTimeRange],
          },
        ];
      });
    } else {
      //@ts-ignore
      setSavedDaysTimes((prev: any) => {
        return [
          ...prev,
          {
            day: selectedDay,
            time: [firstSelectedTimeRange],
          },
        ];
      });
    }
    setSelectedDay([]);
    setFirstTimeMoment([]);
    setSecondTimeMoment([]);
    setFirstSelectedTimeRange({});
    setSecondSelectedTimeRange({});
    setAddTimeRange(false);
  }, [selectedDay, firstSelectedTimeRange, secondSelectedTimeRange]);

  // Delete the Timeplan
  const deleteAddetTime = useCallback(
    (i: number) => {
      const result = savedDaysTimes.filter(
        (el: any, index: number) => index !== i
      );
      setSavedDaysTimes(result);
    },
    [savedDaysTimes]
  );

  return (
    <Card bordered={true}>
      <Collapse>
        <Panel header="Stop sequence save form" key="1">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              {...tailLayout}
              label="Name"
              name="Name"
              rules={[{ required: true, message: "Please give a Name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="Date"
              name="Date"
              rules={[
                { required: true, message: "Please give a Date interval" },
              ]}
            >
              <DatePicker.RangePicker onChange={onDateRangePicker} />
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="Day"
              name="Day"
              rules={[{ required: true, message: "Please give a day" }]}
            >
              <Checkbox.Group
                style={{ width: "80%" }}
                onChange={daySelect}
                value={selectedDay}
              >
                <Row>
                  <Col span={3}>
                    <Checkbox value="monday">Mo</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="tuesday">Tu</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="wednesday">We</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="thursday">Th</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="friday">Fr</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="saturday">Sa</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="sunday">Su</Checkbox>
                  </Col>
                  <Col span={3}>
                    <Checkbox value="holiday" style={{ width: "80px" }}>
                      Holiday
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              {...tailLayout}
              label="Time"
              name="Time"
              rules={
                !savedDaysTimes.length &&
                !Object.keys(firstSelectedTimeRange).length
                  ? [
                      {
                        required: true,
                        message: "Please give a Valid time",
                      },
                    ]
                  : undefined
              }
            >
              <RangePicker
                format="HH:mm"
                onChange={onFirstTimeRangePiker}
                //@ts-ignore
                value={
                  Object.keys(firstSelectedTimeRange).length
                    ? firstTimeMoment
                    : null
                }
                disabled={selectedDay.length ? false : true}
              />
              <Button
                onClick={() => {
                  setAddTimeRange(!addTimeRange);
                  if (addTimeRange) {
                    setSecondTimeMoment([]);
                    setSecondSelectedTimeRange({});
                  }
                }}
                disabled={
                  Object.keys(firstSelectedTimeRange).length ? false : true
                }
              >
                {addTimeRange ? <MinusOutlined /> : <PlusOutlined />}
              </Button>
              {addTimeRange && (
                <RangePicker
                  format="HH:mm"
                  onChange={onSecondTimeRangePiker}
                  //@ts-ignore
                  value={
                    Object.keys(secondSelectedTimeRange).length
                      ? secondTimeMoment
                      : null
                  }
                  disabled={selectedDay.length ? false : true}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "63px",
                  paddingTop: "10px",
                }}
              >
                <Button
                  type="primary"
                  onClick={saveSelectedDate}
                  disabled={
                    selectedDay.length &&
                    Object.keys(firstSelectedTimeRange).length
                      ? false
                      : true
                  }
                >
                  Save Days and Time
                </Button>
              </div>
            </Form.Item>
            <Form.Item {...tailLayout}>
              {savedDaysTimes &&
                savedDaysTimes.map((el: any, i: number) => (
                  <div key={i} className="timePicked">
                    <div>
                      {el.day.length === 1 ? (
                        <p>{el.day[0]}</p>
                      ) : (
                        <p>
                          {el.day[0]}
                          {"-"}
                          {el.day[el.day.length - 1]}
                        </p>
                      )}
                    </div>
                    <div>
                      {el.time.map((el: any, index: number) => (
                        <p key={index}>
                          {"From "}
                          {el.start}
                          {" To "}
                          {el.end}
                        </p>
                      ))}
                    </div>
                    <Button onClick={() => deleteAddetTime(i)}>
                      <CloseOutlined />
                    </Button>
                  </div>
                ))}
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={stateDND.trajekt.items.length ? false : true}
              >
                {stateDND.trajekt.items.length
                  ? " save the stop sequence"
                  : "stop sequence required"}
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default React.memo(SaveStopsSequenceForm);
