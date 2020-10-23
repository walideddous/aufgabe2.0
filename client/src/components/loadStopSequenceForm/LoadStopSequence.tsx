import React, { useState, useCallback } from "react";
import { AutoComplete, Button, Radio, Card, Form, Select } from "antd";

interface TLoadStopSequence {
  stopSequenceList: any;
  stateDND: any;
  currentStopSequence: any;
  onClearAll: () => void;
  onSendRequest: (modes: string) => void;
  handleUpdateAfterSave: () => void;
  handleDeleteStopSequence: (id: string) => void;
  ondisplayStopSequence: (stopSequence: any) => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const LoadStopSequence = ({
  stopSequenceList,
  stateDND,
  currentStopSequence,
  handleUpdateAfterSave,
  onSendRequest,
  ondisplayStopSequence,
  handleDeleteStopSequence,
  onClearAll,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(true);

  // Auto complete component
  const { Option } = AutoComplete;

  // handle the drop menu to display the choosed Modes on Map
  const handleModeChange = useCallback(
    (value: any) => {
      if (value !== "Choose mode ") {
        onSendRequest(value);
      }
    },
    [onSendRequest]
  );

  const handleSelect = useCallback(
    (input: string) => {
      const response = stopSequenceList.filter(
        (el: any) => el.name === input
      )[0];
      ondisplayStopSequence(response);
    },
    [stopSequenceList, ondisplayStopSequence]
  );

  const handleRadioGroupChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      if (value === "load") {
        setShow(true);
        handleUpdateAfterSave();
      }
      if (value === "new") {
        setShow(false);
        onClearAll();
        setSearch("");
      }
    },
    [onClearAll, handleUpdateAfterSave]
  );

  return (
    <Card>
      <Form form={form} {...layout}>
        <Form.Item>
          <Radio.Group defaultValue="load" onChange={handleRadioGroupChange}>
            <Radio.Button value="load">Load</Radio.Button>
            <Radio.Button value="new">New</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Modes">
          <Select
            defaultValue="Choose mode"
            style={{ width: "50%" }}
            onChange={handleModeChange}
          >
            <Option value="Choose mode">Choose mode</Option>
            <Option value="13">13</Option>
            <Option value="5">5</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="2">2</Option>
            <Option value="4">4</Option>
          </Select>
        </Form.Item>
        {show && (
          <Form.Item label="Stop sequence name">
            <AutoComplete
              style={{
                width: "50%",
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
          </Form.Item>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="primary"
            danger
            disabled={stateDND.trajekt.items.length ? false : true}
            onClick={() => {
              onClearAll();
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default React.memo(LoadStopSequence);
