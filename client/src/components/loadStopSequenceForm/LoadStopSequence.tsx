import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, Form, Select, Collapse } from "antd";
// Import types
import { TstateDND, TStopSequence } from "../../types/types";

interface TLoadStopSequence {
  show: boolean;
  stateDND: TstateDND;
  stopSequenceList: TStopSequence[];
  currentStopSequence: TStopSequence | undefined;
  onStopsQuery: (modes: string[]) => void;
  onStopSequenceSearch: (name: string) => void;
  onDisplayStopSequence: (modes: string[], key: string) => void;
}
const { Panel } = Collapse;

const LoadStopSequence = ({
  show,
  stateDND,
  stopSequenceList,
  currentStopSequence,
  onStopsQuery,
  onStopSequenceSearch,
  onDisplayStopSequence,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>("");
  const [collapseOpen, setCollapseOpen] = useState<boolean>(true);

  // Auto complete component
  const { Option } = AutoComplete;

  // implementing the debouncing
  useEffect(() => {
    if (search) {
      const dispatchRequest = setTimeout(() => {
        onStopSequenceSearch(search);
      }, 1000);

      return () => clearTimeout(dispatchRequest);
    }
  }, [search, onStopSequenceSearch]);

  // handle the drop menu to display the choosed Modes on Map
  const handleModeChange = useCallback(
    (value: string) => {
      onStopsQuery([value + ""]);
      setCollapseOpen(false);
    },
    [onStopsQuery]
  );

  const handleSelect = useCallback(
    (input: string, options) => {
      const response = stopSequenceList.filter(
        (el: any) => el.key === options.key
      )[0];
      if (response && response.key !== currentStopSequence?.key) {
        onDisplayStopSequence(response.modes, options.key);
        setCollapseOpen(false);
        setSearch("");
      }
    },
    [stopSequenceList, currentStopSequence, onDisplayStopSequence]
  );

  return (
    <Collapse
      defaultActiveKey={"1"}
      activeKey={collapseOpen ? "1" : "2"}
      onChange={() => {
        setCollapseOpen(!collapseOpen);
      }}
    >
      <Panel header={!show ? "Verkehrsmitteltyp" : "Linienname suchen"} key="1">
        <Form form={form} layout="vertical">
          {!show && (
            <Form.Item>
              <Select
                id="mode_selector"
                placeholder="Wählen Sie einen Vehrkehsmitteltyp aus"
                disabled={stateDND.trajekt.items.length ? true : false}
                onChange={handleModeChange}
              >
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
          )}
          {show && (
            <Form.Item>
              <AutoComplete
                id="stopSequence_autoComplete"
                placeholder="Geben Sie dem Linienname ein"
                allowClear={true}
                value={search}
                onChange={(input: string) => {
                  setSearch(input);
                }}
                onSelect={handleSelect}
              >
                {stopSequenceList &&
                  stopSequenceList.map((el: any) => (
                    <Option value={el.name} key={el.key}>
                      {el.name}
                    </Option>
                  ))}
              </AutoComplete>
            </Form.Item>
          )}
        </Form>
      </Panel>
    </Collapse>
  );
};

export default React.memo(LoadStopSequence);
