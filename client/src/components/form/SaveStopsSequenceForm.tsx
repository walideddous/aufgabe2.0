import React, { useState, Fragment } from "react";
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
} from "antd";

// import utils function
import getFormatTags from "../../utils/getFormatTags";

const { RangePicker } = TimePicker;
const { Panel } = Collapse;
const { Option } = Select;

const SaveStopsSequenceForm = () => {
  // get this form to clear the input form after submit
  const [form] = Form.useForm();
  const [addSchedule, setAddSchedule] = useState(false);
  const [tags, setTags] = useState<
    {
      date: string;
      displayedtags: {
        day: string;
        time: string[];
      }[];
    }[]
  >([]);

  const onFinish = (values: any) => {
    const formatTags = getFormatTags(values);

    console.log(formatTags);

    setTags((prev: any) => {
      if (prev) {
        if (!prev.filter((el: any) => el.date === formatTags.date).length) {
          return prev.concat({ ...formatTags });
        }
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].date === formatTags.date) {
            prev[i].displayedtags.concat(formatTags.displayedtags);
          }
        }
        return prev;
      } else {
        return [{ ...formatTags }];
      }
    });

    form.resetFields();
  };

  console.log(tags);

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
                id="name-input"
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
                  id="AddSchedule-button"
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
                    id="date-input"
                    value={date}
                    onChange={handleDateChange}
                  />
                </Form.Item>
                <Form.Item
                  id="dayPicker-form"
                  label="Day"
                  name="day"
                  rules={[{ required: true, message: "Please give a day" }]}
                >
                  <Select
                    allowClear
                    id="dayPicker-input"
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

                <Form.Item
                  name="time"
                  label="Time"
                  rules={[{ required: true, message: "Missing time" }]}
                >
                  <RangePicker
                    format="HH:mm"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Button id="save_button" type="primary" htmlType="submit">
                    Save schedule
                  </Button>
                  <Button
                    type="dashed"
                    id="Cancel-button"
                    onClick={() => {
                      setAddSchedule(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Fragment>
            )}
            <Collapse defaultActiveKey="3">
              <Panel header="Stop sequence schedule" key="2">
                <div
                  id="time_result"
                  style={{ height: "200px", overflowY: "auto" }}
                ></div>
                <Button type="dashed" id="clear_all">
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

export default React.memo(SaveStopsSequenceForm);

/*
type="primary" htmlType="submit"
*/
