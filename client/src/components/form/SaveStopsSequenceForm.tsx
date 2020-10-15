import React, { useCallback, useState } from "react";
import {
  Card,
  Form,
  Input,
  Col,
  TimePicker,
  TreeSelect,
  Button,
  DatePicker,
} from "antd";

import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

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
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;
const { TreeNode } = TreeSelect;

const SaveStopsSequenceForm = ({
  stateDND,
  handleSaveStopSequence,
}: TpropsForm) => {
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [firstSelectedTimeRange, setFirstSelectedTimeRange] = useState({});
  const [secondSelectedTimeRange, setSecondSelectedTimeRange] = useState({});
  const [savedDaysTimes, setSavedDaysTimes] = useState<{}[]>([]);
  const [addTimeRange, setAddTimeRange] = useState(false);

  // Momnet stored in variable to reset the value of TimeRangPiker
  const [firstTimeMoment, setFirstTimeMoment] = useState([]);
  const [secondTimeMoment, setSecondTimeMoment] = useState([]);

  const onFinish = (values: any) => {
    let formInput;
    if (Object.keys(firstSelectedTimeRange).length && !savedDaysTimes.length) {
      formInput = {
        name: values.Name,
        date: selectedDate,
        schedule: [{ day: selectedDate, time: firstSelectedTimeRange }],
      };
    }
    if (!selectedDay.length && savedDaysTimes.length) {
      formInput = {
        name: values.Name,
        date: selectedDate,
        schedule: savedDaysTimes,
      };
    }
    if (Object.keys(firstSelectedTimeRange).length && savedDaysTimes.length) {
      if (Object.keys(secondSelectedTimeRange).length) {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: savedDaysTimes.concat({
            day: selectedDate,
            time: [firstSelectedTimeRange, secondSelectedTimeRange],
          }),
        };
      } else {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: savedDaysTimes.concat({
            day: selectedDate,
            time: [firstSelectedTimeRange],
          }),
        };
      }
    }
    // handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // save the first selected Time range
  const onFirstTimeRangePiker = useCallback((time: any, timeString: any) => {
    const newValue = {
      start: timeString[0],
      end: timeString[1],
    };
    setFirstTimeMoment(time);
    setFirstSelectedTimeRange({ ...newValue });
  }, []);

  // save the second selected Time range
  const onSecondTimeRangePiker = useCallback((time: any, timeString: any) => {
    const newValue = {
      start: timeString[0],
      end: timeString[1],
    };
    setSecondTimeMoment(time);
    setSecondSelectedTimeRange({ ...newValue });
  }, []);

  // save the selectedDays
  const daySelect = useCallback((value: any) => {
    setSelectedDay(value);
  }, []);

  // save the selected Date range
  const onDateRangePicker = useCallback((time: any, dateString: any) => {
    setSelectedDate(dateString);
  }, []);

  // Click on save date button
  const saveSelectedDate = useCallback(() => {
    if (Object.keys(secondSelectedTimeRange).length) {
      //@ts-ignore
      setSavedDaysTimes((prev) => {
        return [
          ...prev,
          {
            day: selectedDay,
            time: [firstSelectedTimeRange, secondSelectedTimeRange],
          },
        ];
      });
    } else {
      //@ts-ignore
      setSavedDaysTimes((prev: any) => {
        return [
          ...prev,
          {
            day: selectedDay,
            time: [firstSelectedTimeRange],
          },
        ];
      });
    }
    setSelectedDay([]);
    setFirstTimeMoment([]);
    setSecondTimeMoment([]);
    setFirstSelectedTimeRange({});
    setSecondSelectedTimeRange({});
    setAddTimeRange(false);
  }, [selectedDay, firstSelectedTimeRange, secondSelectedTimeRange]);

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

  return (
    <Card bordered={true}>
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
          <Input />
        </Form.Item>
        <Form.Item
          {...tailLayout}
          label="Date interval"
          name="Date interval"
          rules={[{ required: true, message: "Please give a Date interval" }]}
        >
          <DatePicker.RangePicker onChange={onDateRangePicker} />
        </Form.Item>

        <Form.Item
          {...tailLayout}
          label="Valid"
          name="Valid"
          rules={
            !savedDaysTimes.length &&
            !Object.keys(firstSelectedTimeRange).length
              ? [
                  {
                    required: true,
                    message: "Please give a Valid day and time",
                  },
                ]
              : undefined
          }
        >
          <Col style={{ display: "flex", padding: "10px" }}>
            <strong>Days: </strong>
            <TreeSelect
              style={{ width: "70%", paddingLeft: "20px" }}
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="Please select a day"
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={daySelect}
              value={selectedDay}
            >
              <TreeNode value="monday" title="Mo" />
              <TreeNode value="tuesday" title="Tu" />
              <TreeNode value="wednesday" title="We" />
              <TreeNode value="thursday" title="Th" />
              <TreeNode value="friday" title="Fr" />
              <TreeNode value="saturday" title="Sa" />
              <TreeNode value="sunday" title="Su" />
              <TreeNode value="holiday" title="Holiday" />
            </TreeSelect>
          </Col>
          <Col style={{ display: "flex", padding: "10px" }}>
            <strong style={{ paddingRight: "20px" }}>Time: </strong>
            <RangePicker
              format="HH:mm"
              onChange={onFirstTimeRangePiker}
              //@ts-ignore
              value={
                Object.keys(firstSelectedTimeRange).length
                  ? firstTimeMoment
                  : null
              }
              disabled={selectedDay.length ? false : true}
            />
            <Button
              onClick={() => {
                setAddTimeRange(!addTimeRange);
                if (addTimeRange) {
                  setSecondTimeMoment([]);
                  setSecondSelectedTimeRange({});
                }
              }}
              disabled={
                Object.keys(firstSelectedTimeRange).length ? false : true
              }
            >
              {addTimeRange ? <MinusOutlined /> : <PlusOutlined />}
            </Button>
            {addTimeRange && (
              <RangePicker
                format="HH:mm"
                onChange={onSecondTimeRangePiker}
                //@ts-ignore
                value={
                  Object.keys(secondSelectedTimeRange).length
                    ? secondTimeMoment
                    : null
                }
                disabled={selectedDay.length ? false : true}
              />
            )}
          </Col>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "50px",
            }}
          >
            <Button
              type="primary"
              onClick={saveSelectedDate}
              disabled={
                selectedDay.length && Object.keys(firstSelectedTimeRange).length
                  ? false
                  : true
              }
            >
              Save Days and Time
            </Button>
          </div>
        </Form.Item>
        <Form.Item {...tailLayout}>
          {savedDaysTimes &&
            savedDaysTimes.map((el: any, i: number) => (
              <div key={i} className="timePicked">
                <div>
                  {el.day.length === 1 ? (
                    <p>{el.day[0]}</p>
                  ) : (
                    <p>
                      {el.day[0]}
                      {"-"}
                      {el.day[el.day.length - 1]}
                    </p>
                  )}
                </div>
                <div>
                  {el.time.map((el: any, index: number) => (
                    <p key={index}>
                      {"From "}
                      {el.start}
                      {" To "}
                      {el.end}
                    </p>
                  ))}
                </div>
                <Button
                  style={{
                    backgroundColor: "white",
                    color: "#3949ab",
                    borderRadius: "5px",
                    outline: "0",
                    cursor: "pointer",
                    boxShadow: "0px 2px 2px lightgray",
                  }}
                  onClick={() => deleteAddetTime(i)}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            ))}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={stateDND.trajekt.items.length ? false : true}
          >
            {stateDND.trajekt.items.length
              ? " save the stop sequence"
              : "stop sequence required"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(SaveStopsSequenceForm);
