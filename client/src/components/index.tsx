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
    handleStopSequenceSearch,
    handleLoadMode,
    handleSendRequest,
    handleClickOnDrop,
    handleAddStopsOnCLick,
    handleDeleteOnDND,
    handleSelectAutoSearch,
    handleDragEnd,
    handleAddAfterSelected,
    handleAddBeforSelected,
    handleClickOnMapMarker,
    handleDeleteMarkerFromMap,
    handleClearAll,
    handleResetStopSequence,
    handleSaveStopSequence,
    handledisplayStopSequence,
    handleDeleteStopSequence,
  } = useIndexHooks();

  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <LoadStopSequence
            currentMode={currentMode}
            stopSequenceList={stopSequenceList}
            currentStopSequence={currentStopSequence}
            onStopSequenceSearch={handleStopSequenceSearch}
            onLoadMode={handleLoadMode}
            onSendRequest={handleSendRequest}
            onClearAll={handleClearAll}
            onDeleteStopSequence={handleDeleteStopSequence}
            ondisplayStopSequence={handledisplayStopSequence}
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
                onSaveStopSequence={handleSaveStopSequence}
              />
            </Col>
            <Col xxl={12} xs={24} style={{ height: "60vh" }}>
              <Map
                stations={stations}
                stateDND={stateDND}
                selected={selected}
                distance={distance}
                currentStopSequence={currentStopSequence}
                onResetStopSequence={handleResetStopSequence}
                onSelectAutoSearch={handleSelectAutoSearch}
                onAddBeforSelected={handleAddBeforSelected}
                onAddAfterSelected={handleAddAfterSelected}
                onDeleteMarkerFromMap={handleDeleteMarkerFromMap}
                onClickOnMapMarker={handleClickOnMapMarker}
              />
            </Col>
            <Col xxl={12} xs={24}>
              <DragDrop
                stateDND={stateDND}
                selected={selected}
                onResetStopSequence={handleResetStopSequence}
                onAddStopsOnCLick={handleAddStopsOnCLick}
                onDragEnd={handleDragEnd}
                onClickOnDrop={handleClickOnDrop}
                onDeleteDND={handleDeleteOnDND}
              />
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default MainRoot;
