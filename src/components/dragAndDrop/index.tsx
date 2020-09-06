import React, { useState } from 'react';
import { Timeline } from 'antd';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

//Redux
import { connect, ConnectedProps } from 'react-redux';

// Types declaration
interface GetData {
  getDataReducer: {
    data: [{ Haltestelle: string }];
  };
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const index = ({ data, selectButton }: PropsFromRedux) => {
  const handleClick = (e: any) => {
    selectButton(e);
  };

  return (
    <Timeline>
      {data &&
        data.map((el, i) => (
          <Timeline.Item key={i}>
            <Button
              type='default'
              style={{ width: '30vh' }}
              onClick={() => {
                handleClick(el);
              }}
            >
              {el.Haltestelle}
            </Button>{' '}
            <Tooltip title='search'>
              <Button type='dashed' shape='circle' icon={<DeleteOutlined />} />
            </Tooltip>
          </Timeline.Item>
        ))}
    </Timeline>
  );
};

const mapStateToProps = (state: GetData) => ({
  data: state.getDataReducer.data,
});

const mapDispatchToProps = {
  selectButton: (id: number) => ({ type: 'SELECT_BUTTON', payload: id }),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(index);
