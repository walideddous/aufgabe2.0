import React, { Fragment, useState, useEffect } from "react";
import { Row, Spin, Col, Radio, Card } from "antd";
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
    if (currentStopSequence && radioButton === "Haltestellensequenz laden") {
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

  const handleRadioGroupChange = (e: any) => {
    const { value } = e.target;
    if (value === "Haltestellensequenz laden") {
      setShow(true);
      handleLoadMode(true);
    }
    if (value === "Haltestellensequenz erstellen") {
      setShow(false);
      handleClearAll();
      handleLoadMode(false);
    }
    setRadioButton(value);
  };

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
        {radioButton === "Haltestellensequenz laden" ||
        radioButton === "Haltestellensequenz erstellen" ? null : (
          <Col xs={24}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ color: "#4383B4", font: "17px" }}>ManagedRoute</p>
                <Radio.Group
                  id="radioButton"
                  value={radioButton}
                  onChange={handleRadioGroupChange}
                >
                  <Radio.Button
                    id="load_button"
                    value="Haltestellensequenz laden"
                  >
                    Laden
                  </Radio.Button>
                  <Radio.Button
                    id="new_button"
                    value="Haltestellensequenz erstellen"
                  >
                    Neu
                  </Radio.Button>
                </Radio.Group>
              </div>
            </Card>
          </Col>
        )}
        {radioButton && (
          <Col xs={24}>
            <LoadStopSequence
              show={show}
              stateDND={stateDND}
              radioButton={radioButton}
              currentMode={currentMode}
              formInformation={formInformation}
              stopSequenceList={stopSequenceList}
              saveButtonDisabled={saveButtonDisabled}
              currentStopSequence={currentStopSequence}
              onStopsQuery={handleStopsQuery}
              onResetRadioButton={handleResetRadioButton}
              onStopSequenceSearch={handleStopSequenceSearchQuery}
              onDeleteStopSequence={handleDeleteStopSequenceMutation}
              onDisplayStopSequence={handledisplayStopSequenceQuery}
              onResetFormInformation={handleResetFormInformation}
              onSaveStopSequenceMutation={handleSaveStopSequenceMutation}
            />
          </Col>
        )}
        {(radioButton === "Haltestellensequenz laden" && currentStopSequence) ||
        (radioButton === "Haltestellensequenz erstellen" &&
          currentMode.length) ? (
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
