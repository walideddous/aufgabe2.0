import React, { useMemo, useCallback, useState } from "react";
import { Card, Dropdown, Menu, Col, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface Tprops {
  onGetStopSequenceBotton : () => void
  stopSequenceList: any
}

const GetStopSequence = ({onGetStopSequenceBotton, stopSequenceList}: Tprops) => {
  const [stopSequenceName, setStopSequenceName] = useState("");
  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    setStopSequenceName(event.item.props.children[1]);
  }, []);

  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        { stopSequenceList&& stopSequenceList.map((el:any)=> <Menu.Item key="2">{el.name}</Menu.Item> )}
      </Menu>
    ),
    [stopSequenceList]
  );

  return (
    <Card>
      <Row>
        <Col span={12}>
          <Dropdown overlay={menu} disabled={stopSequenceList ? false : true}>
            <p className="ant-dropdown-link" style={ stopSequenceList ? { cursor: "pointer" } : {}}>
              <strong>Stop sequence name : </strong>
              {stopSequenceName} <DownOutlined />
            </p>
          </Dropdown>
        </Col>
        <Col span={12}>
          <button
            style={{
              width: "50%",
              margin: 1,
              backgroundColor: "white",
              cursor: "pointer",
              color: "black",
              borderRadius: "5px",
              outline: "0",
              boxShadow: "0px 2px 2px lightgray",
            }}
            onClick={()=> {
              onGetStopSequenceBotton()
            }}
          >
            Get stop sequence
          </button>
        </Col>
      </Row>
    </Card>
  );
};

export default GetStopSequence;
