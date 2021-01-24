import React, { Fragment } from 'react';
import { Col, PageHeader, Popconfirm, Button, Space } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

//Import types
import { TManagedRoute } from '../../types/types';

interface Tprops {
  clickedHeaderButton: string;
  isHeaderSaveButtonDisabled: boolean;
  currentManagedRoute: TManagedRoute | undefined;
  onClearAll: () => void;
  onCLickOnHeaderSaveButton: () => void;
  onClickOnHeaderLoadButton: () => void;
  onClickOnHeaderNewButton: () => void;
  onClickOnHeaderCancelButton: () => void;
  onLoadManagedRouteQuery: (modes: string[], key: string) => void;
  onDeleteManagedRouteMutation: (key: string) => void;
}

const Header = ({
  clickedHeaderButton,
  isHeaderSaveButtonDisabled,
  currentManagedRoute,
  onClearAll,
  onCLickOnHeaderSaveButton,
  onClickOnHeaderLoadButton,
  onClickOnHeaderNewButton,
  onClickOnHeaderCancelButton,
  onLoadManagedRouteQuery,
  onDeleteManagedRouteMutation,
}: Tprops) => {
  return (
    <Fragment>
      {clickedHeaderButton === 'laden' ||
      clickedHeaderButton === 'erstellen' ? (
        <Col xs={24}>
          <PageHeader
            title={
              <div
                style={{
                  color: '#4383B4',
                  fontSize: '17px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <UnorderedListOutlined
                  style={{ paddingTop: '9px', paddingRight: '10px' }}
                />
                <p>
                  {clickedHeaderButton
                    ? `Linie ${clickedHeaderButton}`
                    : `Linie manager`}
                </p>
              </div>
            }
            style={{ padding: '16px' }}
            extra={[
              //@ts-ignore
              <Space key='1' wrap>
                {clickedHeaderButton === 'laden' && currentManagedRoute && (
                  <>
                    <Button
                      type='primary'
                      htmlType='submit'
                      form='formWrapper'
                      disabled={isHeaderSaveButtonDisabled}
                      onClick={() => {
                        onCLickOnHeaderSaveButton();
                      }}
                    >
                      Speichern
                    </Button>
                    <Popconfirm
                      title={`Wollen Sie wirklich die Linie löschen ?`}
                      placement='bottomRight'
                      okText='Ja'
                      cancelText='Nein'
                      onConfirm={() => {
                        if (currentManagedRoute) {
                          const { key } = currentManagedRoute;
                          onDeleteManagedRouteMutation(key);
                        }
                      }}
                    >
                      <Button danger id='delete_stopSequence'>
                        löschen
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title={`Wollen Sie wirklich die Linie resetten ?`}
                      placement='bottomRight'
                      okText='Ja'
                      cancelText='Nein'
                      onConfirm={() => {
                        if (currentManagedRoute) {
                          const { key, modes } = currentManagedRoute;
                          onClearAll();
                          onLoadManagedRouteQuery(modes, key);
                        }
                      }}
                    >
                      <Button danger id='delete_stopSequence'>
                        Reset
                      </Button>
                    </Popconfirm>
                  </>
                )}
                {clickedHeaderButton === 'erstellen' && (
                  <>
                    <Button
                      type='primary'
                      htmlType='submit'
                      form='formWrapper'
                      disabled={isHeaderSaveButtonDisabled}
                      onClick={() => {
                        onCLickOnHeaderSaveButton();
                      }}
                    >
                      Speichern
                    </Button>
                  </>
                )}
                <Popconfirm
                  title={`Wollen Sie wirklich nicht mehr die Linie ${clickedHeaderButton} ?`}
                  placement='bottomRight'
                  okText='Ja'
                  cancelText='Nein'
                  onConfirm={() => {
                    onClickOnHeaderCancelButton();
                  }}
                >
                  <Button type='dashed'>Abbrechen</Button>
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
                  color: '#4383B4',
                  fontSize: '17px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <UnorderedListOutlined
                  style={{ paddingTop: '9px', paddingRight: '10px' }}
                />
                <p>
                  {clickedHeaderButton
                    ? `Linie ${clickedHeaderButton}`
                    : `Linie manager`}
                </p>
              </div>
            }
            style={{ padding: '16px' }}
            extra={[
              <Space key='1'>
                <Button
                  id='load_button'
                  value='laden'
                  onClick={() => {
                    onClickOnHeaderLoadButton();
                  }}
                >
                  Laden
                </Button>
                <Button
                  id='new_button'
                  value='erstellen'
                  onClick={() => {
                    onClickOnHeaderNewButton();
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
