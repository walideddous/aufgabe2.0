import React, { Fragment } from "react";
import { Card, Col } from "antd";

// Import types
import { Tstations, Tdistance } from "../type/Types";

interface TpropsInfo {
  selected: Tstations | undefined;
  distance: Tdistance[];
  lastAutoSelectElem: Tstations | undefined;
}

const Info = ({ selected, distance, lastAutoSelectElem }: TpropsInfo) => {
  return (
    <Fragment>
      {(selected && lastAutoSelectElem) || (selected && !lastAutoSelectElem) ? (
        <Col span={12}>
          <Card bordered={true} title="Station Info">
            {selected ? (
              <Fragment>
                <p>
                  <strong>Haltestelle</strong>
                  {" : "}
                  {selected.name}
                </p>
                <p>
                  <strong>modes</strong>
                  {" : "}
                  {selected.modes ? selected.modes : "Modes is empty"}
                </p>
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
                  </div>
                )}
              </Fragment>
            ) : (
              <p>Choose a station</p>
            )}
          </Card>
        </Col>
      ) : (
        <Col span={12}>
          <Card bordered={true} title="Station Info">
            {lastAutoSelectElem ? (
              <Fragment>
                <p>
                  <strong>Haltestelle</strong>
                  {" : "}
                  {lastAutoSelectElem.name}
                </p>
                <p>
                  <strong>modes</strong>
                  {" : "}
                  {lastAutoSelectElem.modes
                    ? lastAutoSelectElem.modes
                    : "Modes is empty"}
                </p>
                <p>
                  <strong>Location</strong>
                  {" : "}
                  {"Latitude :"}{" "}
                  {lastAutoSelectElem.coord.WGS84 &&
                    lastAutoSelectElem.coord.WGS84.lat}{" "}
                  {", Longitude : "}
                  {lastAutoSelectElem.coord.WGS84 &&
                    lastAutoSelectElem.coord.WGS84.lon}
                </p>
                {distance.length && (
                  <div>
                    <p>
                      <strong>Distance</strong> {" : "}
                    </p>
                    <p>
                      Between {lastAutoSelectElem.name} and{" "}
                      {distance[0].to.name} is {distance[0].distance.toFixed(3)}{" "}
                      Km
                    </p>
                    <p>
                      Between {lastAutoSelectElem.name} and{" "}
                      {distance[1].to.name} is {distance[1].distance.toFixed(3)}{" "}
                      Km
                    </p>
                    <p>
                      Between {lastAutoSelectElem.name} and{" "}
                      {distance[2].to.name} is {distance[2].distance.toFixed(3)}{" "}
                      Km
                    </p>
                  </div>
                )}
              </Fragment>
            ) : (
              <p>Choose a station</p>
            )}
          </Card>
        </Col>
      )}
    </Fragment>
  );
};

export default React.memo(Info);
