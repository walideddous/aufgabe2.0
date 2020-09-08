import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { Card, Col, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const DND = ({ choose, stateDND, handleDragEnd, Onclick, onDelete }: any) => {
  const handleClick = (e: any) => {
    Onclick(e);
  };

  const handleDelete = (e: any, i: any) => {
    onDelete(e);
  };
  return (
    <div className="App">
      <DragDropContext onDragEnd={(e) => handleDragEnd(e)}>
        {_.map(stateDND, (data: any, key: string) => {
          return (
            <Col span={12} key={key}>
              <Card bordered={true} title={data.title}>
                <Droppable droppableId={key}>
                  {(provided: any) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
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
                                  <div
                                    className="dnd-container"
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                    }}
                                  >
                                    <div
                                      className="item"
                                      onClick={() => {
                                        handleClick(el);
                                      }}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {el.name}
                                    </div>
                                    <Button
                                      type="dashed"
                                      shape="circle"
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        handleDelete(el, provided);
                                      }}
                                    />
                                  </div>
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
