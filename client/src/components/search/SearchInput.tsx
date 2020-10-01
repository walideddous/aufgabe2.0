import React, { Fragment, useState } from "react";
import { AutoComplete } from "antd";

// Import type
import { Tstations } from "../type/Types";

interface TporpsSearchInput {
  stations: Tstations[];
  handleEvent: (elementSelected: Tstations) => void;
}

const SearchInput = ({ stations, handleEvent }: TporpsSearchInput) => {
  // Search Component
  const [search, setSearch] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  const handleChange = (input: string) => {
    setSearch(input);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const onSelect = (data: string) => {
    setSearch("");
    const elementSelected = stations.filter((el) => el.name === data)[0];
    handleEvent(elementSelected);
  };

  return (
    <Fragment>
      <AutoComplete
        style={{ width: "48%", margin: 20 }}
        onSearch={handleSearch}
        onSelect={onSelect}
        onChange={(e) => handleChange(e)}
        value={search}
        placeholder="Stationsname eingeben"
        open={search ? true : false}
      >
        {stations &&
          stations
            .filter((el: Tstations) =>
              el.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((el: Tstations) => (
              <Option value={el.name} key={el._id}>
                <i
                  className="fas fa-subway"
                  style={{ color: "#1890ff", margin: "0 10px" }}
                ></i>
                {el.name}
              </Option>
            ))}
      </AutoComplete>
    </Fragment>
  );
};

export default React.memo(SearchInput);
