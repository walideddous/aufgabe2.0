import React, { Fragment } from "react";
import { Card } from "antd";

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
        <Card bordered={true} title="Station Info" style={{ height: "535px" }}>
          {selected ? (
            <Fragment>
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
                <strong>modes </strong>
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
        </Card>
      ) : (
        <Card bordered={true} title="Station Info" style={{ height: "535px" }}>
          {lastAutoSelectElem ? (
            <Fragment>
              <p>
                <strong>Haltestelle</strong>
                {" : "}
                {lastAutoSelectElem.name}
              </p>
              <div
                style={{
                  display: "flex",
                }}
              >
                <strong>modes </strong>
                {" : "}
                {lastAutoSelectElem.modes
                  ? lastAutoSelectElem.modes.map((el: any, index: number) => (
                      <p
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
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
                    Between {lastAutoSelectElem.name} and {distance[0].to.name}{" "}
                    is {distance[0].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[1].to.name}{" "}
                    is {distance[1].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[2].to.name}{" "}
                    is {distance[2].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[3].to.name}{" "}
                    is {distance[3].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[4].to.name}{" "}
                    is {distance[4].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[5].to.name}{" "}
                    is {distance[4].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[6].to.name}{" "}
                    is {distance[4].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.name} and {distance[7].to.name}{" "}
                    is {distance[4].distance.toFixed(3)} Km
                  </p>
                </div>
              )}
            </Fragment>
          ) : (
            <p>Choose a station</p>
          )}
        </Card>
      )}
    </Fragment>
  );
};

export default React.memo(Info);
