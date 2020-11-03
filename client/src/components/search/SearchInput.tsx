import React, { useCallback, useState } from "react";
import { AutoComplete } from "antd";

// Typescript
export interface Tstations {
  index?: number;
  _id: string;
  name: string;
  coord: {
    WGS84: {
      lat: number;
      lon: number;
    };
  };
  modes: [String];
}

interface TporpsSearchInput {
  stations: Tstations[];
  handleSelectAutoSearch: (selectedStop: string) => void;
}

const SearchInput = ({
  stations,
  handleSelectAutoSearch,
}: TporpsSearchInput) => {
  const [search, setSearch] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  const handleSelect = useCallback(
    (selectedStop: string) => {
      setSearch("");
      handleSelectAutoSearch(selectedStop);
    },
    [stations, handleSelectAutoSearch]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "8vh",
        right: "9vh",
        zIndex: 400,
        width: "75%",
      }}
    >
      <AutoComplete
        id="search"
        value={search}
        placeholder="Enter stops name"
        open={search ? true : false}
        onSelect={handleSelect}
        onChange={(input: string) => {
          setSearch(input);
        }}
        style={{
          width: "100%",
        }}
      >
        {stations &&
          stations
            .filter((el: Tstations) =>
              el.name.toLowerCase().startsWith(search.toLowerCase())
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
    </div>
  );
};

export default React.memo(SearchInput);
