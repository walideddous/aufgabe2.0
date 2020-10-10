import React, { useCallback, useState } from 'react';
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
} from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

// Import types
import { TstateDND } from '../type/Types';

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
  const [selecetdDay, setSelectedDay] = useState([]);
  const [timeSelected, setTimeselected] = useState({});
  const [savedDate, setSavedDate] = useState([]);

  const onFinish = (values: any) => {
    const formInput = {
      name: values.Name,
    };
    handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onRangePikerMo = (time: any, timeString: any) => {
    setTimeselected({
      ...timeSelected,
      start: timeString[0],
      end: timeString[1],
    });
  };

  const daySelect = (value: any) => {
    setSelectedDay(value);
  };

  const onDatePicker = (time: any, dateString: any) => {
    console.log('value datePicker', dateString);
  };

  const saveSelectedDate = useCallback(() => {
    console.log('saveSelectedDate');
    //@ts-ignore
    setSavedDate((prev) => {
      return [
        ...prev,
        {
          day: selecetdDay,
          time: timeSelected,
        },
      ];
    });
    setSelectedDay([]);
    setTimeselected({});
  }, [selecetdDay, timeSelected]);

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
        <Form.Item
          {...tailLayout}
          label='Date interval'
          name='Date interval'
          rules={[{ required: true, message: 'Please give a Date interval' }]}
        >
          <DatePicker.RangePicker onChange={onDatePicker} />
        </Form.Item>

        <Form.Item
          {...tailLayout}
          label='Valid'
          name='Valid'
          rules={[{ required: true, message: 'Please give a Valid day' }]}
        >
          <Row>
            <Col span={11}>
              <TreeSelect
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder='Please select a day'
                allowClear
                multiple
                treeDefaultExpandAll
                onChange={daySelect}
                value={selecetdDay}
              >
                <TreeNode value='monday' title='Mo' />
                <TreeNode value='tuesday' title='Tu' />
                <TreeNode value='wednesday' title='We' />
                <TreeNode value='thursday' title='Th' />
                <TreeNode value='friday' title='Fr' />
                <TreeNode value='saturday' title='Sa' />
                <TreeNode value='sunday' title='Su' />
                <TreeNode value='holiday' title='Holiday' />
              </TreeSelect>
            </Col>
            <Col offset={1}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerMo}
                disabled={selecetdDay.length ? false : true}
              />
            </Col>
            <Col offset={0.5}>
              <Button
                onClick={saveSelectedDate}
                disabled={selecetdDay.length ? false : true}
              >
                +
              </Button>
            </Col>
            <Col>
              {savedDate &&
                savedDate.map((el: any, i: number) => (
                  <div>
                    <span style={{ width: '90%' }}>{el.time.start}</span>
                    <button
                      style={{
                        backgroundColor: 'white',
                        color: '#3949ab',
                        borderRadius: '5px',
                        outline: '0',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 2px lightgray',
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type={stateDND.trajekt.items.length ? 'primary' : 'dashed'}
            htmlType='submit'
            disabled={stateDND.trajekt.items.length ? false : true}
          >
            Save the stop sequence
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(SaveStopsSequenceForm);
