import React, { useState, useCallback, Fragment, useEffect } from "react";
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
import { getFormatTags } from "../../utils/getFormatTags";
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
  const [name, setName] = useState("");
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
      setSavedForm(currentStopSequence);
    } else {
      setSavedForm({ name: "", schedule: [] });
    }
  }, [currentStopSequence]);

  useEffect(() => {
    if (savedForm?.schedule.length) {
      const savedFormFormated = getFormatTags(savedForm);
      setTags(savedFormFormated);
    } else {
      setTags([]);
    }
  }, [savedForm]);

  const onFinish = (values: any) => {
    let { name, date, day, time, timeList } = values;

    // To refactor the data
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
        if (prev.schedule.filter((el: any) => el.date === data.date).length) {
          const sameDateIndex = prev.schedule
            .map((el: any) => el.date)
            .indexOf(data.date);
          return {
            ...prev,
            name: name,
            schedule: prev.schedule.map((el: any, index: number) => {
              if (sameDateIndex === index) {
                return {
                  ...el,
                  dayTime: el.dayTime.concat(data.dayTime),
                };
              } else {
                return el;
              }
            }),
          };
        } else {
          return {
            ...prev,
            name: name,
            schedule: prev.schedule.concat(data),
          };
        }
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

  const handleNameChange = (e: any) => {
    const { value } = e.target;
    setName(value);
  };

  const handleDeleteTags = useCallback(
    (tagsIndex: number, displayedTagsIndex: number) => {
      setSavedForm((prevValues: any) => {
        if (
          prevValues.schedule[tagsIndex] &&
          prevValues.schedule[tagsIndex].dayTime.length
        ) {
          if (prevValues.schedule[tagsIndex].dayTime.length === 1) {
            return {
              name: prevValues.name,
              schedule: prevValues.schedule.filter(
                (el: any, index: number) => index !== tagsIndex
              ),
            };
          } else {
            return {
              name: prevValues.name,
              schedule: prevValues.schedule.map((el: any, index: number) => {
                if (index === tagsIndex) {
                  return {
                    ...el,
                    dayTime: el.dayTime.filter(
                      (el: any, indexFilter: number) =>
                        indexFilter !== displayedTagsIndex
                    ),
                  };
                } else {
                  return el;
                }
              }),
            };
          }
        }
      });
    },
    []
  );

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
                placeholder="Enter stop sequence name"
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
                  <DatePicker.RangePicker id="date_input" />
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
                  name && currentStopSequence.name && tags.length
                    ? `${name} schedule`
                    : name && !currentStopSequence.name && tags.length
                    ? `${name} schedule`
                    : !name && currentStopSequence.name && tags.length
                    ? `${currentStopSequence.name} schedule`
                    : "Stop sequence schedule"
                }
                key="2"
              >
                <div
                  id="time_result"
                  style={{
                    height: "200px",
                    overflowY: "auto",
                    paddingBottom: "20px",
                  }}
                >
                  {tags &&
                    tags.map((tag: any, tagsIndex: number) => {
                      return (
                        <Fragment key={tagsIndex}>
                          <h3>{tag.date}</h3>
                          <Fragment>
                            {tag.displayedTags.map(
                              (el: string, displayedTagsIndex: number) => (
                                <Tag
                                  visible={true}
                                  closable={true}
                                  id={`dayTime_tags${displayedTagsIndex}`}
                                  key={tagsIndex + displayedTagsIndex}
                                  onClose={() => {
                                    handleDeleteTags(
                                      tagsIndex,
                                      displayedTagsIndex
                                    );
                                  }}
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
                    tags.length &&
                    stateDND.trajekt.items.length &&
                    JSON.stringify({
                      ...savedForm,
                      name: name !== "" ? name : savedForm?.name,
                      stopSequence: stateDND.trajekt.items,
                    }) !== JSON.stringify(currentStopSequence)
                      ? false
                      : true
                  }
                  onClick={() => {
                    if (
                      tags.length &&
                      stateDND.trajekt.items.length &&
                      currentStopSequence.name
                    ) {
                      saveStopSequence({
                        ...savedForm,
                        name: currentStopSequence.name,
                      });
                    } else {
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
