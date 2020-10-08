import React, { useState } from 'react';
import { Card, Form, Input, Checkbox, TimePicker, Row, Col } from 'antd';

// Import types
import { TstateDND } from '../type/Types';

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
  const onRangePikerTu = (time: any, timeString: any) => {
    setResult({
      ...result,
      Tu: {
        ...result.Tu,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerWe = (time: any, timeString: any) => {
    setResult({
      ...result,
      We: {
        ...result.We,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerTh = (time: any, timeString: any) => {
    setResult({
      ...result,
      Th: {
        ...result.Th,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerFr = (time: any, timeString: any) => {
    setResult({
      ...result,
      Fr: {
        ...result.Fr,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerSa = (time: any, timeString: any) => {
    setResult({
      ...result,
      Sa: {
        ...result.Sa,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerSu = (time: any, timeString: any) => {
    setResult({
      ...result,
      Su: {
        ...result.Su,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };
  const onRangePikerHoliday = (time: any, timeString: any) => {
    setResult({
      ...result,
      Holiday: {
        ...result.Holiday,
        time: {
          start: timeString[0],
          end: timeString[1],
        },
      },
    });
  };

  const onCheckBoxMo = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Mo: {
          day: 'monday',
        },
      });
    } else {
      setResult({
        ...result,
        Mo: {},
      });
    }
  };
  const onCheckBoxTu = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Tu: {
          day: 'tuesday',
        },
      });
    } else {
      setResult({
        ...result,
        Tu: {},
      });
    }
  };
  const onCheckBoxWe = (entry: any) => {
    const { checked } = entry.target;

    if (checked) {
      setResult({
        ...result,
        We: {
          day: 'wednesday',
        },
      });
    } else {
      setResult({
        ...result,
        We: {},
      });
    }
  };
  const onCheckBoxTh = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Th: {
          day: 'thursday',
        },
      });
    } else {
      setResult({
        ...result,
        Th: {},
      });
    }
  };
  const onCheckBoxFr = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Fr: {
          day: 'friday',
        },
      });
    } else {
      setResult({
        ...result,
        Fr: {},
      });
    }
  };
  const onCheckBoxSa = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Sa: {
          day: 'saturday',
        },
      });
    } else {
      setResult({
        ...result,
        Sa: {},
      });
    }
  };
  const onCheckBoxSu = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Su: {
          day: 'sunday',
        },
      });
    } else {
      setResult({
        ...result,
        Su: {},
      });
    }
  };
  const onCheckBoxHoliday = (entry: any) => {
    const { checked } = entry.target;
    if (checked) {
      setResult({
        ...result,
        Holiday: {
          day: 'holiday',
        },
      });
    } else {
      setResult({
        ...result,
        Holiday: {},
      });
    }
  };

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

        <Form.Item {...tailLayout} label='Valid' name='Valid'>
          <Row>
            <Col span={6}>
              <Checkbox value='Monday' onChange={onCheckBoxMo}>
                Mo
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerMo}
                disabled={Object.keys(result.Mo).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Tuesday' onChange={onCheckBoxTu}>
                Tu
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerTu}
                disabled={Object.keys(result.Tu).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Wednesday' onChange={onCheckBoxWe}>
                We
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerWe}
                disabled={Object.keys(result.We).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Thursday' onChange={onCheckBoxTh}>
                Th
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerTh}
                disabled={Object.keys(result.Th).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Friday' onChange={onCheckBoxFr}>
                Fr
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerFr}
                disabled={Object.keys(result.Fr).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Saturday' onChange={onCheckBoxSa}>
                Sa
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerSa}
                disabled={Object.keys(result.Sa).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Sunday' onChange={onCheckBoxSu}>
                Su
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerSu}
                disabled={Object.keys(result.Su).length ? false : true}
              />
            </Col>
            <Col span={6}>
              <Checkbox value='Holiday' onChange={onCheckBoxHoliday}>
                Holiday
              </Checkbox>
            </Col>
            <Col span={16}>
              <RangePicker
                format='HH:mm'
                onChange={onRangePikerHoliday}
                disabled={Object.keys(result.Holiday).length ? false : true}
              />
            </Col>
          </Row>
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
