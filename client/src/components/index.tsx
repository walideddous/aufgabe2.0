import React, { Fragment, useCallback, useState, useRef } from "react";
import { Row, Spin, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Import composents
import DragDrop from "./dragDrop/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./saveStopSequenceForm/SaveStopSequenceForm";
import LoadStopSequence from "./loadStopSequenceForm/LoadStopSequence";
import Header from "./header/Header";

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
    handleDisplayStopSequenceQuery,
    handleDeleteStopSequenceMutation,
  } = useIndexHooks();

  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);
  const [radioButton, setRadioButton] = useState<string>("");
  const [show, setShow] = useState<boolean>(true);
  const SaveRef = useRef<{
    current: { saveStopSequenceMutation: () => void };
  }>();

  const handleAbbrechenButton = () => {
    setRadioButton("");
    handleStopsQuery([]);
  };

  const handleLadenButton = () => {
    setShow(true);
    handleLoadMode(true);
    setRadioButton("laden");
  };

  const handleErstellenButton = () => {
    setShow(false);
    handleClearAll();
    handleLoadMode(false);
    setRadioButton("erstellen");
  };

  const handleSaveButton = () => {
    //@ts-ignore
    ref?.current?.saveStopSequenceMutation();
  };

  const handleDisabled = useCallback((value: boolean) => {
    setSaveButtonDisabled(value);
  }, []);

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Header
          radioButton={radioButton}
          saveButtonDisabled={saveButtonDisabled}
          currentStopSequence={currentStopSequence}
          onClearAll={handleClearAll}
          onSaveButton={handleSaveButton}
          onLadenButton={handleLadenButton}
          onErstellenButton={handleErstellenButton}
          onAbbrechenButton={handleAbbrechenButton}
          onDisplayStopSequenceQuery={handleDisplayStopSequenceQuery}
          onDeleteStopSequenceMutation={handleDeleteStopSequenceMutation}
        />
        {radioButton === "erstellen" && (
          <Col xs={24}>
            <SaveStopsSequenceForm
              ref={SaveRef}
              stateDND={stateDND}
              currentStopSequence={currentStopSequence}
              onDisabled={handleDisabled}
              onSaveStopSequenceMutation={handleSaveStopSequenceMutation}
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
              onDisplayStopSequence={handleDisplayStopSequenceQuery}
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
                {radioButton === "laden" && (
                  <Col xs={24}>
                    <SaveStopsSequenceForm
                      ref={SaveRef}
                      stateDND={stateDND}
                      currentStopSequence={currentStopSequence}
                      onDisabled={handleDisabled}
                      onSaveStopSequenceMutation={
                        handleSaveStopSequenceMutation
                      }
                    />
                  </Col>
                )}
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
