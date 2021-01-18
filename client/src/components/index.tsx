import React, { Fragment, useCallback, useState, useRef } from "react";
import { Row, Spin, Col, PageHeader, Popconfirm, Button } from "antd";
import { LoadingOutlined, UnorderedListOutlined } from "@ant-design/icons";

// Import composents
import DragDrop from "./dragDrop/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./saveStopSequenceForm/SaveStopSequenceForm";
import LoadStopSequence from "./loadStopSequenceForm/LoadStopSequence";

// Import Custom Hook
import useIndexHooks from "../customHooks/useIndexHooks";

import "../App.css";

// Import antd & leaflet
import "antd/dist/antd.css";
import "leaflet/dist/leaflet.css";

// Custom Loader
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

const MainRoot: React.FC = () => {
  const {
    stations,
    selected,
    distance,
    stateDND,
    isSending,
    currentMode,
    stopSequenceList,
    currentStopSequence,
    handleDragEnd,
    handleLoadMode,
    handleClearAll,
    handleDeleteStop,
    handleClickOnDrop,
    handleAddStopsOnCLick,
    handleSelectAutoSearch,
    handleAddBeforSelected,
    handleClickOnMapMarker,
    handleResetStopSequence,
    handleStopsQuery,
    handleStopSequenceSearchQuery,
    handleSaveStopSequenceMutation,
    handledisplayStopSequenceQuery,
    handleDeleteStopSequenceMutation,
  } = useIndexHooks();

  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);
  const [radioButton, setRadioButton] = useState<string>("");
  const [show, setShow] = useState<boolean>(true);
  const ref = useRef<{ current: { saveStopSequenceMutation: () => void } }>();

  const handleDisabled = useCallback((value: boolean) => {
    setSaveButtonDisabled(value);
  }, []);

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
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
                  <p>
                    {radioButton ? `Linie ${radioButton}` : `Linie manager`}
                  </p>
                </div>
              }
              style={{ padding: "16px" }}
              extra={[
                <div key="1">
                  <Button
                    type="primary"
                    htmlType="submit"
                    form="formWrapper"
                    disabled={saveButtonDisabled}
                    onClick={() => {
                      //@ts-ignore
                      ref?.current?.saveStopSequenceMutation();
                    }}
                  >
                    Speichern
                  </Button>
                  {currentStopSequence && (
                    <>
                      <Popconfirm
                        title={`Wollen Sie wirklich die Linie löschen ?`}
                        placement="bottomRight"
                        okText="Ja"
                        cancelText="Nein"
                        onConfirm={() => {
                          if (currentStopSequence) {
                            const { key } = currentStopSequence;
                            handleDeleteStopSequenceMutation(key);
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
                            handleClearAll();
                            handledisplayStopSequenceQuery(modes, key);
                          }
                        }}
                      >
                        <Button danger id="delete_stopSequence">
                          Reset
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  <Popconfirm
                    title={`Wollen Sie wirklich nicht mehr die Linie ${radioButton} ?`}
                    placement="bottomRight"
                    okText="Ja"
                    cancelText="Nein"
                    onConfirm={() => {
                      setRadioButton("");
                      handleStopsQuery([]);
                    }}
                  >
                    <Button type="dashed">Abbrechen</Button>
                  </Popconfirm>
                </div>,
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
                  <p>
                    {radioButton ? `Linie ${radioButton}` : `Linie manager`}
                  </p>
                </div>
              }
              style={{ padding: "16px" }}
              extra={[
                <Fragment key="1">
                  <Button
                    id="load_button"
                    value="laden"
                    onClick={() => {
                      setShow(true);
                      handleLoadMode(true);
                      setRadioButton("laden");
                    }}
                  >
                    Laden
                  </Button>
                  <Button
                    id="new_button"
                    value="erstellen"
                    onClick={() => {
                      setShow(false);
                      handleClearAll();
                      handleLoadMode(false);
                      setRadioButton("erstellen");
                    }}
                  >
                    Neu
                  </Button>
                </Fragment>,
              ]}
            />
          </Col>
        )}
        {radioButton && (
          <Col xs={24}>
            <LoadStopSequence
              show={show}
              stateDND={stateDND}
              stopSequenceList={stopSequenceList}
              currentStopSequence={currentStopSequence}
              onStopsQuery={handleStopsQuery}
              onStopSequenceSearch={handleStopSequenceSearchQuery}
              onDisplayStopSequence={handledisplayStopSequenceQuery}
            />
          </Col>
        )}
        {(radioButton === "laden" && currentStopSequence) ||
        (radioButton === "erstellen" && currentMode.length) ? (
          <>
            {isSending ? (
              <div
                style={{
                  marginTop: "20%",
                  marginLeft: "50%",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Spin
                  indicator={antIcon}
                  style={{
                    display: "flex",
                  }}
                />
              </div>
            ) : (
              <Fragment>
                <Col xs={24}>
                  <SaveStopsSequenceForm
                    ref={ref}
                    stateDND={stateDND}
                    currentStopSequence={currentStopSequence}
                    onDisabled={handleDisabled}
                    onSaveStopSequenceMutation={handleSaveStopSequenceMutation}
                  />
                </Col>
                <Col xxl={24} xs={24} style={{ height: "500px" }}>
                  <Map
                    stations={stations}
                    stateDND={stateDND}
                    selected={selected}
                    distance={distance}
                    currentStopSequence={currentStopSequence}
                    onDeleteStop={handleDeleteStop}
                    onAddAfterSelected={handleAddStopsOnCLick}
                    onSelectAutoSearch={handleSelectAutoSearch}
                    onClickOnMapMarker={handleClickOnMapMarker}
                    onAddBeforSelected={handleAddBeforSelected}
                    onResetStopSequence={handleResetStopSequence}
                  />
                </Col>
                <Col xxl={24} xs={24} style={{ padding: 0 }}>
                  <DragDrop
                    stateDND={stateDND}
                    selected={selected}
                    onDragEnd={handleDragEnd}
                    onDeleteStop={handleDeleteStop}
                    onClickOnDrop={handleClickOnDrop}
                    onAddStopsOnCLick={handleAddStopsOnCLick}
                    onResetStopSequence={handleResetStopSequence}
                  />
                </Col>
              </Fragment>
            )}
          </>
        ) : null}
      </Row>
    </div>
  );
};

export default MainRoot;
