import React, { useState } from 'react';
import { AutoComplete } from 'antd';

// Typescript
import { Tstops } from '../../types/types';

interface TporpsSearchInput {
  stops: Tstops[];
  handleSelectAutoSearch: (selectedStopStop: Tstops) => void;
}

// Auto complete component
const { Option } = AutoComplete;

const SearchInput = ({ stops, handleSelectAutoSearch }: TporpsSearchInput) => {
  const [search, setSearch] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'start',
        position: 'absolute',
        top: '25px',
        zIndex: 10,
        width: '70%',
        left: '18%',
      }}
    >
      <AutoComplete
        id='stops_autoComplete'
        value={search}
        placeholder='Haltestellenname eingeben'
        open={search ? true : false}
        onSelect={(selectedStopStop: string, option: any) => {
          const { stop } = option;
          setSearch('');
          handleSelectAutoSearch(stop);
        }}
        onSearch={(input: string) => {
          setSearch(input);
        }}
        style={{
          width: '100%',
        }}
      >
        {stops &&
          stops
            .filter((el: Tstops) =>
              el.name.toLowerCase().startsWith(search.toLowerCase())
            )
            .map((el: Tstops) => (
              <Option value={el.name} key={el._id} stop={{ ...el }}>
                {el.name}
              </Option>
            ))}
      </AutoComplete>
    </div>
  );
};

export default React.memo(SearchInput);
