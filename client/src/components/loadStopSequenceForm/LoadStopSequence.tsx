import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, Card, Form, Select, Button } from "antd";
// Import types
import { TStopSequence } from "../../types/types";

interface TLoadStopSequence {
  show: boolean;
  currentMode: string[];
  stopSequenceList: TStopSequence[];
  currentStopSequence: TStopSequence | undefined;
  onStopsQuery: (modes: string[]) => void;
  onStopSequenceSearch: (name: string) => void;
  onDeleteStopSequence: (id: string) => void;
  onDisplayStopSequence: (modes: string[], key: string) => void;
}

const LoadStopSequence = ({
  show,
  currentMode,
  stopSequenceList,
  currentStopSequence,
  onStopsQuery,
  onStopSequenceSearch,
  onDeleteStopSequence,
  onDisplayStopSequence,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>(
    "verkehrsmittel typ auswählen"
  );

  // Auto complete component
  const { Option } = AutoComplete;

  useEffect(() => {
    if (currentMode[0]) {
      setSelectValue(currentMode[0] + "");
    }
  }, [currentMode]);

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
      if (value !== "verkehrsmittel typ auswählen") {
        onStopsQuery([value + ""]);
        setSelectValue(value + "");
      }
    },
    [onStopsQuery]
  );

  const handleSelect = useCallback(
    (input: string, options) => {
      const response = stopSequenceList.filter(
        (el: any) => el.key === options.key
      )[0];
      if (response) {
        onDisplayStopSequence(response.modes, options.key);
      }
    },
    [stopSequenceList, onDisplayStopSequence]
  );

  return (
    <Card>
      <Form form={form} layout="vertical">
        {!show && (
          <Form.Item label="Verkehrsmittel typ">
            <Select
              id="mode_selector"
              value={selectValue}
              onChange={handleModeChange}
            >
              <Option value="verkehrsmittel typ auswählen" id="Modus_auswählen">
                verkehrsmittel typ auswählen
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
        )}
        {show && (
          <>
            <Form.Item label="Haltestellensequenz name">
              <AutoComplete
                id="stopSequence_autoComplete"
                onChange={(input: string) => {
                  setSearch(input);
                }}
                value={search}
                onSelect={handleSelect}
                placeholder="Haltestellensequenz nach Namen suchen"
                allowClear={true}
              >
                {stopSequenceList &&
                  stopSequenceList.map((el: any) => (
                    <Option value={el.name} key={el.key}>
                      {el.name}
                    </Option>
                  ))}
              </AutoComplete>
            </Form.Item>
            {currentStopSequence && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  danger
                  id="delete_stopSequence"
                  disabled={
                    search &&
                    currentStopSequence &&
                    search === currentStopSequence.name
                      ? false
                      : true
                  }
                  onClick={() => {
                    if (currentStopSequence) {
                      const { key } = currentStopSequence;
                      onDeleteStopSequence(key);
                      setSearch("");
                    }
                  }}
                >
                  Haltestellensequenz löschen
                </Button>
              </div>
            )}
          </>
        )}
      </Form>
    </Card>
  );
};

export default React.memo(LoadStopSequence);
