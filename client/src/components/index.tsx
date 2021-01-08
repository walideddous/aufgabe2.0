import React, { Fragment } from "react";
import { Row, Spin, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <LoadStopSequence
            currentMode={currentMode}
            stopSequenceList={stopSequenceList}
            currentStopSequence={currentStopSequence}
            onStopSequenceSearch={handleStopSequenceSearchQuery}
            onLoadMode={handleLoadMode}
            onStopsQuery={handleStopsQuery}
            onClearAll={handleClearAll}
            onDeleteStopSequence={handleDeleteStopSequenceMutation}
            ondisplayStopSequence={handledisplayStopSequenceQuery}
          />
        </Col>
        {isSending ? (
          <div
            style={{
              marginTop: "20%",
              marginLeft: "50%",
              marginRight: " -50%",
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
                stateDND={stateDND}
                currentStopSequence={currentStopSequence}
                loadStopSequenceSection={loadStopSequenceSection}
                onSaveStopSequence={handleSaveStopSequenceMutation}
              />
            </Col>
            <Col xxl={24} xs={24} style={{ height: "60vh" }}>
              <Map
                stations={stations}
                stateDND={stateDND}
                selected={selected}
                distance={distance}
                currentStopSequence={currentStopSequence}
                onResetStopSequence={handleResetStopSequence}
                onSelectAutoSearch={handleSelectAutoSearch}
                onAddBeforSelected={handleAddBeforSelected}
                onAddAfterSelected={handleAddStopsOnCLick}
                onDeleteStop={handleDeleteStop}
                onClickOnMapMarker={handleClickOnMapMarker}
              />
            </Col>
            <Col xxl={24} xs={24}>
              <DragDrop
                stateDND={stateDND}
                selected={selected}
                onResetStopSequence={handleResetStopSequence}
                onAddStopsOnCLick={handleAddStopsOnCLick}
                onDragEnd={handleDragEnd}
                onClickOnDrop={handleClickOnDrop}
                onDeleteStop={handleDeleteStop}
              />
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default MainRoot;
