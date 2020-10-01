import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Col } from "antd";
import { DeleteOutlined, ArrowUpOutlined } from "@ant-design/icons";

// Import types
import { TstateDND, Tchoose, Tstations } from "../type/Types";

// Declare Types
interface TporpsDND {
  choose: Tchoose;
  stateDND: TstateDND;
  selected: Tstations | undefined;
  lastAutoSelectElem: Tstations | undefined;
  onclick: (e: any, index: number) => void;
  handleAddStopsOnCLick: (e: any) => void;
  onDelete: (e: any, SourceOrTarget: string, index: number) => void;
  handleDragEnd: (e: any) => void;
}

const DragDrop = ({
  choose,
  stateDND,
  selected,
  lastAutoSelectElem,
  handleAddStopsOnCLick,
  handleDragEnd,
  onclick,
  onDelete,
}: TporpsDND) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(
    (e: any, index: number) => {
      onclick(e, index);
      setClicked(!clicked);
    },
    [onclick, setClicked, clicked]
  );

  const handleDelete = useCallback(
    (e: any, SourceOrTarget: string, index: number) => {
      onDelete(e, SourceOrTarget, index);
    },
    [onDelete]
  );

  const addStopsOnCLick = useCallback(
    (el: any) => {
      handleAddStopsOnCLick(el);
    },
    [handleAddStopsOnCLick]
  );

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Col span={12}>
          <Card
            bordered={true}
            title={stateDND.vorschlag.title}
            style={{ height: "35vh" }}
          >
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
                          key={el._id}
                          index={index}
                          draggableId={el._id}
                        >
                          {(provided) => {
                            return (
                              <div
                                className="item-suggestion "
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span
                                  style={{ width: "90%", height: "30px" }}
                                  onClick={() => {
                                    addStopsOnCLick(el);
                                  }}
                                >
                                  {el.name} "{el.distance.toFixed(3)} Km"
                                </span>
                                <button
                                  style={{
                                    backgroundColor: "white",
                                    color: "#3949ab",
                                    borderRadius: "5px",
                                    outline: "0",
                                  }}
                                >
                                  <ArrowUpOutlined
                                    style={{
                                      transform: `rotate(${el.angle}deg)`,
                                    }}
                                  />
                                </button>
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
          <Card
            bordered={true}
            title={stateDND.trajekt.title}
            style={{ height: "35vh", overflowY: "scroll" }}
          >
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
                          key={el._id}
                          index={index}
                          draggableId={el._id}
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
                                    selected._id === el._id) ||
                                  (selected &&
                                    !lastAutoSelectElem &&
                                    selected._id === el._id)
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
                                <button
                                  style={{
                                    backgroundColor: "white",
                                    color: "#3949ab",
                                    borderRadius: "5px",
                                    outline: "0",
                                    cursor: "pointer",
                                    boxShadow: "0px 2px 2px lightgray",
                                  }}
                                  onClick={() => {
                                    handleDelete(
                                      el,
                                      stateDND.trajekt.title,
                                      index
                                    );
                                  }}
                                >
                                  <DeleteOutlined />
                                </button>
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

export default React.memo(DragDrop);
