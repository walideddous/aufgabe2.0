import React, { useState } from "react";
import { Card, Form, Input, Checkbox, TimePicker } from "antd";

// Import types
import { TstateDND } from "../type/Types";

const layout = {
  labelCol: { span: 2 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 16 },
};

// Declare Props Types
interface TpropsForm {
  stateDND: TstateDND;
  handleSaveStopSequence: (formInput: any) => void;
}

const SaveStopsSequenceForm = ({
  stateDND,
  handleSaveStopSequence,
}: TpropsForm) => {
  const { RangePicker } = TimePicker;
  const [result, setResult] = useState({});

  const options = [
    { label: "Mo", value: "Monday" },
    { label: "Tu", value: "Tuesday" },
    { label: "We", value: "Wednesday" },
    { label: "Th", value: "Thursday" },
    { label: "Fr", value: "Friday" },
    { label: "Sa", value: "Saturday" },
    { label: "Su", value: "Sunday" },
    { label: "Holiday", value: "Holiday" },
  ];

  const onFinish = (values: any) => {
    const formInput = {
      name: values.Name,
      ...result,
    };
    handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onCheckBox = (checkedValues: any) => {
    setResult({ ...result, valid: checkedValues });
  };
  const onRangePiker = (time: any, timeString: any) => {
    setResult({
      ...result,
      time: { Start: timeString[0], End: timeString[1] },
    });
  };

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
          label="Valid"
          name="Valid"
          rules={[{ required: true, message: "Ckeck" }]}
        >
          <Checkbox.Group options={options} onChange={onCheckBox} />
        </Form.Item>
        <Form.Item
          {...tailLayout}
          label="Time"
          name="Time"
          rules={[{ required: true, message: "Select the time" }]}
        >
          <RangePicker format="HH:mm" onChange={onRangePiker} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <button
            type="submit"
            disabled={stateDND.trajekt.items.length ? false : true}
          >
            Save the stop sequence
          </button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SaveStopsSequenceForm;
