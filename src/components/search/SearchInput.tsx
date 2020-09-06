import React, { Fragment, useState } from 'react';
import { AutoComplete } from 'antd';

const SearchInput = ({ stations, handleEvent }: any) => {
  // Search Component
  const [search, setSearch] = useState('');

  // Auto complete component
  const { Option } = AutoComplete;

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const onSelect = (data: string) => {
    setSearch('');
    handleEvent(data);
    console.log('el', data);
  };

  const handleClick = (el: any) => {};

  return (
    <Fragment>
      <AutoComplete
        style={{ width: '60%', margin: 20 }}
        onSearch={handleSearch}
        onSelect={onSelect}
        placeholder='Stationsname eingeben'
        open={search ? true : false}
      >
        {stations
          .filter((el: any) =>
            el.Haltestelle.toLowerCase().includes(search.toLowerCase())
          )
          .map((el: any, i: number) => (
            <Option
              value={el.Haltestelle}
              onClick={() => {
                handleClick(el);
              }}
            >
              {el.Haltestelle}
            </Option>
          ))}
      </AutoComplete>
    </Fragment>
  );
};

export default SearchInput;

// import React, { useState, Fragment } from 'react';
// import { Input } from 'antd';

// //Redux
// import { connect, ConnectedProps } from 'react-redux';

// // Types declaration
// interface SearchState {
//   search: string;
// }

// type PropsFromRedux = ConnectedProps<typeof connector>;

// // Component
// const SearchInput = ({ searchData }: PropsFromRedux) => {
//   // ant design
//   const { Search } = Input;

//   const [search, setSearch] = useState('');

//   // To change the type of "e" => SyntheticEvent
//   const handleChange = (e: any) => {
//     setSearch(e.target.value);
//     searchData(search);
//   };

//   return (
//     <Fragment>
//       <Search
//         value={search}
//         placeholder='Station Name'
//         onChange={(e) => handleChange(e)}
//         onSearch={(e) => {
//           searchData(search);
//         }}
//       />
//     </Fragment>
//   );
// };

// const mapDispatchToProps = {
//   searchData: (search: string) => ({ type: 'SEARCH_INPUT', payload: search }),
// };

// const connector = connect(null, mapDispatchToProps);

// export default connector(SearchInput);
