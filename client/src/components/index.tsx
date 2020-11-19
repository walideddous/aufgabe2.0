import React, { Fragment } from "react";
import { Row, Spin, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Import composents
import DragDrop from "./dnd/DragDrop";
import Map from "./map/Map";
import SaveStopsSequenceForm from "./form/SaveStopsSequenceForm";
import LoadStopSequence from "./loadStopSequenceForm/LoadStopSequence";

// Import Custom Hook
import useIndexHooks from "../customHooks/useIndexHooks";

// Custom Loader
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

const Aufgabe: React.FC = () => {
  const {
    stations,
    selected,
    distance,
    stateDND,
    isSending,
    stopSequenceList,
    updateDate,
    currentMode,
    currentStopSequence,
    sendRequest,
    clickOnDrop,
    handleAddStopsOnCLick,
    handleDeleteOnDND,
    onSelectAutoSearch,
    handleDragEnd,
    handleAddAfterSelected,
    handleAddBeforSelected,
    clickOnMapMarker,
    handleDeleteMarkerFromMap,
    clearAll,
    saveStopSequence,
    handledisplayStopSequence,
    handleUpdateAfterSave,
    handleDeleteStopSequence,
  } = useIndexHooks();
  return (
    <div className="Prototyp" style={{ position: "relative" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <LoadStopSequence
            stateDND={stateDND}
            stopSequenceList={stopSequenceList}
            currentStopSequence={currentStopSequence}
            onSendRequest={sendRequest}
            handleUpdateAfterSave={handleUpdateAfterSave}
            onClearAll={clearAll}
            handleDeleteStopSequence={handleDeleteStopSequence}
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
              <SaveStopsSequenceForm />
            </Col>
            <Map
              stations={stations}
              stateDND={stateDND}
              selected={selected}
              distance={distance}
              currentStopSequence={currentStopSequence}
              handleSelectAutoSearch={onSelectAutoSearch}
              onAddBeforSelected={handleAddBeforSelected}
              onAddAfterSelected={handleAddAfterSelected}
              onDeleteMarkerFromMap={handleDeleteMarkerFromMap}
              selectMarkerOnMap={clickOnMapMarker}
            />
            <Col xxl={12} xs={24}>
              <DragDrop
                stateDND={stateDND}
                selected={selected}
                handleAddStopsOnCLick={handleAddStopsOnCLick}
                handleDragEnd={handleDragEnd}
                onclick={clickOnDrop}
                onDelete={handleDeleteOnDND}
              />
            </Col>
          </Fragment>
        )}
      </Row>
    </div>
  );
};

export default Aufgabe;
