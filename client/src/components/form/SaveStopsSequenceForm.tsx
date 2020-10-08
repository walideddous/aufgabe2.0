import React, { useState } from "react";
import { Card, Form, Input, Checkbox, TimePicker, Row, Col } from "antd";

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

        <Form.Item {...tailLayout} label="Valid" name="Valid">
          <Checkbox.Group style={{ width: "100%" }}>
            <Row>
              <Col span={6}>
                <Checkbox value="Monday">Mo</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker
                  format="HH:mm"
                  onChange={onRangePiker}
                  disabled={true}
                />
              </Col>
              <Col span={6}>
                <Checkbox value="Tuesday">Tu</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Wednesday">We</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Thursday">Th</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Friday">Fr</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Saturday">Sa</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Sunday">Su</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
              <Col span={6}>
                <Checkbox value="Holiday">Holiday</Checkbox>
              </Col>
              <Col span={16}>
                <RangePicker format="HH:mm" onChange={onRangePiker} />
              </Col>
            </Row>
          </Checkbox.Group>
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

/*

          <Checkbox>Mo</Checkbox>{" "}
          <RangePicker format="HH:mm" onChange={onRangePiker} />

*/
