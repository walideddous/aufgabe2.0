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

import React, { useCallback, useState, useEffect, Fragment } from "react";
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
  Space,
  Descriptions,
} from "antd";

import {
  PlusOutlined,
  CloseOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

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
  handleDeleteStopSequence: (id: string) => void;
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;
const { Panel } = Collapse;

const SaveStopsSequenceForm = ({
  stateDND,
  currentStopSequence,
  handleDeleteStopSequence,
  handleSaveStopSequence,
}: TpropsForm) => {
  const [selectedDay, setSelectedDay] = useState([]);
  const [savedDaysTimes, setSavedDaysTimes] = useState<{}[]>([]);
  const [savedForm, setSavedForm] = useState({
    name: "",
    date: [],
    schedule: [],
  });
  const [days, setDays] = useState([]);
  const [timePicker, setTimePicker] = useState([{}]);

  useEffect(() => {
    setSavedDaysTimes(currentStopSequence.schedule);
    setSavedForm(currentStopSequence);
  }, [currentStopSequence]);

  const onFinish = (values: any) => {
    console.log("values", values);
    setSavedForm((prev: any) => {
      return {
        ...prev,
        name: values.Name,
        date: [
          values.Date[0].toString().split(" ").slice(1, 4).join(" "),
          values.Date[1].toString().split(" ").slice(1, 4).join(" "),
        ],
        schedule: prev.schedule.push({
          day: values.Day,
          time: values.time.map((el: any) => {
            return {
              start: el.timePicker[0].toString().split(" ")[4],
              end: el.timePicker[1].toString().split(" ")[4],
            };
          }),
        }),
      };
    });
  };

  console.log("savedForm", savedForm);

  const onSave = useCallback(() => {
    handleSaveStopSequence(savedForm);
  }, [savedForm]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

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

  const datePicker = (date: any, dateString: any) => {
    console.log(date, dateString);
    setTimePicker((prev: any) => {
      return prev.concat({
        start: dateString[0],
        end: dateString[1],
      });
    });
  };

  const handleCheckBox = (data: any) => {
    setDays(data);
  };

  return (
    <Card bordered={true}>
      <Collapse defaultActiveKey="1">
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
              <Input placeholder={currentStopSequence.name} />
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="Date"
              name="Date"
              rules={[
                { required: true, message: "Please give a Date interval" },
              ]}
            >
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item
              {...tailLayout}
              label="Day"
              name="Day"
              rules={[{ required: true, message: "Please give a day" }]}
            >
              <Checkbox.Group
                style={{ width: "80%" }}
                onChange={handleCheckBox}
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
            <Form.List name="time">
              {(fields, { add, remove }) => (
                <>
                  <Form.Item {...tailLayout} label="Time" name="Time">
                    <div style={{ display: "flex" }}>
                      <div>
                        {fields.map((field) => (
                          <Space
                            key={field.key}
                            style={{
                              display: "flex",
                              marginBottom: "5px",
                              marginRight: "10px",
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "timePicker"]}
                              fieldKey={[field.fieldKey, "timePicker"]}
                              rules={[
                                { required: true, message: "Missing time" },
                              ]}
                            >
                              <RangePicker
                                format="HH:mm"
                                onChange={datePicker}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        ))}
                      </div>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add time
                      </Button>
                    </div>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item {...tailLayout}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "63px",
                  paddingTop: "10px",
                }}
              >
                <Button type="primary" htmlType="submit">
                  Save Days and Time
                </Button>
              </div>
              <Descriptions title="Stop sequence info" bordered>
                {savedDaysTimes &&
                  savedDaysTimes.map((el: any, i: number) => (
                    <Fragment>
                      <Descriptions.Item label="Day" key={i}>
                        {el.day.length === 1 ? (
                          <p>{el.day[0]}</p>
                        ) : (
                          <p>
                            {el.day[0]}
                            {"-"}
                            {el.day[el.day.length - 1]}
                          </p>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Time">
                        {el.time.map((el: any, index: number) => (
                          <p key={index}>
                            {"From "}
                            {el.start}
                            {" To "}
                            {el.end}
                          </p>
                        ))}
                      </Descriptions.Item>
                      <Descriptions.Item>
                        <Button onClick={() => deleteAddetTime(i)}>
                          <CloseOutlined />
                        </Button>
                      </Descriptions.Item>
                    </Fragment>
                  ))}
              </Descriptions>
            </Form.Item>
          </Form>
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
              onClick={onSave}
              disabled={stateDND.trajekt.items.length ? false : true}
            >
              {stateDND.trajekt.items.length
                ? " Save"
                : "Stop sequence required"}
            </Button>
            <Button
              type="primary"
              style={{
                marginLeft: "10px",
              }}
              danger
              disabled={Object.keys(currentStopSequence).length ? false : true}
              onClick={() => {
                if (
                  window.confirm(
                    "You really want to delete the stop sequence ?"
                  )
                ) {
                  handleDeleteStopSequence(currentStopSequence._id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default React.memo(SaveStopsSequenceForm);
