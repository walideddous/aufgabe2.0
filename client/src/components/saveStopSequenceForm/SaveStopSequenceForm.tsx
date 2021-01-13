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

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

interface Tprops {
  formInformation: any;
  loadStopSequenceSection: boolean;
  saveForm: (formData: any) => void;
  deleteSchedule: () => void;
}

const SaveStopSequenceForm = ({
  loadStopSequenceSection,
  formInformation,
  saveForm,
  deleteSchedule,
}: Tprops) => {
  const [form] = Form.useForm();
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [addSchedule, setAddSchedule] = useState<boolean>(false);
  const [tags, setTags] = useState<
    {
      date: string;
      displayedTags: string[];
    }[]
  >([]);

  const [savedForm, setSavedForm] = useState<{
    name: string;
    desc: string;
    schedule: {
      from: string;
      to: string;
      timeSlices: {
        weekDays: string[];
        startTime: string;
        endTime: string;
      }[];
    }[];
  }>();

  useEffect(() => {
    if (formInformation) {
      const { name, desc, schedule } = formInformation;
      setSavedForm({ name, desc, schedule });
      form.setFieldsValue({
        name: formInformation.name,
        desc: formInformation.desc,
      });
    } else {
      setSavedForm({ name: "", desc: "", schedule: [] });
      form.setFieldsValue({
        name: "",
        desc: "",
      });
    }
  }, [formInformation, form]);

  useEffect(() => {
    if (savedForm && savedForm.schedule) {
      const savedFormFormated = getFormatTags(savedForm);
      setTags(savedFormFormated);
    } else {
      setTags([]);
    }
  }, [savedForm]);

  const onFinish = (values: any) => {
    let { name, date, day, time, timeList, desc } = values;

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
      from: `${date[0].format("DD-MM-YYYY")}`,
      to: `${date[1].format("DD-MM-YYYY")}`,
      timeSlices: timeList.map((element: any) => {
        return {
          weekDays: day,
          startTime: element.time[0].format("HH:mm"),
          endTime: element.time[1].format("HH:mm"),
        };
      }),
    };

    setSavedForm((prev: any) => {
      if (prev && prev.schedule) {
        if (
          prev.schedule.filter(
            (el: any) => el.from === data.from && el.to === data.to
          ).length
        ) {
          const sameDateIndex = prev.schedule
            .map((el: any) => `${el.from} ${el.to}`)
            .indexOf(`${data.from} ${data.to}`);

          return {
            ...prev,
            name,
            desc,
            schedule: prev.schedule.map((el: any, index: number) => {
              if (sameDateIndex === index) {
                return {
                  ...el,
                  timeSlices: el.timeSlices.concat(data.timeSlices),
                };
              } else {
                return el;
              }
            }),
          };
        } else {
          return {
            ...prev,
            name,
            desc,
            schedule: prev.schedule.concat(data),
          };
        }
      } else {
        return {
          name,
          desc,
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

  const handleDeleteTags = useCallback(
    (tagsIndex: number, displayedTagsIndex: number) => {
      setSavedForm((prevValues: any) => {
        if (
          prevValues.schedule[tagsIndex] &&
          prevValues.schedule[tagsIndex].timeSlices.length
        ) {
          if (prevValues.schedule[tagsIndex].timeSlices.length === 1) {
            return {
              name: prevValues.name,
              desc: prevValues.desc,
              schedule: prevValues.schedule.filter(
                (el: any, index: number) => index !== tagsIndex
              ),
            };
          } else {
            return {
              name: prevValues.name,
              desc: prevValues.desc,
              schedule: prevValues.schedule.map((el: any, index: number) => {
                if (index === tagsIndex) {
                  return {
                    ...el,
                    timeSlices: el.timeSlices.filter(
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
          (loadStopSequenceSection && formInformation) ||
          !loadStopSequenceSection
            ? "1"
            : "2"
        }
      >
        <Panel header="Haltestellensequenz speichern Form" key="1">
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
              rules={[{ required: true, message: "Name fehlt" }]}
            >
              <Input
                id="name_input"
                placeholder="Haltestellensequenzname eingeben"
                value={name}
                onChange={(e) => setName(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item label="Beschreibung" name="desc">
              <Input.TextArea
                id="desc_input"
                placeholder="Beschreibung"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
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
                  Zeitplan hinzufügen
                </Button>
              </div>
            )}
            {addSchedule && (
              <Fragment>
                <Form.Item
                  label="Datum"
                  name="date"
                  rules={[{ required: true, message: "Datum fehlt" }]}
                >
                  <DatePicker.RangePicker
                    id="date_input"
                    format="DD-MM-YYYY"
                    placeholder={["Start Datum", "End Datum"]}
                  />
                </Form.Item>
                <Form.Item
                  id="dayPicker_form"
                  label="Tag"
                  name="day"
                  rules={[{ required: true, message: "Tag fehlt" }]}
                >
                  <Select
                    allowClear
                    placeholder="Tag auswählen"
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
                    label="Zeit"
                    rules={[
                      {
                        required: true,
                        message: "Zeit fehlt",
                      },
                    ]}
                  >
                    <RangePicker
                      placeholder={["Start Zeit", "End Zeit"]}
                      format="HH:mm"
                      id="timePicker_input"
                    />
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
                              Zeit hinzufügen
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
                                    placeholder={["Start Zeit", "End Zeit"]}
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
                    Zeitplan speichern
                  </Button>
                  <Button
                    type="dashed"
                    id="cancel_button"
                    onClick={() => {
                      setAddSchedule(false);
                      form.resetFields(["name", "desc", "date", "day", "time"]);
                    }}
                  >
                    Abbrechen
                  </Button>
                </Form.Item>
              </Fragment>
            )}
            <Collapse activeKey={tags.length ? "2" : ""}>
              <Panel header="Zeitplan" key="2">
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
                          <p
                            style={{ marginBottom: "4px", marginTop: "4px" }}
                          >{`${tag.from} ${tag.to}`}</p>
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
                    JSON.stringify({
                      ...savedForm,
                      name: name !== "" ? name.trim() : savedForm?.name,
                      desc: desc !== "" ? desc.trim() : savedForm?.desc,
                    }) !==
                      JSON.stringify({
                        name: formInformation?.name,
                        desc: formInformation?.desc,
                        schedule: formInformation?.schedule,
                      })
                      ? false
                      : true
                  }
                  onClick={() => {
                    saveForm({
                      ...savedForm,
                      name: name !== "" ? name : savedForm?.name,
                      desc: desc !== "" ? desc : savedForm?.desc,
                    });
                  }}
                >
                  {JSON.stringify({
                    ...savedForm,
                    name: name !== "" ? name.trim() : savedForm?.name,
                    desc: desc !== "" ? desc.trim() : savedForm?.desc,
                  }) !==
                  JSON.stringify({
                    name: formInformation?.name,
                    desc: formInformation?.desc,
                    schedule: formInformation?.schedule,
                  })
                    ? "Form speichern"
                    : "Form gespeichert"}
                </Button>
                <Button
                  danger
                  id="clear_all"
                  disabled={tags.length ? false : true}
                  onClick={() => {
                    setTags([]);
                    deleteSchedule();
                  }}
                >
                  Zeitplan löschen
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
