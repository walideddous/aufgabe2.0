import React, { Fragment } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Spin, Card, Col } from 'antd';
import L from 'leaflet';

const OnMap = ({ loading, stations, stateDND, Onclick }: any) => {
  // Icon per default
  L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/';

  const position = {
    lat: 48.16517718624497,
    lng: 11.575250355866128,
    zoom: 12,
  };

  const handleClick = (e: any) => {
    Onclick(e);
  };
  return (
    <Fragment>
      <Col span={12}>
        <Card bordered={true} title='Map'>
          {loading ? (
            <Spin
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '30px',
              }}
            />
          ) : (
            <Map
              center={[position.lat, position.lng]}
              zoom={position.zoom}
              style={{ height: '60vh' }}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <MarkerClusterGroup>
                {stations &&
                  stations.map((el: any, i: any) => (
                    <Marker
                      position={[el.location.lat, el.location.lng]}
                      draggable={true}
                      key={el._id}
                      onClick={() => {
                        handleClick(el);
                      }}
                    >
                      <Popup>{el.Haltestelle}</Popup>
                    </Marker>
                  ))}
              </MarkerClusterGroup>
            </Map>
          )}
        </Card>
      </Col>
    </Fragment>
  );
};

export default OnMap;

/*
                tableaufiltrer(stations, stateDND).map((el: any, i: any) => (
                  <Marker
                    position={[el.location.lat, el.location.lng]}
                    draggable={true}
                    key={el._id}
                    onClick={() => {
                      handleClick(el);
                    }}
                  >
                    <Popup>{el.Haltestelle}</Popup>
                  </Marker>
                )
*/

// import React, { Fragment } from 'react';
// import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Spin } from 'antd';
// import L from 'leaflet';

// //Redux
// import { connect, ConnectedProps } from 'react-redux';

// // Types declaration
// type State = {
//   lat: number;
//   lng: number;
//   zoom: number;
// };

// interface GetData {
//   getDataReducer: {
//     loading: boolean;
//     data: {}[];
//   };
// }

// type PropsFromRedux = ConnectedProps<typeof connector>;

// const OnMap = ({ data, loading }: PropsFromRedux) => {
//   L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/';

//   const position = {
//     lat: 48.16517718624497,
//     lng: 11.575250355866128,
//     zoom: 12,
//   };

//   // Create the lat and lng for the path
//   const path = (data: any) => {
//     let result = [];
//     for (let i = 0; i < data.length; i++) {
//       result.push([data[i].location.lat, data[i].location.lat]);
//     }
//     return result;
//   };

//   return (
//     <Fragment>
//       {loading ? (
//         <Spin
//           style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}
//         />
//       ) : (
//         <Map
//           center={[position.lat, position.lng]}
//           zoom={position.zoom}
//           style={{ height: '60vh' }}
//         >
//           <TileLayer
//             attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//           />
//           {data.map((el: any, i: any) => (
//             <Marker
//               position={[el.location.lat, el.location.lng]}
//               draggable={true}
//               key={el._id}
//               color='red'
//             >
//               <Popup>{el.Haltestelle}</Popup>
//             </Marker>
//           ))}
//         </Map>
//       )}
//     </Fragment>
//   );
// };

// const mapStateToProps = (state: GetData) => ({
//   data: state.getDataReducer.data,
//   loading: state.getDataReducer.loading,
// });

// const connector = connect(mapStateToProps);

// export default connector(OnMap);
