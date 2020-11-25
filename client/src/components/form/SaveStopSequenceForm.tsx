import React, { useState, Fragment, useEffect } from "react";
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
import { getFormatTags1 } from "../../utils/getFormatTags";
// import types
import { TstateDND } from "../../types/types";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

interface Tprops {
  stateDND: TstateDND;
  currentStopSequence: any;
  loadStopSequenceSection: boolean;
  saveStopSequence: (formData: any) => void;
}

const SaveStopSequenceForm = ({
  stateDND,
  currentStopSequence,
  loadStopSequenceSection,
  saveStopSequence,
}: Tprops) => {
  const [form] = Form.useForm();
  const [addSchedule, setAddSchedule] = useState(false);
  const [tags, setTags] = useState<
    {
      date: string;
      displayedTags: string[];
    }[]
  >([]);

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
    if (Object.keys(currentStopSequence).length) {
      const dataToSave = {
        name: currentStopSequence.name,
        schedule: currentStopSequence.schedule,
      };
      setSavedForm(dataToSave);
    } else {
      setSavedForm({ name: "", schedule: [] });
    }
  }, [currentStopSequence]);

  useEffect(() => {
    if (savedForm?.schedule.length) {
      const savedFormFormated = getFormatTags1(savedForm);
      setTags(savedFormFormated);
    } else {
      setTags([]);
    }
  }, [savedForm]);

  const onFinish = (values: any) => {
    console.log("values", values);
    let { name, date, day, time, timeList } = values;

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

    const data = {
      date: `${date[0].format("YYYY.MM.DD")}-${date[1].format("YYYY.MM.DD")}`,
      dayTime: timeList.map((element: any) => {
        return {
          day: day,
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
          name: name,
          schedule: prev.schedule.concat(data),
        };
      } else {
        return {
          name: name,
          schedule: [{ ...data }],
        };
      }
    });
    // Force the timeList to reset
    form.setFieldsValue({
      timeList: [],
    });

    form.resetFields(["date", "day", "time"]);
  };

  const [name, setName] = useState("");
  const [date, setDate] = useState<any>();
  const [day, setDay] = useState<any>();

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

  console.log("tags", tags);
  console.log("savedForm", savedForm);

  return (
    <Card bordered={true}>
      <Collapse
        activeKey={
          !Object.keys(currentStopSequence).length && loadStopSequenceSection
            ? "2"
            : "1"
        }
      >
        <Panel header="Stop sequence save form" key="1">
          <Form
            autoComplete="off"
            id="formWrapper"
            layout="vertical"
            requiredMark={false}
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Missing name" }]}
            >
              <Input
                id="name_input"
                placeholder="Enter the stop sequence name"
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
                  rules={[{ required: true, message: "Missing date" }]}
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
                  rules={[{ required: true, message: "Missing day" }]}
                >
                  <Select
                    allowClear
                    placeholder="Select day"
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
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  <Form.Item
                    name="time"
                    label="Time"
                    rules={[
                      {
                        required: true,
                        message: "Missing time",
                      },
                    ]}
                  >
                    <RangePicker format="HH:mm" id="timePicker_input" />
                  </Form.Item>
                  <Form.List name="timeList">
                    {(fields, { add, remove }) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            paddingTop: "30px",
                          }}
                        >
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
                                <Form.Item name={[field.name, "time"]}>
                                  <RangePicker
                                    format="HH:mm"
                                    id={`timePicker_input${field.name}`}
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
                      );
                    }}
                  </Form.List>
                </div>
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
            <Collapse activeKey={tags.length ? "2" : ""}>
              <Panel
                header={
                  currentStopSequence.name && tags.length
                    ? `${currentStopSequence.name} schedule`
                    : "Stop sequence schedule"
                }
                key="2"
              >
                <div
                  id="time_result"
                  style={{ height: "200px", overflowY: "auto" }}
                >
                  {tags &&
                    tags.map((tag: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <h3>{tag.date}</h3>
                          <Fragment>
                            {tag.displayedTags.map(
                              (el: string, indexTag: number) => (
                                <Tag
                                  id={`dayTime_tags${indexTag}`}
                                  key={indexTag}
                                  closable
                                  onClose={() => {}}
                                >
                                  {el}
                                </Tag>
                              )
                            )}
                          </Fragment>
                        </Fragment>
                      );
                    })}
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
                        name,
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
                    setTags([]);
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
