import React, { Fragment, useMemo, useCallback, useState, useRef } from "react";
import { Col, Button, Dropdown, Menu, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";

// Import Type
import { TstateDND } from "./../type/Types";

interface TnavBarProps {
  stopSequenceList: any;
  savedStopSequence: any;
  updateDate: string;
  isSending: boolean;
  stateDND: TstateDND;
  currentMode: string;
  currentStopSequenceName: string;
  onSendRequest: (modes: string, currentMode: string) => void;
  onClearAll: () => void;
  handleUpdateAfterSave: () => void;
  handleDeleteStopSequence: (id: string) => void;
  ondisplayStopSequence: (stopSequenceName: any) => void;
}

const NavBar = ({
  isSending,
  stateDND,
  stopSequenceList,
  savedStopSequence,
  updateDate,
  currentMode,
  currentStopSequenceName,
  onSendRequest,
  onClearAll,
  handleUpdateAfterSave,
  handleDeleteStopSequence,
  ondisplayStopSequence,
}: TnavBarProps) => {
  const [modes, setModes] = useState<string>("");
  const [stopSequenceName, setStopSequenceName] = useState<string>("");
  const stopSequenceRef = useRef("");

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    setModes(event.item.props.children[1]);
    setStopSequenceName("");
  }, []);
  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        <Menu.Item key="2">13</Menu.Item>
        <Menu.Item key="3">5</Menu.Item>
        <Menu.Item key="4">8</Menu.Item>
        <Menu.Item key="5">9</Menu.Item>
        <Menu.Item key="6">2</Menu.Item>
        <Menu.Item key="7">4</Menu.Item>
      </Menu>
    ),
    [handleDropDownMenu]
  );

  // handle the drop menu to display the stop sequence on the map
  const handleDropDownStopsequenceMenu = useCallback(
    (event: any) => {
      if (currentStopSequenceName === event.item.props.children[1]) return;
      const response = stopSequenceList.filter(
        (el: any) => el.name === event.item.props.children[1]
      )[0];
      ondisplayStopSequence(response);
      setStopSequenceName(event.item.props.children[1]);
    },
    [stopSequenceList, currentStopSequenceName, ondisplayStopSequence]
  );

  // stop sequence drop down menu
  const stopSequenceMenu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownStopsequenceMenu}>
        {stopSequenceList &&
          stopSequenceList.map((el: any) => (
            <Menu.Item
              key={el._id}
              onClick={() => {
                stopSequenceRef.current = el._id;
              }}
            >
              {el.name}
            </Menu.Item>
          ))}
      </Menu>
    ),
    [stopSequenceList, handleDropDownStopsequenceMenu]
  );

  return (
    <Fragment>
      <Col xxl={3} xs={6} style={{ paddingTop: "20px" }}>
        <p>
          <strong>Current mode : </strong>
          {currentMode}
          <br />
          <strong>Current stop sequence : </strong>
          <br />
          {currentStopSequenceName}
        </p>
      </Col>
      <Col xxl={2} xs={6} style={{ paddingTop: "20px" }}>
        <Dropdown overlay={menu}>
          <p className="ant-dropdown-link" style={{ cursor: "pointer" }}>
            <strong>Modes : </strong>
            {modes} <DownOutlined />
          </p>
        </Dropdown>
      </Col>
      <Col xxl={3} xs={6} style={{ paddingTop: "20px", paddingLeft: "20px" }}>
        <Dropdown
          overlay={stopSequenceMenu}
          disabled={stopSequenceList.length ? false : true}
        >
          <p className="ant-dropdown-link" style={{ cursor: "pointer" }}>
            <strong>Stop sequences : </strong> <DownOutlined />
            <br />
            {stopSequenceName}
          </p>
        </Dropdown>
      </Col>
      <Col
        xxl={8}
        xs={18}
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "20px",
          paddingRight: "20px",
        }}
      >
        <Button
          type={isSending || modes !== "Choose Mode" ? "primary" : "dashed"}
          disabled={isSending || modes !== "Choose Mode" ? false : true}
          onClick={() => {
            onSendRequest(modes, currentMode);
          }}
        >
          {modes === "Choose Mode"
            ? "Select a Mode"
            : `Get data with mode ${modes}`}
        </Button>
        <Button
          style={
            stateDND.trajekt.items.length
              ? { backgroundColor: "#f5222d", color: "white" }
              : { backgroundColor: "white", color: "black" }
          }
          disabled={stateDND.trajekt.items.length ? false : true}
          onClick={() => {
            onClearAll();
          }}
        >
          Reset
        </Button>
        <Badge count={savedStopSequence.length}>
          <Button
            type="primary"
            onClick={() => {
              handleUpdateAfterSave();
            }}
            disabled={!savedStopSequence.length ? true : false}
          >
            Update
          </Button>
        </Badge>
        <Button
          style={
            currentStopSequenceName
              ? { backgroundColor: "#f5222d", color: "white" }
              : { backgroundColor: "white", color: "black" }
          }
          onClick={() => {
            handleDeleteStopSequence(stopSequenceRef.current);
          }}
        >
          Delete stop sequence
        </Button>
      </Col>
    </Fragment>
  );
};

export default NavBar;
