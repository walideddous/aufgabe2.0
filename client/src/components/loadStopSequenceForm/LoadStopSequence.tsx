import React, { useState, useCallback } from "react";
import { AutoComplete, Radio, Card, Form, Select, Button } from "antd";

interface TLoadStopSequence {
  stopSequenceList: any;
  currentStopSequence: any;
  loadMode: (value: boolean) => void;
  onClearAll: () => void;
  onSendRequest: (modes: string) => void;
  handleUpdateAfterSave: () => void;
  handleDeleteStopSequence: (id: string) => void;
  ondisplayStopSequence: (stopSequence: any) => void;
}

const LoadStopSequence = ({
  stopSequenceList,
  currentStopSequence,
  loadMode,
  handleUpdateAfterSave,
  onSendRequest,
  ondisplayStopSequence,
  handleDeleteStopSequence,
  onClearAll,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState("Choose mode");
  const [radioButton, setRadioButton] = useState("load");
  const [show, setShow] = useState(true);

  // Auto complete component
  const { Option } = AutoComplete;

  // handle the drop menu to display the choosed Modes on Map
  const handleModeChange = useCallback(
    (value: any) => {
      if (value !== "Choose mode ") {
        onSendRequest(value + "");
        setSelectValue(value + "");
      }
    },
    [onSendRequest]
  );

  const handleSelect = useCallback(
    (input: string) => {
      const response = stopSequenceList.filter(
        (el: any) => el.name === input
      )[0];
      if (response) {
        ondisplayStopSequence(response);
      }
    },
    [stopSequenceList, ondisplayStopSequence]
  );

  const handleRadioGroupChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      if (value === "load") {
        setShow(true);
        handleUpdateAfterSave();
        loadMode(true);
      }
      if (value === "new") {
        setShow(false);
        onClearAll();
        setSearch("");
        loadMode(false);
      }
      setRadioButton(value);
    },
    [onClearAll, handleUpdateAfterSave, loadMode]
  );

  return (
    <Card>
      <Form form={form} layout="vertical">
        <Form.Item>
          <Radio.Group
            id="radioButton"
            value={radioButton}
            onChange={handleRadioGroupChange}
          >
            <Radio.Button id="load_button" value="load">
              Load
            </Radio.Button>
            <Radio.Button id="new_button" value="new">
              New
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Modes">
          <Select
            id="mode_selector"
            value={selectValue}
            onChange={handleModeChange}
          >
            <Option value="Choose mode" id="Choose mode">
              Choose mode
            </Option>
            <Option value="13" id="13">
              13
            </Option>
            <Option value="5" id="5">
              5
            </Option>
            <Option value="8" id="8">
              8
            </Option>
            <Option value="9" id="9">
              9
            </Option>
            <Option value="2" id="2">
              2
            </Option>
            <Option value="4" id="4">
              4
            </Option>
          </Select>
        </Form.Item>
        {show && (
          <>
            <Form.Item label="Stop sequence name">
              <AutoComplete
                id="stopSequence_autoComplete"
                onChange={(input: string) => {
                  setSearch(input);
                }}
                value={search}
                onSelect={handleSelect}
                placeholder="Seach stop sequence by name"
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                id="delete_stopSequence"
                danger
                disabled={
                  search &&
                  currentStopSequence &&
                  search === currentStopSequence.name
                    ? false
                    : true
                }
                onClick={() => {
                  if (currentStopSequence) {
                    const { _id } = currentStopSequence;
                    handleDeleteStopSequence(_id);
                    setSearch("");
                  }
                }}
              >
                Delete stop sequence
              </Button>
            </div>
          </>
        )}
      </Form>
    </Card>
  );
};

export default React.memo(LoadStopSequence);
