import React, { Fragment, useState, useEffect } from "react";
import { Row, Spin, Col, PageHeader, Popconfirm, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Import composents
import DragDrop from "./dragDrop/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./saveStopSequenceForm/SaveStopSequenceForm";
import LoadStopSequence from "./loadStopSequenceForm/LoadStopSequence";

// Import Custom Hook
import useIndexHooks from "../customHooks/useIndexHooks";
// Types
import { TformInformation } from "../types/types";

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
    loadStopSequenceSection,
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

  const [formInformation, setFormInformation] = useState<TformInformation>();
  const [radioButton, setRadioButton] = useState<string>("");
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    if (currentStopSequence && radioButton === "laden") {
      setFormInformation({
        _id: currentStopSequence._id,
        key: currentStopSequence.key,
        modes: currentStopSequence.modes,
        name: currentStopSequence.name,
        desc: currentStopSequence.desc,
        schedule: currentStopSequence.schedule,
        created: currentStopSequence.created,
        modified: currentStopSequence.modified,
      });
    } else {
      setFormInformation(undefined);
    }
  }, [currentStopSequence, radioButton]);

  const handleSaveForm = (form: any) => {
    setFormInformation(form);
  };

  const handleDeleteSchedule = () => {
    if (formInformation) {
      setFormInformation((prev: any) => {
        return {
          ...prev,
          schedule: [],
        };
      });
    }
  };

  const handleResetFormInformation = () => {
    setFormInformation(undefined);
  };

  const handleResetRadioButton = () => {
    setRadioButton("");
  };

  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);

  const handledisabled = (value: boolean) => {
    setSaveButtonDisabled(value);
  };

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        {radioButton === "laden" || radioButton === "erstellen" ? (
          <Col xs={24}>
            <PageHeader
              title={`Route manager ${radioButton}`}
              style={{ padding: "24px" }}
              extra={[
                <Fragment key="1">
                  <Button
                    type="primary"
                    disabled={
                      (radioButton === "erstellen" &&
                        stateDND.trajekt.items.length >= 2 &&
                        formInformation &&
                        saveButtonDisabled) ||
                      (radioButton === "laden" &&
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
                      handleSaveStopSequenceMutation({
                        ...formInformation,
                        stopSequence: stateDND.trajekt.items,
                      });

                      handleResetFormInformation();
                    }}
                  >
                    Speichern
                  </Button>
                  {currentStopSequence && (
                    <Button
                      danger
                      id="delete_stopSequence"
                      disabled={currentStopSequence ? false : true}
                      onClick={() => {
                        if (currentStopSequence) {
                          const { key } = currentStopSequence;
                          handleDeleteStopSequenceMutation(key);
                        }
                      }}
                    >
                      löschen
                    </Button>
                  )}
                  <Popconfirm
                    title={`Wollen Sie wirklich nicht mehr route manager ${radioButton} ?`}
                    placement="bottomRight"
                    okText="Ja"
                    cancelText="Nein"
                    onConfirm={() => {
                      handleResetRadioButton();
                      handleStopsQuery([]);
                    }}
                  >
                    <Button type="dashed">Abbrechen</Button>
                  </Popconfirm>
                </Fragment>,
              ]}
            />
          </Col>
        ) : (
          <Col xs={24}>
            <PageHeader
              title={`Route manager ${radioButton}`}
              style={{ padding: "24px" }}
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
                    formInformation={formInformation}
                    loadStopSequenceSection={loadStopSequenceSection}
                    saveForm={handleSaveForm}
                    onDisabled={handledisabled}
                    deleteSchedule={handleDeleteSchedule}
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
