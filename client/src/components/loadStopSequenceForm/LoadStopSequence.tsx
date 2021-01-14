import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, Card, Form, Select, Button, Popconfirm } from "antd";
// Import types
import { TstateDND, TStopSequence, TformInformation } from "../../types/types";

interface TLoadStopSequence {
  show: boolean;
  stateDND: TstateDND;
  radioButton: string;
  currentMode: string[];
  formInformation: TformInformation | undefined;
  stopSequenceList: TStopSequence[];
  saveButtonDisabled: boolean;
  currentStopSequence: TStopSequence | undefined;
  onStopsQuery: (modes: string[]) => void;
  onResetRadioButton: () => void;
  onStopSequenceSearch: (name: string) => void;
  onDeleteStopSequence: (id: string) => void;
  onDisplayStopSequence: (modes: string[], key: string) => void;
  onResetFormInformation: () => void;
  onSaveStopSequenceMutation: (stopSequence: any) => void;
}

const LoadStopSequence = ({
  show,
  stateDND,
  radioButton,
  currentMode,
  formInformation,
  stopSequenceList,
  saveButtonDisabled,
  currentStopSequence,
  onStopsQuery,
  onResetRadioButton,
  onStopSequenceSearch,
  onDeleteStopSequence,
  onDisplayStopSequence,
  onResetFormInformation,
  onSaveStopSequenceMutation,
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
              disabled={
                stateDND.trajekt.items.length &&
                selectValue !== "verkehrsmittel typ auswählen"
                  ? true
                  : false
              }
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
            <Form.Item label="Haltestellensequenz Name">
              <AutoComplete
                id="stopSequence_autoComplete"
                placeholder="Geben Sie der Haltestellensequenz Namen ein"
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
          </>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            disabled={
              (radioButton === "Haltestellensequenz erstellen" &&
                stateDND.trajekt.items.length >= 2 &&
                formInformation &&
                saveButtonDisabled) ||
              (radioButton === "Haltestellensequenz laden" &&
                stateDND.trajekt.items.length >= 2 &&
                currentStopSequence &&
                saveButtonDisabled &&
                formInformation &&
                formInformation.schedule.length &&
                JSON.stringify({
                  name: formInformation.name,
                  desc: formInformation.desc,
                  schedule: formInformation.schedule,
                  stopSequence: stateDND.trajekt.items,
                }) !==
                  JSON.stringify({
                    name: currentStopSequence.name,
                    desc: currentStopSequence.desc,
                    schedule: currentStopSequence.schedule,
                    stopSequence: currentStopSequence.stopSequence,
                  }))
                ? false
                : true
            }
            onClick={() => {
              onSaveStopSequenceMutation({
                ...formInformation,
                stopSequence: stateDND.trajekt.items,
              });

              onResetFormInformation();
            }}
          >
            Speichern
          </Button>
          {currentStopSequence && (
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
              löschen
            </Button>
          )}
          <Popconfirm
            title={`Wollen Sie wirklich nicht mehr ${radioButton} ?`}
            placement="bottomRight"
            okText="Ja"
            cancelText="Nein"
            onConfirm={() => {
              onResetRadioButton();
              onStopsQuery(["verkehrsmittel typ auswählen"]);
              setSelectValue("verkehrsmittel typ auswählen");
            }}
          >
            <Button danger>Abbrechen</Button>
          </Popconfirm>
        </div>
      </Form>
    </Card>
  );
};

export default React.memo(LoadStopSequence);
