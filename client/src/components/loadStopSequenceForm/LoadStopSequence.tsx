import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, Radio, Card, Form, Select, Button } from "antd";
// Import types
import { TStopSequence } from "../../types/types";

interface TLoadStopSequence {
  stopSequenceList: TStopSequence[];
  currentStopSequence: TStopSequence | undefined;
  currentMode: string[];
  onStopSequenceSearch: (name: string) => void;
  onLoadMode: (value: boolean) => void;
  onStopsQuery: (modes: string[]) => void;
  onClearAll: () => void;
  onDeleteStopSequence: (id: string) => void;
  ondisplayStopSequence: (modes: string[], key: string) => void;
}

const LoadStopSequence = ({
  stopSequenceList,
  currentStopSequence,
  currentMode,
  onStopSequenceSearch,
  onLoadMode,
  onStopsQuery,
  onClearAll,
  onDeleteStopSequence,
  ondisplayStopSequence,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("Modus auswählen");
  const [radioButton, setRadioButton] = useState<string>("load");
  const [show, setShow] = useState<boolean>(true);

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
      }, 200);

      return () => clearTimeout(dispatchRequest);
    }
  }, [search, onStopSequenceSearch]);

  // handle the drop menu to display the choosed Modes on Map
  const handleModeChange = useCallback(
    (value: string) => {
      if (value !== "Modus auswählen") {
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
        ondisplayStopSequence(response.modes, options.key);
      }
    },
    [stopSequenceList, ondisplayStopSequence]
  );

  const handleRadioGroupChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      if (value === "load") {
        setShow(true);
        onLoadMode(true);
      }
      if (value === "new") {
        setShow(false);
        onClearAll();
        setSearch("");
        onLoadMode(false);
      }
      setRadioButton(value);
    },
    [onClearAll, onLoadMode]
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
              Laden
            </Radio.Button>
            <Radio.Button id="new_button" value="new">
              Neu
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {!show && (
          <Form.Item label="Modus">
            <Select
              id="mode_selector"
              value={selectValue}
              onChange={handleModeChange}
            >
              <Option value="Modus auswählen" id="Modus auswählen">
                Modus auswählen
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
                      onDeleteStopSequence(_id);
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
