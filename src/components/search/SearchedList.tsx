import React, { Fragment } from 'react';
import { Spin, Button } from 'antd';

const SearchedList = ({ loading, choose }: any) => {
  return (
    <Fragment>
      {loading ? (
        <Spin
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '30px',
          }}
        />
      ) : (
        <Fragment>
          {choose ? (
            <Button type='default' style={{ width: '100%' }}>
              <i
                className='fas fa-subway'
                style={{ color: '#1890ff', margin: '0 10px' }}
              >
                {choose}
              </i>
            </Button>
          ) : (
            <p style={{ margin: '20px' }}>
              Bitte geben Sie den Namen der Station ein
            </p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default SearchedList;

// import React, { Fragment, useEffect } from 'react';
// import { Spin, Card, Col } from 'antd';
// import { Button } from 'antd';

// //Redux
// import { connect, ConnectedProps } from 'react-redux';

// // Types declaration
// interface GetData {
//   searchReducer: {
//     search: string;
//   };
//   getDataReducer: {
//     loading: boolean;
//     data: any;
//   };
// }

// type PropsFromRedux = ConnectedProps<typeof connector>;

// const SearchedList = ({ loading, data, search, getData }: PropsFromRedux) => {
//   useEffect(() => {
//     getData();
//   });

//   return (
//     <Fragment>
//       {loading ? (
//         <Spin
//           style={{ display: 'flex', justifyContent: 'center', margin: '30px' }}
//         />
//       ) : (
//         <Fragment>
//           {search ? (
//             data
//               .filter((el: any) =>
//                 el.Haltestelle.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((el: any) => (
//                 <Button type='default' style={{ width: '100%' }}>
//                   <i
//                     className='fas fa-subway'
//                     style={{ color: '#1890ff', margin: '0 10px' }}
//                   ></i>
//                   {el.Haltestelle}
//                 </Button>
//               ))
//           ) : (
//             <p style={{ margin: '20px' }}>
//               Please enter the name of the station
//             </p>
//           )}
//         </Fragment>
//       )}
//       <Col span={24}>
//         <Card bordered={true}>The stations</Card>
//       </Col>
//     </Fragment>
//   );
// };

// const mapStateToProps = (state: GetData) => ({
//   loading: state.getDataReducer.loading,
//   data: state.getDataReducer.data,
//   search: state.searchReducer.search,
// });

// const mapDispatchToProps = {
//   getData: () => ({ type: 'GET_SUCCESS' }),
// };

// const connector = connect(mapStateToProps, mapDispatchToProps);

// export default connector(SearchedList);

// /*
//         <List
//           size="small"
//           bordered
//           dataSource={data}
//           renderItem={(response: any) => (
//             <List.Item>
//               <i className="fas fa-subway" style={{ color: "#1890ff" }}></i>{" "}
//               {response.Haltestelle}
//             </List.Item>
//           )}
//         />
//         */
