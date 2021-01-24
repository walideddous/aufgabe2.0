import React, { Fragment } from 'react';
import { Row, Spin, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Import composents
import DragDrop from './dragDrop/DragDrop';
import Map from './map/Map';
import SaveManagedRouteForm from './saveManagedRouteForm/SaveManagedRouteForm';
import LoadManagedRouteForm from './loadManagedRouteForm/LoadManagedRouteForm';
import Header from './header/Header';

// Import Custom Hook
import useIndexHooks from '../customHooks/useIndexHooks';

import '../App.css';

// Import antd & leaflet
import 'antd/dist/antd.css';
import 'leaflet/dist/leaflet.css';

// Custom Loader
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;

const MainRoot: React.FC = () => {
  const {
    stops,
    SaveRef,
    distance,
    isSending,
    currentMode,
    stopSequence,
    selectedStop,
    managedRoutes,
    toggleLoadOrNew,
    currentManagedRoute,
    clickedHeaderButton,
    isHeaderSaveButtonDisabled,
    handleDragEnd,
    handleClearAll,
    handleDeleteStop,
    handleStopsQuery,
    handleClickOnDrop,
    handleAddStopsOnCLick,
    handleSelectAutoSearch,
    handleClickOnMapMarker,
    handleResetManagedRoute,
    handleAddBeforselectedStop,
    handleLoadManagedRouteQuery,
    handleClickOnHeaderNewButton,
    handleClickOnHeaderLoadButton,
    handleClickOnHeaderSaveButton,
    handleSearchManagedRouteQuery,
    handleSaveManagedRouteMutation,
    handleClickOnHeaderCancelButton,
    handleDeleteManagedRouteMutation,
    handleIsHeaderSaveButtonDisabled,
  } = useIndexHooks();

  return (
    <div className='Prototyp' style={{ position: 'relative' }}>
      <Row gutter={[8, 8]}>
        <Header
          clickedHeaderButton={clickedHeaderButton}
          isHeaderSaveButtonDisabled={isHeaderSaveButtonDisabled}
          currentManagedRoute={currentManagedRoute}
          onClearAll={handleClearAll}
          onCLickOnHeaderSaveButton={handleClickOnHeaderSaveButton}
          onClickOnHeaderLoadButton={handleClickOnHeaderLoadButton}
          onClickOnHeaderNewButton={handleClickOnHeaderNewButton}
          onClickOnHeaderCancelButton={handleClickOnHeaderCancelButton}
          onLoadManagedRouteQuery={handleLoadManagedRouteQuery}
          onDeleteManagedRouteMutation={handleDeleteManagedRouteMutation}
        />
        {clickedHeaderButton === 'erstellen' && (
          <Col xs={24}>
            <SaveManagedRouteForm
              ref={SaveRef}
              stopSequence={stopSequence}
              currentManagedRoute={currentManagedRoute}
              onIsHeaderSaveButtonDisabled={handleIsHeaderSaveButtonDisabled}
              onSaveManagedRouteMutation={handleSaveManagedRouteMutation}
            />
          </Col>
        )}
        {clickedHeaderButton && (
          <Col xs={24}>
            <LoadManagedRouteForm
              toggleLoadOrNew={toggleLoadOrNew}
              stopSequence={stopSequence}
              managedRoutes={managedRoutes}
              currentManagedRoute={currentManagedRoute}
              onStopsQuery={handleStopsQuery}
              onSearchManagedRouteQuery={handleSearchManagedRouteQuery}
              onLoadManagedRouteQuery={handleLoadManagedRouteQuery}
            />
          </Col>
        )}
        {(clickedHeaderButton === 'laden' && currentManagedRoute) ||
        (clickedHeaderButton === 'erstellen' && currentMode.length) ? (
          <>
            {isSending ? (
              <div
                style={{
                  marginTop: '20%',
                  marginLeft: '50%',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Spin
                  indicator={antIcon}
                  style={{
                    display: 'flex',
                  }}
                />
              </div>
            ) : (
              <Fragment>
                {clickedHeaderButton === 'laden' && (
                  <Col xs={24}>
                    <SaveManagedRouteForm
                      ref={SaveRef}
                      stopSequence={stopSequence}
                      currentManagedRoute={currentManagedRoute}
                      onIsHeaderSaveButtonDisabled={
                        handleIsHeaderSaveButtonDisabled
                      }
                      onSaveManagedRouteMutation={
                        handleSaveManagedRouteMutation
                      }
                    />
                  </Col>
                )}
                <Col xxl={24} xs={24} style={{ height: '500px' }}>
                  <Map
                    stops={stops}
                    stopSequence={stopSequence}
                    selectedStop={selectedStop}
                    distance={distance}
                    currentManagedRoute={currentManagedRoute}
                    onDeleteStop={handleDeleteStop}
                    onAddAfterSelectedStop={handleAddStopsOnCLick}
                    onSelectAutoSearch={handleSelectAutoSearch}
                    onClickOnMapMarker={handleClickOnMapMarker}
                    onAddBeforSelectedStop={handleAddBeforselectedStop}
                    onResetManagedRoute={handleResetManagedRoute}
                  />
                </Col>
                <Col xxl={24} xs={24} style={{ padding: 0 }}>
                  <DragDrop
                    stopSequence={stopSequence}
                    selectedStop={selectedStop}
                    onDragEnd={handleDragEnd}
                    onDeleteStop={handleDeleteStop}
                    onClickOnDrop={handleClickOnDrop}
                    onAddStopsOnCLick={handleAddStopsOnCLick}
                    onResetManagedRoute={handleResetManagedRoute}
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
