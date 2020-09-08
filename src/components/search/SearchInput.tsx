import React, { Fragment, useState } from "react";
import { AutoComplete } from "antd";

const SearchInput = ({ stations, handleEvent }: any) => {
  // Search Component
  const [search, setSearch] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const onSelect = (data: string) => {
    setSearch("");
    handleEvent(data);
  };

  return (
    <Fragment>
      <AutoComplete
        style={{ width: "48%", margin: 20 }}
        onSearch={handleSearch}
        onSelect={onSelect}
        placeholder="Stationsname eingeben"
        open={search ? true : false}
      >
        {stations
          .filter((el: any) =>
            el.Haltestelle.toLowerCase().includes(search.toLowerCase())
          )
          .map((el: any, i: number) => (
            <Option value={el.Haltestelle} key={i}>
              {el.Haltestelle}
            </Option>
          ))}
      </AutoComplete>
    </Fragment>
  );
};

export default SearchInput;
