import React, { useState, Fragment } from "react";
import {
  Card,
  Form,
  Input,
  TimePicker,
  Button,
  DatePicker,
  Collapse,
  Space,
  Select,
  Tag,
} from "antd";
import moment from "moment";

import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

const SaveStopsSequenceForm = () => {
  // get this form to clear the input form after submit
  const [form] = Form.useForm();

  const [addSchedule, setAddSchedule] = useState(false);
  const [savedPeriod, setSavedPeriod] = useState<{}[] | undefined>([]);
  const [tags, setTags] = useState<{ date: string; displayedtags: [] }[]>([
    {
      date: "",
      displayedtags: [],
    },
  ]);

  const onFinish = (values: any) => {
    const format = {
      date: `${moment(values.date[0]).format("YYYY.MM.DD")} - ${moment(
        values.date[1]
      ).format("YYYY.MM.DD")}`,
      dayTime: [
        {
          day: values.day,
          time: values.time.map((el: any) => {
            return [
              moment(el.timePicker[0]).format("hh:mm"),
              moment(el.timePicker[1]).format("hh:mm"),
            ];
          }),
        },
      ],
    };

    setSavedPeriod((prev) => {
      if (prev) {
        return prev.concat({ ...format });
      } else {
        return [{ ...format }];
      }
    });

    const formatTags = {
      date: `${moment(values.date[0]).format("YYYY.MM.DD")} - ${moment(
        values.date[1]
      ).format("YYYY.MM.DD")}`,
      displayedtags: values.time.map((el: any) => {
        if (values.day.length === 8) {
          return `All days ${moment(el.timePicker[0]).format(
            "hh:mm"
          )} - ${moment(el.timePicker[1]).format("hh:mm")}`;
        } else if (values.day.length === 1) {
          return `${values.day[0]} ${moment(el.timePicker[0]).format(
            "hh:mm"
          )} - ${moment(el.timePicker[1]).format("hh:mm")}`;
        } else {
          return `${values.day[0]} - ${
            values.day[values.day.length - 1]
          } ${moment(el.timePicker[0]).format("hh:mm")} - ${moment(
            el.timePicker[1]
          ).format("hh:mm")}`;
        }
      }),
    };

    setTags((prev: any) => {
      if (prev) {
        return prev.concat({ ...formatTags });
      } else {
        return [{ ...formatTags }];
      }
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
              name="name"
              rules={[{ required: true, message: "Please give a Name" }]}
            >
              <Input allowClear />
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
                  name="date"
                  rules={[
                    { required: true, message: "Please give a Date interval" },
                  ]}
                >
                  <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item
                  label="Day"
                  name="day"
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
            {tags && (
              <Collapse defaultActiveKey="3">
                <Panel header="Stop sequence schedule" key="2">
                  <div style={{ height: "200px", overflowY: "auto" }}>
                    {tags.map((el: any, index: number) => (
                      <div key={index}>
                        <h3>{el.date}</h3>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginBottom: "0.5em",
                          }}
                        >
                          {el.displayedtags &&
                            el.displayedtags.map(
                              (el: string, index: number) => (
                                <Tag
                                  closable
                                  key={index}
                                  style={{
                                    minWidth: "253px",
                                  }}
                                >
                                  {el}
                                </Tag>
                              )
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </Collapse>
            )}
          </Form>
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
        if (prev.map((el: any) => el.date).indexOf(formatTags.date) >= 0) {
          const index = prev.map((el: any) => el.date).indexOf(formatTags.date);
          return prev[index].displayedtags.concat(formatTags.displayedtags);
        } else {
        }
*/
