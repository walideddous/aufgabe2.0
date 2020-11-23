import React, { useState, Fragment, useEffect, useMemo } from "react";
import {
  Card,
  Form,
  Input,
  TimePicker,
  Button,
  DatePicker,
  Collapse,
  Select,
  Tag,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

// import utils function
import { getFormatTags, getFormatTags1 } from "../../utils/getFormatTags";
// import types
import { TstateDND } from "../../types/types";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

interface Tprops {
  stateDND: TstateDND;
  saveStopSequence: (formData: any) => void;
}

const SaveStopSequenceForm = ({ stateDND, saveStopSequence }: Tprops) => {
  const [form] = Form.useForm();
  const [addSchedule, setAddSchedule] = useState(false);
  const [tags, setTags] = useState([]);

  const [savedForm, setSavedForm] = useState<{
    name: string;
    schedule: {
      date: string;
      dayTime: {
        day: string[];
        time: string[];
      }[];
    }[];
  }>();

  useEffect(() => {
    if (savedForm?.schedule.length) {
      console.log("useEffect", getFormatTags1(savedForm));

      getFormatTags1(savedForm).then((data: any) => setTags(data));
    }
  }, [savedForm]);

  console.log(tags);

  const onFinish = (values: any) => {
    const data = {
      date: `${values.date[0].format("YYYY.MM.DD")}-${values.date[1].format(
        "YYYY.MM.DD"
      )}`,
      dayTime: values.timeList.map((element: any) => {
        return {
          day: values.day,
          time: [
            element.time[0].format("HH:mm"),
            element.time[1].format("HH:mm"),
          ],
        };
      }),
    };
    setSavedForm((prev: any) => {
      if (prev) {
        return {
          ...prev,
          name: values.name,
          schedule: prev.schedule.concat(data),
        };
      } else {
        return {
          name: values.name,
          schedule: [{ ...data }],
        };
      }
    });

    form.resetFields(["date", "day", "time"]);
  };

  const [name, setName] = useState("");
  const [date, setDate] = useState<any>();
  const [day, setDay] = useState<any>();
  const [time, setTime] = useState<any>();

  const handleNameChange = (e: any) => {
    const { value } = e.target;
    setName(value);
  };

  const handleDateChange = (date: any, dateString: string[]) => {
    setDate(dateString);
  };

  const handleDayChange = (days: any) => {
    setDay(days);
  };

  const handleTimeChange = (time: any, timeString: string[]) => {
    setTime(timeString);
  };

  return (
    <Card bordered={true}>
      <Collapse defaultActiveKey="1">
        <Panel header="Stop sequence save form" key="1">
          <Form
            autoComplete="off"
            id="formWrapper"
            layout="vertical"
            name="dynamic_form_nest_item"
            requiredMark={false}
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please give a Name" }]}
            >
              <Input
                id="name_input"
                value={name}
                onChange={handleNameChange}
                allowClear
              />
            </Form.Item>
            {!addSchedule && (
              <div style={{ paddingBottom: "20px" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddSchedule(true);
                  }}
                  id="addSchedule_button"
                >
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
                  <DatePicker.RangePicker
                    id="date_input"
                    value={date}
                    onChange={handleDateChange}
                  />
                </Form.Item>
                <Form.Item
                  id="dayPicker_form"
                  label="Day"
                  name="day"
                  rules={[{ required: true, message: "Please give a day" }]}
                >
                  <Select
                    allowClear
                    id="dayPicker_input"
                    mode="tags"
                    value={day}
                    onChange={handleDayChange}
                  >
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
                <Form.List name="timeList">
                  {(fields, { add, remove }) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p>Time</p>
                      <div style={{ display: "flex" }}>
                        <Form.Item>
                          <Button
                            id="addTime_button"
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Add time
                          </Button>
                        </Form.Item>
                        <div>
                          {fields.map((field) => (
                            <Space
                              key={field.key}
                              style={{ display: "flex" }}
                              align="baseline"
                            >
                              <Form.Item
                                {...field}
                                name={[field.name, "time"]}
                                fieldKey={[field.fieldKey, "time"]}
                                rules={[
                                  { required: true, message: "Missing time" },
                                ]}
                              >
                                <RangePicker
                                  format="HH:mm"
                                  id="timePicker_input"
                                />
                              </Form.Item>
                              <MinusCircleOutlined
                                id="remove_timePicker"
                                onClick={() => remove(field.name)}
                              />
                            </Space>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Form.List>
                <Form.Item>
                  <Button id="save_schedule" type="primary" htmlType="submit">
                    Save schedule
                  </Button>
                  <Button
                    type="dashed"
                    id="cancel_button"
                    onClick={() => {
                      setAddSchedule(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Fragment>
            )}
            <Collapse
              defaultActiveKey={tags.length ? "2" : "3"}
              activeKey={tags.length ? "2" : undefined}
            >
              <Panel header="Stop sequence schedule" key="2">
                <div
                  id="time_result"
                  style={{ height: "200px", overflowY: "auto" }}
                >
                  {tags &&
                    tags.map((tag: any, index: number) => (
                      <Fragment key={index}>
                        <h3>{tag.date}</h3>
                        <Fragment>
                          {tag.displayedtags.map(
                            (el: string, indexTag: number) => (
                              <Tag key={indexTag} closable>
                                {el}
                              </Tag>
                            )
                          )}
                        </Fragment>
                      </Fragment>
                    ))}
                </div>
                <Button
                  type="primary"
                  id="save_stopSequence"
                  disabled={
                    tags.length && stateDND.trajekt.items.length ? false : true
                  }
                  onClick={() => {
                    if (tags.length && stateDND.trajekt.items.length) {
                      saveStopSequence({
                        ...savedForm,
                      });
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  type="dashed"
                  id="clear_all"
                  disabled={tags.length ? false : true}
                  onClick={() => {
                    if (tags.length) {
                      setTags([]);
                    }
                  }}
                >
                  Clear all
                </Button>
              </Panel>
            </Collapse>
          </Form>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default React.memo(SaveStopSequenceForm);
