import React, { Fragment } from 'react';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { Card, Col } from 'antd';

const DND = ({ choose, state, handleDragEnd }: any) => {
  return (
    <div className='App'>
      <DragDropContext onDragEnd={(e) => handleDragEnd(e)}>
        {_.map(state, (data: any, key: any) => {
          return (
            <Col span={12}>
              <Card bordered={true}>
                <Droppable droppableId={key}>
                  {(provided: any) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={'droppable-col'}
                      >
                        {data.items.map((el: any, index: number) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided) => {
                                return (
                                  <Fragment>
                                    <div
                                      className='item'
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {el.name}
                                    </div>
                                  </Fragment>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </Card>
            </Col>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default DND;
