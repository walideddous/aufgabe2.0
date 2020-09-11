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
          <Card bordered={true} title="Haltestelle Info">
            {selected ? (
              <Fragment>
                <p>
                  <strong>Haltestelle</strong>
                  {" : "}
                  {selected.Haltestelle}
                </p>
                <p>
                  <strong>Adresse</strong>
                  {" : "}
                  {selected.adresse}
                </p>
                <p>
                  <strong>Umstiegmöglischkeiten</strong>
                  {" : "}
                  {selected.Umstiegmöglischkeiten}
                </p>
                <p>
                  <strong>Location</strong>
                  {" : "}
                  {"Latitude :"} {selected.location && selected.location.lat}{" "}
                  {", Longitude :"}
                  {selected.location && selected.location.lng}
                </p>
                <p>
                  <strong>WeitereInformationen</strong>
                  {" : "}
                  {selected.weitereInformationen}
                </p>
                <div>
                  <p>
                    <strong>Distance</strong> {" : "}
                  </p>
                  <p>
                    Between {selected.Haltestelle} and{" "}
                    {distance[0].to.Haltestelle} is{" "}
                    {distance[0].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {selected.Haltestelle} and{" "}
                    {distance[1].to.Haltestelle} is{" "}
                    {distance[1].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {selected.Haltestelle} and{" "}
                    {distance[2].to.Haltestelle} is{" "}
                    {distance[2].distance.toFixed(3)} Km
                  </p>
                </div>
              </Fragment>
            ) : (
              <p>Wählen Sie eine Station</p>
            )}
          </Card>
        </Col>
      ) : (
        <Col span={12}>
          <Card bordered={true} title="Haltestelle Info">
            {lastAutoSelectElem ? (
              <Fragment>
                <p>
                  <strong>Haltestelle</strong>
                  {" : "}
                  {lastAutoSelectElem.Haltestelle}
                </p>
                <p>
                  <strong>Adresse</strong>
                  {" : "}
                  {lastAutoSelectElem.adresse}
                </p>
                <p>
                  <strong>Umstiegmöglischkeiten</strong>
                  {" : "}
                  {lastAutoSelectElem.Umstiegmöglischkeiten}
                </p>
                <p>
                  <strong>Location</strong>
                  {" : "}
                  {"Latitude :"}{" "}
                  {lastAutoSelectElem.location &&
                    lastAutoSelectElem.location.lat}{" "}
                  {", Longitude :"}
                  {lastAutoSelectElem.location &&
                    lastAutoSelectElem.location.lng}
                </p>
                <p>
                  <strong>WeitereInformationen</strong>
                  {" : "}
                  {lastAutoSelectElem.weitereInformationen}
                </p>
                <div>
                  <p>
                    <strong>Distance</strong> {" : "}
                  </p>
                  <p>
                    Between {lastAutoSelectElem.Haltestelle} and{" "}
                    {distance[0].to.Haltestelle} is{" "}
                    {distance[0].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.Haltestelle} and{" "}
                    {distance[1].to.Haltestelle} is{" "}
                    {distance[1].distance.toFixed(3)} Km
                  </p>
                  <p>
                    Between {lastAutoSelectElem.Haltestelle} and{" "}
                    {distance[2].to.Haltestelle} is{" "}
                    {distance[2].distance.toFixed(3)} Km
                  </p>
                </div>
              </Fragment>
            ) : (
              <p>Wählen Sie eine Station</p>
            )}
          </Card>
        </Col>
      )}
    </Fragment>
  );
};

export default Info;

/*
      {lastAutoSelectElem && (

      )}

*/
