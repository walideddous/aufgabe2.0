import React, { Fragment } from 'react';
import { Card, Col } from 'antd';

const Info = ({ selected }: any) => {
  return (
    <Fragment>
      <Col span={12}>
        <Card bordered={true} title='Haltestelle Info'>
          {selected ? (
            <Fragment>
              <p>
                <strong>Haltestelle</strong>
                {' : '}
                {selected.Haltestelle}
              </p>
              <p>
                <strong>Adresse</strong>
                {' : '}
                {selected.adresse}
              </p>
              <p>
                <strong>Umstiegmöglischkeiten</strong>
                {' : '}
                {selected.Umstiegmöglischkeiten}
              </p>
              <p>
                <strong>Location</strong>
                {' : '}
                {'Latitude :'} {selected.location && selected.location.lat}{' '}
                {', Longitude :'}
                {selected.location && selected.location.lng}
              </p>
              <p>
                <strong>WeitereInformationen</strong>
                {' : '}
                {selected.weitereInformationen}
              </p>
            </Fragment>
          ) : (
            <p>Wählen Sie eine Station</p>
          )}
        </Card>
      </Col>
    </Fragment>
  );
};

export default Info;

//Redux
// import React, { Fragment } from 'react';
//
// import { connect, ConnectedProps } from 'react-redux';
// interface GetData {
//   getDataReducer: {
//     loading: boolean;
//     selected: {
//       _id: string;
//       Haltestelle: string;
//       adresse: string;
//       Umstiegmöglischkeiten: string;
//       location: {
//         lat: string;
//         lng: string;
//       };
//       weitereInformationen: string;
//     };
//   };
// }

// type PropsFromRedux = ConnectedProps<typeof connector>;

// const index = ({ selected, loading }: PropsFromRedux) => {
//   console.log('selected', selected);

//   return (
//     <Fragment>
//       {selected ? (
//         <Fragment>
//           <p>
//             <strong>Haltestelle</strong>
//             {' : '}
//             {selected.Haltestelle}
//           </p>
//           <p>
//             <strong>Adresse</strong>
//             {' : '}
//             {selected.adresse}
//           </p>
//           <p>
//             <strong>Umstiegmöglischkeiten</strong>
//             {' : '}
//             {selected.Umstiegmöglischkeiten}
//           </p>
//           <p>
//             <strong>Location</strong>
//             {' : '}
//             {'Latitude :'} {selected.location && selected.location.lat}{' '}
//             {', Longitude :'}
//             {selected.location && selected.location.lng}
//           </p>
//           <p>
//             <strong>Location</strong>
//             {' : '}
//             {selected.weitereInformationen}
//           </p>
//         </Fragment>
//       ) : (
//         <h1>Choose a station</h1>
//       )}
//     </Fragment>
//   );
// };

// const mapStateToProps = (state: GetData) => ({
//   selected: state.getDataReducer.selected,
//   loading: state.getDataReducer.loading,
// });

// const connector = connect(mapStateToProps);

// export default connector(index);
