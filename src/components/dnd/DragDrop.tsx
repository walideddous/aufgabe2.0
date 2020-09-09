import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Col, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

// Import types
import { TstateDND, Tchoose } from "../type/Types";

// Declare Types
interface TporpsDND {
  choose: Tchoose;
  stateDND: TstateDND;
  onclick: (e: { id: string | number; name: string }) => void;
  onDelete: (e: { id: string | number; name: string }) => void;
  handleDragEnd: (e: any) => void;
}

const DragDrop = ({
  choose,
  stateDND,
  handleDragEnd,
  onclick,
  onDelete,
}: TporpsDND) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: { id: string | number; name: string }) => {
    onclick(e);
    setClicked(!clicked);
  };

  const handleDelete = (e: { id: string | number; name: string }) => {
    onDelete(e);
  };

  // Handle the highlitimg
  const handleButtonColor = () => {};

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Col span={12}>
          <Card bordered={true} title={stateDND.vorschlag.title}>
            <Droppable droppableId={"vorschlag"}>
              {(provided: any) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"droppable-col"}
                  >
                    {stateDND.vorschlag.items.map((el: any, index: number) => {
                      return (
                        <Draggable
                          key={el.id}
                          index={index}
                          draggableId={el.id}
                        >
                          {(provided) => {
                            return (
                              <div
                                className="item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span
                                  onClick={() => {
                                    handleClick(el);
                                  }}
                                >
                                  {el.name}
                                </span>
                                <Button
                                  type="dashed"
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(el);
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
        <Col span={12}>
          <Card bordered={true} title={stateDND.trajekt.title}>
            <Droppable droppableId={"trajekt"}>
              {(provided: any) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={"droppable-col"}
                  >
                    {stateDND.trajekt.items.map((el: any, index: number) => {
                      return (
                        <Draggable
                          key={el.id}
                          index={index}
                          draggableId={el.id}
                        >
                          {(provided) => {
                            return (
                              <div
                                className={
                                  stateDND.trajekt.items[
                                    stateDND.trajekt.items.length - 1
                                  ].id === el.id
                                    ? "item-highlighted"
                                    : "item"
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span
                                  onClick={() => {
                                    handleClick(el);
                                  }}
                                >
                                  {el.name}
                                </span>
                                <Button
                                  type="dashed"
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(el);
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
      </DragDropContext>
    </div>
  );
};

export default DragDrop;
