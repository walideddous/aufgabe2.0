import React, { Fragment, useState, useEffect } from "react";
import { Card, Col } from "antd";

// Import types
import { Tstations, Tdistance } from "../type/Types";

interface TpropsInfo {
  selected: Tstations | undefined;
  distance: Tdistance[];
  currentStopSequenceName: any;
}

const Info = ({ selected, distance, currentStopSequenceName }: TpropsInfo) => {
  const [styleChanged, setStyleChanged] = useState(false);

  const resize = () => {
    if (window.innerWidth < 853) {
      setStyleChanged(true);
    } else {
      setStyleChanged(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
  });

  return (
    <Fragment>
      <Card bordered={true} title="Info">
        <div
          style={
            styleChanged
              ? undefined
              : {
                  display: "flex",
                  justifyContent: "space-around",
                }
          }
        >
          <Col xxl={15}>
            {selected ? (
              <Fragment>
                <h3>Stops info</h3>
                <p>
                  <strong>Haltestelle</strong>
                  {" : "}
                  {selected.name}
                </p>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <strong>modes</strong>
                  {" : "}
                  {selected.modes
                    ? selected.modes.map((el: any, index: number) => (
                        <p key={index}>
                          {el}
                          {", "}
                        </p>
                      ))
                    : "Modes is empty"}
                </div>
                <p>
                  <strong>Location</strong>
                  {" : "}
                  {"Latitude :"}{" "}
                  {selected.coord.WGS84 && selected.coord.WGS84.lat}{" "}
                  {", Longitude : "}
                  {selected.coord.WGS84 && selected.coord.WGS84.lon}
                </p>
                {distance.length && (
                  <div>
                    <p>
                      <strong>Distance</strong> {" : "}
                    </p>
                    <p>
                      Between {selected.name} and {distance[0].to.name} is{" "}
                      {distance[0].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[1].to.name} is{" "}
                      {distance[1].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[2].to.name} is{" "}
                      {distance[2].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[3].to.name} is{" "}
                      {distance[3].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[4].to.name} is{" "}
                      {distance[4].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[4].to.name} is{" "}
                      {distance[5].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[4].to.name} is{" "}
                      {distance[6].distance.toFixed(3)} Km
                    </p>
                    <p>
                      Between {selected.name} and {distance[4].to.name} is{" "}
                      {distance[7].distance.toFixed(3)} Km
                    </p>
                  </div>
                )}
              </Fragment>
            ) : (
              <p>Choose a station</p>
            )}
          </Col>
          <Col
            xxl={9}
            style={{
              borderBlockColor: "red",
            }}
          >
            {Object.keys(currentStopSequenceName).length ? (
              <div>
                <h3>Stop sequence info</h3>
                <p>
                  <strong>Name</strong>
                  {" : "} {currentStopSequenceName.name}
                </p>
                <p>
                  <strong>Date interval</strong>
                  {" : "}
                  <br />
                  {"From "} {currentStopSequenceName.date[0]}
                  {" To "}
                  {currentStopSequenceName.date[1]}
                </p>
                <div>
                  <strong>Shedule</strong>
                  {currentStopSequenceName.schedule.map(
                    (el: any, index: number) => (
                      <Fragment key={index}>
                        <div>
                          <p>
                            <strong>Days</strong>
                            {" : "} <br />
                          </p>
                          <div style={{ display: "flex" }}>
                            {el.day.map((el: string, index: number) => (
                              <p key={index}>
                                {el}
                                {" ,"}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p>
                            <strong>Time</strong>
                            {" : "} <br />
                          </p>
                          {el.time.map((el: any, index: number) => (
                            <p key={index}>
                              {"From "}
                              {el.start} {" To "}
                              {el.end}
                            </p>
                          ))}
                        </div>
                      </Fragment>
                    )
                  )}
                </div>
              </div>
            ) : (
              <p>Choose a stop sequence</p>
            )}
          </Col>
        </div>
      </Card>
    </Fragment>
  );
};

export default React.memo(Info);
