import React, { useState, useMemo, useCallback } from "react";
import { AutoComplete, Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface TLoadStopSequence {
  stopSequenceList: any;
  onNewStopSequenceButton: () => void;
  ondisplayStopSequence: (stopSequenceName: any) => void;
}
const LoadStopSequence = ({
  stopSequenceList,
  onNewStopSequenceButton,
  ondisplayStopSequence,
}: TLoadStopSequence) => {
  const [search, setSearch] = useState("");
  const [modes, setModes] = useState("All");

  // Auto complete component
  const { Option } = AutoComplete;

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback((event: any) => {
    setModes(event.item.props.children[1]);
  }, []);

  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        <Menu.Item key="1">All</Menu.Item>
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

  const handleSelect = useCallback(
    (input: string, data: any) => {
      const mode = stopSequenceList.filter((el: any) => el._id === data.key)[0]
        .modes;
      const response = stopSequenceList.filter(
        (el: any) => el.name === input
      )[0];
      setModes(mode);
      ondisplayStopSequence(response);
    },
    [stopSequenceList, ondisplayStopSequence]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <p>
        <strong>Stop sequence name : </strong>
      </p>
      <AutoComplete
        style={{
          width: "40%",
        }}
        onChange={(input: string) => {
          setSearch(input);
        }}
        onSelect={handleSelect}
        value={search}
        placeholder="Enter stop sequence name"
        allowClear={true}
      >
        {stopSequenceList &&
          stopSequenceList
            .filter((el: any) => (modes === "All" ? el : el.modes === modes))
            .filter((el: any) =>
              el.name
                .toLowerCase()
                .startsWith(search ? search.toLowerCase() : "")
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
          {modes} <DownOutlined />
        </p>
      </Dropdown>
      <Button
        type="primary"
        onClick={() => {
          onNewStopSequenceButton();
        }}
      >
        New stop sequence
      </Button>
    </div>
  );
};

export default React.memo(LoadStopSequence);
