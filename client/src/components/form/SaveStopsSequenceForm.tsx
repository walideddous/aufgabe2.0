import React, { useState } from 'react';
import { Card, Form, Input, Checkbox, Row, Col, TimePicker, TreeSelect  } from 'antd';

// Import types
import { TstateDND } from '../type/Types';


const layout = {
  labelCol: { span: 2 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

// Declare Props Types
interface TpropsForm {
  stateDND: TstateDND;
  handleSaveStopSequence: (formInput: any) => void;
}
const { RangePicker } = TimePicker;

const SaveStopsSequenceForm = ({
  stateDND,
  handleSaveStopSequence,
}: TpropsForm) => {
 
  const [result, setResult] = useState({
    Mo: {},
    Tu: {},
    We: {},
    Th: {},
    Fr: {},
    Sa: {},
    Su: {},
    Holiday: {},
  });
  const [checkedBox, setCheckedBox] = useState([])

  const onFinish = (values: any) => {
    const formInput = {
      name: values.Name,
      ...result,
    };
    handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onRangePikerMo = (time: any, timeString: any) => {
    setResult({
      ...result,
      Mo: {
        ...result.Mo,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };

  const onCheckBox = (checkedBox: any) => {
    setCheckedBox(checkedBox)
  }


  return (
    <Card bordered={true}>
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          {...tailLayout}
          label='Name'
          name='Name'
          rules={[{ required: true, message: 'Please give a Name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout} label='Valid' name='Valid' rules={[{ required: true, message: 'Please give a Valid day' }]}>
          <Checkbox.Group style={{ width: '100%' }} onChange={onCheckBox}  >
          <Row>
            <Col >
              <Checkbox value="monday">Mo</Checkbox>
            </Col>
            <Col >
              <Checkbox value="tuesday">Tu</Checkbox>
            </Col>
            <Col >
              <Checkbox value="wednesday ">We</Checkbox>
            </Col>
            <Col >
              <Checkbox value="thursday">Th</Checkbox>
            </Col>
            <Col >
              <Checkbox value="friday">Fr</Checkbox>
            </Col>
            <Col >
              <Checkbox value="saturday">Sa</Checkbox>
            </Col>
            <Col >
              <Checkbox value="sunday" >Su</Checkbox>
            </Col>
            <Col >
              <Checkbox value="holiday">Holiday</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        </Form.Item>
        <Form.Item {...tailLayout} label='Time' name='Time'>
        <TimePicker
                format='HH:mm'
                placeholder="Strat time"
                onChange={onRangePikerMo}
                disabled={checkedBox.length ? false : true}
              />
        <TimePicker
                format='HH:mm'
                placeholder="End time"
                onChange={onRangePikerMo}
                disabled={checkedBox.length ? false : true}
              />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <button
            type='submit'
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
