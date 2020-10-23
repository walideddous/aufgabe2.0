import React, { useState, useCallback, useEffect, Fragment } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Col } from "antd";
import { DeleteOutlined, ArrowUpOutlined } from "@ant-design/icons";

// Import types
import { TstateDND, Tstations } from "../type/Types";

// Declare Types
interface TporpsDND {
  stateDND: TstateDND;
  selected: Tstations | undefined;
  onclick: (e: any, index: number) => void;
  handleAddStopsOnCLick: (e: any) => void;
  onDelete: (e: any, index: number) => void;
  handleDragEnd: (e: any) => void;
}

const DragDrop = ({
  stateDND,
  selected,
  handleAddStopsOnCLick,
  handleDragEnd,
  onclick,
  onDelete,
}: TporpsDND) => {
  const [clicked, setClicked] = useState(false);
  const [hide, setHide] = useState(false);

  const resize = () => {
    //@ts-ignore
    if (window.innerWidth < 992) {
      setHide(true);
    } else {
      setHide(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
  });
  const scrollToBottom = useCallback(() => {
    var element = document.getElementById("item-highlighted");
    if (element) {
      //@ts-ignore
      /*
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      */
    }
  }, []);
  useEffect(() => {
    scrollToBottom();
  });

  const handleClick = useCallback(
    (e: any, index: number) => {
      onclick(e, index);
      setClicked(!clicked);
    },
    [onclick, setClicked, clicked]
  );

  const handleDelete = useCallback(
    (e: any, index: number) => {
      onDelete(e, index);
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
    <Fragment>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Col xs={24}>
          <Card bordered={true} title={stateDND.vorschlag.title}>
            <Droppable droppableId={"vorschlag"}>
              {(provided: any) => {
                return (
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Col lg={12} xs={24}>
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {stateDND.vorschlag.items
                          .slice(0, 8)
                          .map((el: any, index: number) => {
                            return (
                              <Draggable
                                key={el._id}
                                index={index}
                                draggableId={el._id + index}
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
                                        style={{ width: "90%" }}
                                        onClick={() => {
                                          addStopsOnCLick(el);
                                        }}
                                      >
                                        {el.name} "{el.distance.toFixed(3)} Km"
                                      </span>
                                      <button
                                        style={{
                                          width: "30px",
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
                    </Col>
                    {!hide ? (
                      <Col lg={12}>
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={"droppable-col"}
                        >
                          {stateDND.vorschlag.items
                            .slice(8, 16)
                            .map((el: any, index: number) => {
                              return (
                                <Draggable
                                  key={el._id}
                                  index={index + 8}
                                  draggableId={el._id + index}
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
                                          style={{
                                            width: "90%",
                                          }}
                                          onClick={() => {
                                            addStopsOnCLick(el);
                                          }}
                                        >
                                          {el.name} "{el.distance.toFixed(3)}{" "}
                                          Km"
                                        </span>
                                        <button
                                          style={{
                                            width: "30px",
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
                      </Col>
                    ) : (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      ></div>
                    )}
                  </div>
                );
              }}
            </Droppable>
          </Card>
        </Col>
        <Col xs={24}>
          <Card bordered={true} title={stateDND.trajekt.title}>
            <div style={{ height: "370px", overflowY: "auto" }}>
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
                            key={el._id + index}
                            index={index}
                            draggableId={el._id + index}
                          >
                            {(provided) => {
                              return (
                                <div
                                  id={
                                    selected &&
                                    selected._id + selected.index ===
                                      el._id + index
                                      ? "item-highlighted"
                                      : "item"
                                  }
                                  className={
                                    selected &&
                                    selected._id + selected.index ===
                                      el._id + index
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
                                      width: "30px",
                                      backgroundColor: "white",
                                      color: "#3949ab",
                                      borderRadius: "5px",
                                      outline: "0",
                                      cursor: "pointer",
                                      boxShadow: "0px 2px 2px lightgray",
                                    }}
                                    onClick={() => {
                                      handleDelete(el, index);
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
            </div>
          </Card>
        </Col>
      </DragDropContext>
    </Fragment>
  );
};

export default React.memo(DragDrop);
