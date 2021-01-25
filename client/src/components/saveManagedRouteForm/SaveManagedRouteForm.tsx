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
  ConfigProvider,
} from "antd";
import moment from "moment";
import "moment/locale/de";
import locale from "antd/es/locale/de_DE";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

// import the model
import ManagedRoute from "../../model/ManagedRoute";

// import utils function
import { getFormatTags } from "../../utils/getFormatTags";
// Importing types
import { TstopSequence, TManagedRoute } from "../../types/types";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

interface Tprops {
  stopSequence: TstopSequence;
  currentManagedRoute: TManagedRoute | undefined;
  onIsHeaderSaveButtonDisabled: (value: boolean) => void;
  onSaveManagedRouteMutation: (managedRouteForm: any) => void;
}

const SaveManagedRouteForm = forwardRef(
  (
    {
      stopSequence,
      currentManagedRoute,
      onIsHeaderSaveButtonDisabled,
      onSaveManagedRouteMutation,
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
    const [
      linienverlaufCollapseOpen,
      setLinienverlaufCollapseOpen,
    ] = useState<boolean>(false);
    const [zeitPlanCollapseOpen, setZeitPlanCollapseOpen] = useState<boolean>(
      false
    );

    // set savedForm state when load data from Backend
    useEffect(() => {
      if (currentManagedRoute) {
        const { name, desc, schedule } = currentManagedRoute;
        setSavedForm({ name, desc, schedule });
        form.setFieldsValue({
          name: currentManagedRoute.name,
          desc: currentManagedRoute.desc,
        });
        setLinienverlaufCollapseOpen(true);
        setZeitPlanCollapseOpen(true);
      } else {
        setSavedForm({ name: "", desc: "", schedule: [] });
        form.setFieldsValue({
          name: "",
          desc: "",
        });
      }
    }, [currentManagedRoute, form]);

    //set tags state when load data from Backend
    useEffect(() => {
      if (savedForm && savedForm.schedule) {
        const savedFormFormated = getFormatTags(savedForm.schedule);
        setTags(savedFormFormated);
      } else {
        setTags([]);
      }
    }, [savedForm]);

    const [errorMessages, setErrorMessages] = useState<
      { type: string; message: string }[]
    >([]);

    const getWeekDayLabel = (value: string) => {
      switch (value) {
        case "MON":
          return "Montag";
        case "DIE":
          return "Dienstag";
        case "MIT":
          return "Mittwoch";
        case "DON":
          return "Donnerstag";
        case "FRE":
          return "Freitag";
        case "SAM":
          return "Samstag";
        case "SON":
          return "Sonntag";
      }
    };

    const onFinish = (values: any) => {
      const { date, days, time, timeList } = values;

      //const weekDayLabel = days.map((day: string) => getWeekDayLabel(day));

      const formData = new ManagedRoute(date, days, time, timeList);

      const newFormData = formData.getFormatedData();

      const messageValidation = formData.validationMessages(savedForm);

      if (messageValidation.length) return setErrorMessages(messageValidation);
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
        onSaveManagedRouteMutation: () => {
          onIsHeaderSaveButtonDisabled(true);
          setLinienverlaufCollapseOpen(false);
          setZeitPlanCollapseOpen(false);
          setTags([]);
          setSavedForm((prev: any) => ({
            name: "",
            desc: "",
            schedule: [],
          }));
          form.resetFields(["name", "desc", "date", "day", "time"]);
          onSaveManagedRouteMutation({
            ...savedForm,
            stopSequence: stopSequence.trajekt.items,
          });
        },
      }),
      [
        form,
        savedForm,
        stopSequence.trajekt,
        onIsHeaderSaveButtonDisabled,
        onSaveManagedRouteMutation,
      ]
    );

    useEffect(() => {
      if (
        tags.length &&
        savedForm &&
        savedForm.name &&
        stopSequence.trajekt.items.length >= 2 &&
        JSON.stringify({
          ...savedForm,
          stopSequence: stopSequence.trajekt.items.map((el) => el),
        }) !==
          JSON.stringify({
            name: currentManagedRoute?.name,
            desc: currentManagedRoute?.desc,
            schedule: currentManagedRoute?.schedule,
            stopSequence: currentManagedRoute?.stopSequence,
          })
      ) {
        onIsHeaderSaveButtonDisabled(false);
      } else {
        onIsHeaderSaveButtonDisabled(true);
      }
    }, [
      tags,
      savedForm,
      currentManagedRoute,
      stopSequence.trajekt.items,
      onIsHeaderSaveButtonDisabled,
    ]);

    useEffect(() => {
      if (errorMessages.length) {
        const ClearErrorMessage = setTimeout(() => {
          setErrorMessages([]);
        }, 5000);

        return () => clearTimeout(ClearErrorMessage);
      }
    }, [errorMessages.length]);

    return (
      <ConfigProvider locale={locale}>
        <Form
          autoComplete="off"
          id="formWrapper"
          layout="vertical"
          requiredMark={false}
          form={form}
          onFinish={onFinish}
        >
          <Collapse
            activeKey={linienverlaufCollapseOpen ? "1" : ""}
            onChange={() => {
              setLinienverlaufCollapseOpen(!linienverlaufCollapseOpen);
            }}
          >
            <Panel
              key="1"
              header={
                savedForm?.name ? (
                  savedForm.name
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        color: "red",
                        margin: "0",
                      }}
                    >
                      Linenverlauf
                    </p>
                    <p
                      style={{
                        color: "red",
                        margin: "0",
                      }}
                    >
                      (Bitte fülen Sie den Linenverlauf aus)
                    </p>
                  </div>
                )
              }
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
            activeKey={zeitPlanCollapseOpen ? "2" : ""}
            onChange={() => {
              setZeitPlanCollapseOpen(!zeitPlanCollapseOpen);
            }}
          >
            <Panel
              key="2"
              header={
                tags.length ? (
                  "Zeitplan"
                ) : (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        color: "red",
                        margin: "0",
                      }}
                    >
                      Kein Zeitplan
                    </p>
                    <p
                      style={{
                        color: "red",
                        margin: "0",
                      }}
                    >
                      (Bitte erstellen Sie eine Zeitplan)
                    </p>
                  </div>
                )
              }
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
                        setZeitPlanCollapseOpen(false);
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
                  {errorMessages &&
                    errorMessages.map((errorMessage: any, index: number) => (
                      <Alert
                        key={index}
                        message={errorMessage.message}
                        type={errorMessage.type}
                        closable={true}
                        showIcon
                      />
                    ))}

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
                    name="days"
                    rules={[
                      {
                        required: true,
                        message: "Geben Sie den Wochentage ein",
                      },
                    ]}
                    initialValue={["MON", "DIE", "MIT", "DON", "FRE"]}
                  >
                    <Select
                      allowClear
                      placeholder="Wählen Sie den Wochentage aus"
                      id="dayPicker_input"
                      mode="tags"
                    >
                      <Option key="1" value="MON">
                        {getWeekDayLabel("MON")}
                      </Option>
                      <Option key="2" value="DIE">
                        {getWeekDayLabel("DIE")}
                      </Option>
                      <Option key="3" value="MIT">
                        {getWeekDayLabel("MIT")}
                      </Option>
                      <Option key="4" value="DON">
                        {getWeekDayLabel("DON")}
                      </Option>
                      <Option key="5" value="FRE">
                        {getWeekDayLabel("FRE")}
                      </Option>
                      <Option key="6" value="SAM">
                        {getWeekDayLabel("SAM")}
                      </Option>
                      <Option key="7" value="SON">
                        {getWeekDayLabel("SON")}
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
                      initialValue={[
                        moment("10:00", "HH:mm"),
                        moment("14:00", "HH:mm"),
                      ]}
                    >
                      <RangePicker
                        placeholder={[
                          "Start Zeitintervall",
                          "End Zeitintervall",
                        ]}
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
                          setZeitPlanCollapseOpen(false);
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
      </ConfigProvider>
    );
  }
);

export default React.memo(SaveManagedRouteForm);
