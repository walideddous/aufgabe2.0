import React, { Fragment, useMemo, useCallback, useState } from 'react';
import { Col, Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// Import Type
import { TstateDND } from './../type/Types';

interface TnavBarProps {
  stopSequenceList: any;
  updateDate?: string;
  isSending: boolean;
  stateDND: TstateDND;
  onSendRequest: (modes: string, currentMode: string) => void;
  onClearAll: () => void;
}

const NavBar = ({
  isSending,
  stateDND,
  onSendRequest,
  onClearAll,
  stopSequenceList,
  updateDate,
}: TnavBarProps) => {
  const [modes, setModes] = useState<string>('Choose Mode');
  const [currentMode, setCurrentMode] = useState<string>('');

  const [stopSequenceName, setStopSequenceName] = useState<string>('');

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    setModes(event.item.props.children[1]);
  }, []);
  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        <Menu.Item key='2'>13</Menu.Item>
        <Menu.Item key='3'>5</Menu.Item>
        <Menu.Item key='4'>8</Menu.Item>
        <Menu.Item key='5'>9</Menu.Item>
        <Menu.Item key='6'>2</Menu.Item>
        <Menu.Item key='7'>4</Menu.Item>
      </Menu>
    ),
    [handleDropDownMenu]
  );

  // handle the drop menu to display the stop sequence on the map
  const handleDropDownStopsequenceMenu = useCallback((event: any) => {
    setStopSequenceName(event.item.props.children[1]);
  }, []);

  // stop sequence drop down menu
  const stopSequenceMenu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownStopsequenceMenu}>
        {stopSequenceList &&
          stopSequenceList.map((el: any) => (
            <Menu.Item key='2'>{el.name}</Menu.Item>
          ))}
      </Menu>
    ),
    [stopSequenceList, handleDropDownStopsequenceMenu]
  );
  return (
    <Fragment>
      <Col lg={3} xs={12}>
        <Dropdown
          overlay={stopSequenceMenu}
          disabled={stopSequenceList.length ? false : true}
        >
          <p
            className='ant-dropdown-link'
            style={
              stopSequenceList.length
                ? { cursor: 'pointer', margin: 20 }
                : { margin: 20 }
            }
          >
            <strong>Stop sequence name : </strong>
            {stopSequenceName} <DownOutlined />
          </p>
        </Dropdown>
      </Col>
      <Col lg={3} xs={12}>
        <p style={{ margin: 20 }}>
          <strong>Current mode : </strong>
          {currentMode}
          <br />
          <strong>Update at : </strong>
          {updateDate}
        </p>
      </Col>
      <Col lg={3} xs={12}>
        <Dropdown overlay={menu}>
          <p
            className='ant-dropdown-link'
            style={{ margin: 20, cursor: 'pointer' }}
          >
            <strong>Modes : </strong>
            {modes} <DownOutlined />
          </p>
        </Dropdown>
      </Col>
      <Col
        lg={6}
        xs={12}
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Button
          type={isSending || modes !== 'Choose Mode' ? 'primary' : 'dashed'}
          disabled={isSending || modes !== 'Choose Mode' ? false : true}
          onClick={() => {
            setCurrentMode(modes);
            onSendRequest(modes, currentMode);
          }}
        >
          {modes === 'Choose Mode'
            ? 'Select a Mode'
            : `Get the Data and the stop Sequences with mode ${modes}`}
        </Button>
        <Button
          type={isSending || modes !== 'Choose Mode' ? 'link' : 'dashed'}
          disabled={stateDND.trajekt.items.length ? false : true}
          onClick={() => {
            onClearAll();
          }}
        >
          Reset
        </Button>
      </Col>
    </Fragment>
  );
};

export default NavBar;
