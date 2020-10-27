import React, { useCallback, useState } from "react";
import { AutoComplete } from "antd";

// Import type
import { Tstations } from "../type/Types";

interface TporpsSearchInput {
  stations: Tstations[];
  handleSelectAutoSearch: (elementSelected: Tstations) => void;
}

const SearchInput = ({
  stations,
  handleSelectAutoSearch,
}: TporpsSearchInput) => {
  // Search Component
  const [search, setSearch] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  const handleSelect = useCallback(
    (data: string) => {
      setSearch("");
      const elementSelected = stations.filter((el) => el.name === data)[0];
      handleSelectAutoSearch(elementSelected);
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
        style={{
          width: "100%",
        }}
        onSelect={handleSelect}
        onChange={(input: string) => {
          setSearch(input);
        }}
        value={search}
        placeholder="Enter stops name"
        open={search ? true : false}
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
