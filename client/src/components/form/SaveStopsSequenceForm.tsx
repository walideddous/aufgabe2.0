import React, { useCallback, useState } from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  TimePicker,
  TreeSelect,
  Button,
  DatePicker,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  MinusOutlined,
} from "@ant-design/icons";

// Import types
import { TstateDND } from "../type/Types";

const layout = {
  labelCol: { span: 2 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 24 },
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
  const [savedDaysTimes, setSavedDaysTimes] = useState([]);
  const [addTimeRange, setAddTimeRange] = useState(false);

  // Momnet stored in variable to reset the value of TimeRangPiker
  const [firstTimeMoment, setFirstTimeMoment] = useState([]);
  const [secondTimeMoment, setSecondTimeMoment] = useState([]);

  const onFinish = (values: any) => {
    let formInput;
    if (selectedDay.length && !savedDaysTimes.length) {
      if (Object.keys(secondSelectedTimeRange).length) {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: {
            day: selectedDay,
            time: [firstSelectedTimeRange, secondSelectedTimeRange],
          },
        };
      } else {
        formInput = {
          name: values.Name,
          date: selectedDate,
          schedule: {
            day: selectedDay,
            time: [firstSelectedTimeRange],
          },
        };
      }

      handleSaveStopSequence(formInput);
    }
    if (!selectedDay.length && savedDaysTimes.length) {
      formInput = {
        name: values.Name,
        date: selectedDate,
        schedule: savedDaysTimes,
      };
      handleSaveStopSequence(formInput);
    }
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
          <Row>
            <Col span={11}>
              <TreeSelect
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
            <Col>
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
            </Col>
            <Col>
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
            </Col>
            {addTimeRange && (
              <Col offset={1}>
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
              </Col>
            )}
            <Col>
              <Button
                onClick={saveSelectedDate}
                disabled={
                  selectedDay.length &&
                  Object.keys(firstSelectedTimeRange).length
                    ? false
                    : true
                }
              >
                <SaveOutlined />
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...tailLayout}>
          {savedDaysTimes &&
            savedDaysTimes.map((el: any, i: number) => (
              <div key={i} className="item">
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
