import React, { Fragment } from "react";
import { Col, PageHeader, Popconfirm, Button, Space } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

//Import types
import { TStopSequence } from "../../types/types";

interface Tprops {
  radioButton: string;
  saveButtonDisabled: boolean;
  currentStopSequence: TStopSequence | undefined;
  onClearAll: () => void;
  onSaveButton: () => void;
  onLadenButton: () => void;
  onErstellenButton: () => void;
  onAbbrechenButton: () => void;
  onDisplayStopSequenceQuery: (modes: string[], key: string) => void;
  onDeleteStopSequenceMutation: (key: string) => void;
}

const Header = ({
  radioButton,
  saveButtonDisabled,
  currentStopSequence,
  onClearAll,
  onSaveButton,
  onLadenButton,
  onErstellenButton,
  onAbbrechenButton,
  onDisplayStopSequenceQuery,
  onDeleteStopSequenceMutation,
}: Tprops) => {
  return (
    <Fragment>
      {radioButton === "laden" || radioButton === "erstellen" ? (
        <Col xs={24}>
          <PageHeader
            title={
              <div
                style={{
                  color: "#4383B4",
                  fontSize: "17px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <UnorderedListOutlined
                  style={{ paddingTop: "9px", paddingRight: "10px" }}
                />
                <p>{radioButton ? `Linie ${radioButton}` : `Linie manager`}</p>
              </div>
            }
            style={{ padding: "16px" }}
            extra={[
              <Space wrap key="1">
                {radioButton === "laden" && currentStopSequence && (
                  <>
                    <Button
                      type="primary"
                      htmlType="submit"
                      form="formWrapper"
                      disabled={saveButtonDisabled}
                      onClick={() => {
                        onSaveButton();
                      }}
                    >
                      Speichern
                    </Button>
                    <Popconfirm
                      title={`Wollen Sie wirklich die Linie löschen ?`}
                      placement="bottomRight"
                      okText="Ja"
                      cancelText="Nein"
                      onConfirm={() => {
                        if (currentStopSequence) {
                          const { key } = currentStopSequence;
                          onDeleteStopSequenceMutation(key);
                        }
                      }}
                    >
                      <Button danger id="delete_stopSequence">
                        löschen
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title={`Wollen Sie wirklich die Linie resetten ?`}
                      placement="bottomRight"
                      okText="Ja"
                      cancelText="Nein"
                      onConfirm={() => {
                        if (currentStopSequence) {
                          const { key, modes } = currentStopSequence;
                          onClearAll();
                          onDisplayStopSequenceQuery(modes, key);
                        }
                      }}
                    >
                      <Button danger id="delete_stopSequence">
                        Reset
                      </Button>
                    </Popconfirm>
                  </>
                )}
                {radioButton === "erstellen" && (
                  <>
                    <Button
                      type="primary"
                      htmlType="submit"
                      form="formWrapper"
                      disabled={saveButtonDisabled}
                      onClick={() => {
                        onSaveButton();
                      }}
                    >
                      Speichern
                    </Button>
                  </>
                )}
                <Popconfirm
                  title={`Wollen Sie wirklich nicht mehr die Linie ${radioButton} ?`}
                  placement="bottomRight"
                  okText="Ja"
                  cancelText="Nein"
                  onConfirm={() => {
                    onAbbrechenButton();
                  }}
                >
                  <Button type="dashed">Abbrechen</Button>
                </Popconfirm>
              </Space>,
            ]}
          />
        </Col>
      ) : (
        <Col xs={24}>
          <PageHeader
            title={
              <div
                style={{
                  color: "#4383B4",
                  fontSize: "17px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <UnorderedListOutlined
                  style={{ paddingTop: "9px", paddingRight: "10px" }}
                />
                <p>{radioButton ? `Linie ${radioButton}` : `Linie manager`}</p>
              </div>
            }
            style={{ padding: "16px" }}
            extra={[
              <Space key="1">
                <Button
                  id="load_button"
                  value="laden"
                  onClick={() => {
                    onLadenButton();
                  }}
                >
                  Laden
                </Button>
                <Button
                  id="new_button"
                  value="erstellen"
                  onClick={() => {
                    onErstellenButton();
                  }}
                >
                  Neu
                </Button>
              </Space>,
            ]}
          />
        </Col>
      )}
    </Fragment>
  );
};

export default Header;
