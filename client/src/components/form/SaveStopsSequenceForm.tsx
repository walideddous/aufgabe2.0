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
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [savedDate, setSavedDate] = useState([]);

  const onFinish = (values: any) => {
    const formInput = {
      name: values.Name,
      date: selectedDate,
      schedule: savedDate,
    };
    handleSaveStopSequence(formInput);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onRangePikerMo = useCallback((time: any, timeString: any) => {
    setSelectedTime((prev) => {
      return {
        ...prev,
        start: timeString[0],
        end: timeString[1],
      };
    });
  }, []);

  const daySelect = useCallback((value: any) => {
    setSelectedDay(value);
  }, []);

  const onDatePicker = useCallback((time: any, dateString: any) => {
    setSelectedDate(dateString);
  }, []);

  const saveSelectedDate = useCallback(() => {
    console.log('saveSelectedDate');
    //@ts-ignore
    setSavedDate((prev) => {
      return [
        ...prev,
        {
          day: selectedDay,
          time: selectedTime,
        },
      ];
    });
    setSelectedDay([]);
    setSelectedTime({});
  }, [selectedDay, selectedTime]);

  const deleteAddetTime = useCallback(
    (i: number) => {
      console.log('index deleted', i);
      const result = savedDate.filter((el: any, index: number) => index !== i);
      setSavedDate(result);
    },
    [savedDate]
  );

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
          rules={
            !Object.keys(savedDate).length
              ? [{ required: true, message: 'Please give a Valid day' }]
              : undefined
          }
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
                value={selectedDay}
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
                disabled={selectedDay.length ? false : true}
              />
            </Col>
            <Col offset={0.5}>
              <Button
                onClick={saveSelectedDate}
                disabled={
                  selectedDay.length && Object.keys(selectedTime).length
                    ? false
                    : true
                }
              >
                +
              </Button>
            </Col>
            <Col style={{ display: 'flex', marginTop: '1' }}>
              {savedDate &&
                savedDate.map((el: any, i: number) => (
                  <div
                    key={i}
                    className='item-highlighted'
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex' }}>
                      {'Days: '}
                      <p>{el.day[0]}</p>
                      {el.day.length > 1 ? (
                        <p>
                          {'-'}
                          {el.day[el.day.length - 1]}
                        </p>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex' }}>
                      {'Time: '}
                      <p>{el.time.start}</p>
                      {'-'}
                      <p>{el.time.end}</p>
                    </div>
                    <Button
                      style={{
                        backgroundColor: 'white',
                        color: '#3949ab',
                        borderRadius: '5px',
                        outline: '0',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 2px lightgray',
                      }}
                      onClick={() => deleteAddetTime(i)}
                    >
                      <DeleteOutlined />
                    </Button>
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
