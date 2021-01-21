import React, {
  useState,
  useCallback,
  Fragment,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Form,
  Input,
  TimePicker,
  Button,
  DatePicker,
  Collapse,
  Select,
  Tag,
  Space,
  Divider,
  Popconfirm,
  Alert,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

// import the model
import ManagedRoute from "../../model/ManagedRoute";

// import utils function
import { getFormatTags } from "../../utils/getFormatTags";
// Importing types
import { TstateDND, TStopSequence } from "../../types/types";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

interface Tprops {
  stateDND: TstateDND;
  currentStopSequence: TStopSequence | undefined;
  onDisabled: (value: boolean) => void;
  onSaveStopSequenceMutation: (formInput: any) => void;
}

const SaveStopSequenceForm = forwardRef(
  (
    {
      stateDND,
      currentStopSequence,
      onDisabled,
      onSaveStopSequenceMutation,
    }: Tprops,
    ref: any
  ) => {
    const [form] = Form.useForm();
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
    const [collapseOpen, setCollapseOpen] = useState<boolean>(false);

    // set savedForm state when load data from Backend
    useEffect(() => {
      if (currentStopSequence) {
        const { name, desc, schedule } = currentStopSequence;
        setSavedForm({ name, desc, schedule });
        form.setFieldsValue({
          name: currentStopSequence.name,
          desc: currentStopSequence.desc,
        });
        setCollapseOpen(true);
      } else {
        setSavedForm({ name: "", desc: "", schedule: [] });
        form.setFieldsValue({
          name: "",
          desc: "",
        });
      }
    }, [currentStopSequence, form]);

    //set tags state when load data from Backend
    useEffect(() => {
      if (savedForm && savedForm.schedule) {
        const savedFormFormated = getFormatTags(savedForm.schedule);
        setTags(savedFormFormated);
      } else {
        setTags([]);
      }
    }, [savedForm]);

    const [errorMessage, setErrorMessage] = useState("");

    const onFinish = (values: any) => {
      let { date, day, time, timeList } = values;

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

      const newFormData = {
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

      let managedRoute = new ManagedRoute();

      const messageValidation = managedRoute.messageValidation(
        savedForm,
        newFormData
      );

      if (messageValidation) return setErrorMessage(messageValidation);

      setSavedForm((prev: any) => {
        if (prev && prev.schedule) {
          if (
            prev.schedule.filter(
              (el: any) =>
                el.from === newFormData.from && el.to === newFormData.to
            ).length
          ) {
            const sameDateIndex = prev.schedule
              .map((el: any) => `${el.from} ${el.to}`)
              .indexOf(`${newFormData.from} ${newFormData.to}`);

            return {
              ...prev,
              schedule: prev.schedule.map((el: any, index: number) => {
                if (
                  sameDateIndex === index &&
                  JSON.stringify(el.timeSlices) !==
                    JSON.stringify(newFormData.timeSlices)
                ) {
                  return {
                    ...el,
                    timeSlices: el.timeSlices.concat(newFormData.timeSlices),
                  };
                } else {
                  return el;
                }
              }),
            };
          } else {
            return {
              ...prev,
              schedule: prev.schedule.concat(newFormData),
            };
          }
        } else {
          return {
            schedule: [{ ...newFormData }],
          };
        }
      });

      // CLose the schedule field
      setAddSchedule(false);

      // Force the timeList to reset
      form.setFieldsValue({
        timeList: [],
      });
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

    useImperativeHandle(
      ref,
      () => ({
        saveStopSequenceMutation: () => {
          onDisabled(true);
          setCollapseOpen(false);
          setTags([]);
          setSavedForm((prev: any) => ({
            name: "",
            desc: "",
            schedule: [],
          }));
          form.resetFields(["name", "desc", "date", "day", "time"]);
          onSaveStopSequenceMutation({
            ...savedForm,
            stopSequence: stateDND.trajekt.items,
          });
        },
      }),
      [
        form,
        savedForm,
        stateDND.trajekt,
        onDisabled,
        onSaveStopSequenceMutation,
      ]
    );

    useEffect(() => {
      if (
        tags.length &&
        savedForm &&
        savedForm.name &&
        stateDND.trajekt.items.length >= 2 &&
        JSON.stringify({
          ...savedForm,
          stopSequence: stateDND.trajekt.items.map((el) => el),
        }) !==
          JSON.stringify({
            name: currentStopSequence?.name,
            desc: currentStopSequence?.desc,
            schedule: currentStopSequence?.schedule,
            stopSequence: currentStopSequence?.stopSequence,
          })
      ) {
        onDisabled(false);
      } else {
        onDisabled(true);
      }
    }, [
      tags,
      savedForm,
      currentStopSequence,
      stateDND.trajekt.items,
      onDisabled,
    ]);

    useEffect(() => {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }, [errorMessage]);

    return (
      <Form
        autoComplete="off"
        id="formWrapper"
        layout="vertical"
        requiredMark={false}
        form={form}
        onFinish={onFinish}
      >
        <Collapse defaultActiveKey={"1"}>
          <Panel
            header={savedForm?.name ? savedForm.name : "Linienverlauf"}
            key="1"
          >
            <Form.Item label="Name" name="name">
              <Input
                id="name_input"
                placeholder="Geben Sie dem Linienname ein"
                onChange={(e) => {
                  e.persist();
                  setSavedForm((prev: any) => ({
                    ...prev,
                    name: e.target.value.trim(),
                  }));
                }}
                allowClear
              />
            </Form.Item>
            <Form.Item label="Beschreibung" name="desc">
              <Input.TextArea
                id="desc_input"
                placeholder="Geben Sie der Linienbeschreibung ein"
                onChange={(e) => {
                  e.persist();
                  setSavedForm((prev: any) => ({
                    ...prev,
                    desc: e.target.value.trim(),
                  }));
                }}
                allowClear
              />
            </Form.Item>
          </Panel>
        </Collapse>
        <Collapse
          style={{ marginTop: "8px" }}
          activeKey={collapseOpen ? "2" : ""}
          onChange={() => {
            setCollapseOpen(!collapseOpen);
          }}
        >
          <Panel
            header={
              tags.length ? (
                "Zeitplan"
              ) : (
                <p
                  style={{
                    color: "red",
                    margin: "0",
                  }}
                >
                  Kein Zeitplan
                </p>
              )
            }
            key="2"
          >
            <div
              id="time_result"
              style={{
                maxHeight: "200px",
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
                                handleDeleteTags(tagsIndex, displayedTagsIndex);
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
            <Divider />
            {!addSchedule && (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddSchedule(true);
                  }}
                  id="addSchedule_button"
                >
                  Zeitplan hinzufügen
                </Button>
                {tags.length ? (
                  <Popconfirm
                    title={`Wollen Sie wirklich den Zeitplan löschen ?`}
                    placement="bottomRight"
                    okText="Ja"
                    cancelText="Nein"
                    onConfirm={() => {
                      setTags([]);
                      setSavedForm((prev: any) => ({
                        ...prev,
                        schedule: [],
                      }));
                      setCollapseOpen(false);
                    }}
                  >
                    <Button
                      danger
                      id="clear_all"
                      disabled={tags.length ? false : true}
                    >
                      Zeitplan löschen
                    </Button>
                  </Popconfirm>
                ) : null}
              </Space>
            )}
            {addSchedule && (
              <Fragment>
                <Space>
                  {errorMessage && (
                    <Alert
                      message={errorMessage}
                      type="error"
                      closable={true}
                      showIcon
                    />
                  )}
                </Space>
                <Form.Item
                  label="Gültigkeit"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Geben Sie der Gültigkeit ein",
                    },
                  ]}
                  initialValue={[moment(), moment().add(1, "w")]}
                >
                  <DatePicker.RangePicker
                    id="date_input"
                    format="DD-MM-YYYY"
                    placeholder={["Start Gültigkeit", "End Gültigkeit"]}
                  />
                </Form.Item>
                <Form.Item
                  id="dayPicker_form"
                  label="Wochentage"
                  name="day"
                  rules={[
                    { required: true, message: "Geben Sie den Wochentage ein" },
                  ]}
                  initialValue={["Mon", "Die", "Mit", "Don", "Fre"]}
                >
                  <Select
                    allowClear
                    placeholder="Wählen Sie den Wochentage aus"
                    id="dayPicker_input"
                    mode="tags"
                  >
                    <Option key="1" value="Mon">
                      Montag
                    </Option>
                    <Option key="2" value="Die">
                      Dienstag
                    </Option>
                    <Option key="3" value="Mit">
                      Mittwoch
                    </Option>
                    <Option key="4" value="Don">
                      Donnerstag
                    </Option>
                    <Option key="5" value="Fre">
                      Freitag
                    </Option>
                    <Option key="6" value="Sam">
                      Samstag
                    </Option>
                    <Option key="7" value="Son">
                      Sonntag
                    </Option>
                    <Option key="8" value="Feiertag">
                      Feiertag
                    </Option>
                  </Select>
                </Form.Item>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  <Form.Item
                    name="time"
                    label="Zeitintervall"
                    rules={[
                      {
                        required: true,
                        message: "Geben Sie der Zeitintervall ein",
                      },
                    ]}
                    initialValue={[moment(), moment().add(1, "h")]}
                  >
                    <RangePicker
                      placeholder={["Start Zeitintervall", "End Zeitintervall"]}
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
                              style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                              }}
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                            >
                              Zeitintervall hinzufügen
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
                                    placeholder={[
                                      "Start Zeitintervall",
                                      "End Zeitintervall",
                                    ]}
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
                    Zeitplan hinzufügen
                  </Button>
                  <Button
                    type="dashed"
                    id="cancel_button"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setAddSchedule(false);
                    }}
                  >
                    Abbrechen
                  </Button>
                  {tags.length ? (
                    <Popconfirm
                      title={`Wollen Sie wirklich den Zeitplan löschen ?`}
                      placement="bottomRight"
                      okText="Ja"
                      cancelText="Nein"
                      onConfirm={() => {
                        setTags([]);
                        setSavedForm((prev: any) => ({
                          ...prev,
                          schedule: [],
                        }));
                        setCollapseOpen(false);
                      }}
                    >
                      <Button
                        danger
                        id="clear_all"
                        style={{ marginLeft: "10px" }}
                        disabled={tags.length ? false : true}
                      >
                        Zeitplan löschen
                      </Button>
                    </Popconfirm>
                  ) : null}
                </Form.Item>
              </Fragment>
            )}
          </Panel>
        </Collapse>
      </Form>
    );
  }
);

export default React.memo(SaveStopSequenceForm);
