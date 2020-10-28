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
  Select,
  Table,
  Tag,
} from "antd";

import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

// Import types
import { TstateDND } from "../type/Types";

// Declare Props Types
interface TpropsForm {
  stateDND: TstateDND;
  currentStopSequence: any;
  handleDeleteStopSequence: (id: string) => void;
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

const SaveStopsSequenceForm = ({
  stateDND,
  currentStopSequence,
  handleDeleteStopSequence,
  handleSaveStopSequence,
}: TpropsForm) => {
  const [addSchedule, setAddSchedule] = useState(false);
  const [savedDaysTimes, setSavedDaysTimes] = useState<{}[] | undefined>([]);
  const [savedForm, setSavedForm] = useState({
    name: "",
    period: [],
  });
  const [form] = Form.useForm();

  useEffect(() => {
    setSavedDaysTimes(currentStopSequence.schedule);
    setSavedForm(currentStopSequence);
  }, [currentStopSequence]);

  const onFinish = (values: any) => {
    const format = {
      date: [
        values.Date[0].toString().split(" ").slice(1, 4).join(" "),
        values.Date[1].toString().split(" ").slice(1, 4).join(" "),
      ],
      day: values.Day,
      time: values.time.map((el: any) => {
        return {
          start: el.timePicker[0].toString().split(" ")[4].substring(0, 5),
          end: el.timePicker[1].toString().split(" ")[4].substring(0, 5),
        };
      }),
    };
    setSavedDaysTimes((prev) => {
      if (prev) {
        return prev.concat({ ...format });
      } else {
        return [{ ...format }];
      }
    });

    setSavedForm((prev: any) => {
      console.log("prev Value", prev);
      return {
        ...prev,
        name: values.Name,
        ...format,
      };
    });
    setAddSchedule(false);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const hanldeAddSchedule = () => {
    setAddSchedule(true);
  };

  const handleCancelSchedule = () => {
    setAddSchedule(false);
  };

  const tags2 = [
    "All days 07:00 - 12:00",
    "Mon-Fri 13:00 - 14:00",
    "Mon-Fri 17:00 - 18:00",
    "Mon-Fri 07:00 - 12:00 14:00 - 18:00",
    "Holiday 07:00 -12:00",
    "Sat 07:00 - 12:00",
    "Mon-Fri 07:00 - 12:00",
    "Mon-Sun 07:00 -12:00",
    "Mon-Fri 07:00 - 12:00 14:00 - 18:00",
    "Wen-Sun,Holiday 07:00 -12:00",
    "Sat 07:00 - 12:00",
  ];

  const [tags, setTags] = useState<string[] | undefined>([]);

  useEffect(() => {
    // function to create a table of string to display Tags
    const tagDisplay = (savedDaysTimes: any) => {
      const { day, time } = savedDaysTimes;
      if (time && time.length > 1 && day && day.length > 1) {
        let tab: string[] = [];
        for (let i = 0; i < time.length; i++) {
          tab[i] = `${day[0]} - ${day[day.length - 1]} ${time[i].start}-${
            time[i].end
          }`;
        }
        return tab;
      }
    };
    if (savedDaysTimes && savedDaysTimes) {
      const result = tagDisplay(savedDaysTimes);
      setTags(result);
    }
  }, [savedDaysTimes]);

  console.log("tags", tags);
  console.log("savedDaysTimes", savedDaysTimes);

  return (
    <Card bordered={true}>
      <Collapse defaultActiveKey="1">
        <Panel header="Stop sequence save form" key="1">
          <Form
            layout="vertical"
            name="basic"
            requiredMark={false}
            initialValues={{ remember: true }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Name"
              name="Name"
              rules={[{ required: true, message: "Please give a Name" }]}
            >
              <Input placeholder={currentStopSequence.name} allowClear />
            </Form.Item>
            {!addSchedule && (
              <div style={{ paddingBottom: "20px" }}>
                <Button type="primary" onClick={hanldeAddSchedule}>
                  Add schedule
                </Button>
              </div>
            )}
            {addSchedule && (
              <Fragment>
                <Form.Item
                  label="Date"
                  name="Date"
                  rules={[
                    { required: true, message: "Please give a Date interval" },
                  ]}
                >
                  <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item
                  label="Day"
                  name="Day"
                  rules={[{ required: true, message: "Please give a day" }]}
                >
                  <Select allowClear mode="tags" style={{ width: "100%" }}>
                    <Option key="1" value="Mon">
                      Monday
                    </Option>
                    <Option key="2" value="Tue">
                      Tuesday
                    </Option>
                    <Option key="3" value="Wed">
                      Wednesday
                    </Option>
                    <Option key="4" value="Thu">
                      Thursday
                    </Option>
                    <Option key="5" value="Fri">
                      Friday
                    </Option>
                    <Option key="6" value="Sat">
                      Saturday
                    </Option>
                    <Option key="7" value="Sun">
                      Sunday
                    </Option>
                    <Option key="8" value="Holiday">
                      Holiday
                    </Option>
                  </Select>
                </Form.Item>
                <Form.List name="time">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{ display: "flex" }}>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Add time
                        </Button>
                        <div>
                          {fields.map((field) => (
                            <Space
                              key={field.key}
                              style={{
                                display: "flex",
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
                                <RangePicker format="HH:mm" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                              />
                            </Space>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </Form.List>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save schedule
                  </Button>
                  <Button type="dashed" onClick={handleCancelSchedule}>
                    Cancel
                  </Button>
                </Form.Item>
              </Fragment>
            )}
            {savedDaysTimes &&
              savedDaysTimes.map((el: any) => (
                <Collapse defaultActiveKey="2">
                  <Panel header="Stop sequence schedule" key="2">
                    <div style={{ height: "200px", overflowY: "auto" }}>
                      <h3>
                        {el.date[0]}
                        {"-"}
                        {el.date[1]}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {tags2 &&
                          tags2.map((el: string, index: number) => (
                            <Tag
                              closable
                              key={index}
                              style={{
                                minWidth: "253px",
                              }}
                            >
                              {el}
                            </Tag>
                          ))}
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              ))}
          </Form>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "10px",
            }}
          >
            <Button
              type="primary"
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

/*
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
*/

/*
  const columns1 = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <div style={{ display: "flex" }}>
          <Button type="primary">Edit</Button>
          <Button type="dashed">Delete</Button>
        </div>
      ),
    },
  ];
  const data1 = [
    {
      key: 1,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 2,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 3,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 4,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 5,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 6,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 7,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 8,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 9,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
    {
      key: 10,
      date: "From 2020-10-16 To 2020-11-27",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
      time: "07:00-12:00",
    },
  ];

  const columns2 = [
    { title: "Period", dataIndex: "period", key: "period" },
    { title: "Day", dataIndex: "day", key: "day" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <Button type="dashed">Delete</Button>,
    },
  ];
  const data2 = [
    {
      key: 1,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 2,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 3,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 4,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 5,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 6,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 7,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 8,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 9,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 10,
      period: "From 2020-10-16 07:00 To 2020-11-27 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
  ];

  const columns3 = [
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <Button type="dashed">Delete</Button>,
    },
  ];
  const data3 = [
    {
      key: 1,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 2,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 3,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 4,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 5,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 6,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 7,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 8,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 9,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
    {
      key: 10,
      time: "From 07:00 To 12:00",
      day: "Mo-Tu-We-Th-Fr-Sa-Su-Holiday",
    },
  ];

            {savedDaysTimes && (
              <Collapse defaultActiveKey="1">
                <Panel header="Stop sequence schedule" key="2">
                  <Table
                    columns={columns1}
                    dataSource={data1}
                    style={{ height: "370px", overflowY: "auto" }}
                  />
                </Panel>
              </Collapse>
            )}
            {savedDaysTimes && (
              <Collapse defaultActiveKey="1">
                <Panel header="Stop sequence schedule" key="2">
                  <Table
                    columns={columns2}
                    dataSource={data2}
                    style={{ height: "370px", overflowY: "auto" }}
                  />
                </Panel>
              </Collapse>
            )}
            {savedDaysTimes && (
              <Collapse defaultActiveKey="1">
                <Panel header="Stop sequence schedule" key="2">
                  <Table
                    size="small"
                    pagination={false}
                    columns={columns3}
                    dataSource={data3}
                    title={() => "From 2020-10-16 To 2020-11-27"}
                    style={{ height: "370px", overflowY: "auto" }}
                  />
                </Panel>
              </Collapse>
            )}



*/
