import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AutoComplete, Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const LoadStopSequence = () => {
  const [stopSeuqneceList, setStopSequenceList] = useState([]);
  const [search, setSearch] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  useEffect(() => {}, []);

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    console.log("event.item.props.children[1]", event.item.props.children[1]);
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

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <AutoComplete
        //onSelect={}
        //onChange={}
        //value={search}
        placeholder="Enter stop sequence name"
        open={search ? true : false}
      >
        {stopSeuqneceList &&
          stopSeuqneceList
            .filter((el: any) =>
              el.name.toLowerCase().startsWith(search.toLowerCase())
            )
            .map((el: any) => (
              <Option value={el.name} key={el._id}>
                <i
                  className="fas fa-subway"
                  style={{ color: "#1890ff", margin: "0 10px" }}
                ></i>
                {el.name}
              </Option>
            ))}
      </AutoComplete>
      <Dropdown overlay={menu}>
        <p className="ant-dropdown-link" style={{ cursor: "pointer" }}>
          <strong>Modes : </strong>
          <DownOutlined />
        </p>
      </Dropdown>
      <Button type="primary">New stop sequence</Button>
    </div>
  );
};

export default LoadStopSequence;
