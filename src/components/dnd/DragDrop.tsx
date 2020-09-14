import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Col, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

// Import types
import { TstateDND, Tchoose, Tstations } from "../type/Types";

// Declare Types
interface TporpsDND {
  choose: Tchoose;
  stateDND: TstateDND;
  selected: Tstations | undefined;
  lastAutoSelectElem: Tstations | undefined;
  onclick: (e: { id: string | number; name: string }, index: number) => void;
  onDelete: (
    e: { id: string | number; name: string },
    SourceOrTarget: string
  ) => void;
  handleDragEnd: (e: any) => void;
}

const DragDrop = ({
  choose,
  stateDND,
  selected,
  lastAutoSelectElem,
  handleDragEnd,
  onclick,
  onDelete,
}: TporpsDND) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (
    e: { id: string | number; name: string },
    index: number
  ) => {
    onclick(e, index);
    setClicked(!clicked);
  };

  const handleDelete = (
    e: { id: string | number; name: string },
    SourceOrTarget: string
  ) => {
    onDelete(e, SourceOrTarget);
  };

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
                                className="item-suggestion "
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span style={{ width: "90%" }}>{el.name}</span>
                                <Button
                                  type="dashed"
                                  shape="round"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(el, stateDND.vorschlag.title);
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
                                  (lastAutoSelectElem &&
                                    !selected &&
                                    stateDND.trajekt.items.length - 1 ===
                                      index) ||
                                  (lastAutoSelectElem &&
                                    selected &&
                                    selected.index === index) ||
                                  (selected &&
                                    !lastAutoSelectElem &&
                                    selected.index === index)
                                    ? "item-highlighted"
                                    : "item"
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span
                                  onClick={() => {
                                    handleClick(el, index);
                                  }}
                                  style={{ width: "90%" }}
                                >
                                  {el.name}
                                </span>
                                <Button
                                  type="dashed"
                                  shape="round"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(el, stateDND.trajekt.title);
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
