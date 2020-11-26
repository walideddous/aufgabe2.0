import React, { useCallback, useState } from "react";
import { AutoComplete } from "antd";

// Typescript
import { Tstations } from "../../types/types";

interface TporpsSearchInput {
  stations: Tstations[];
  handleSelectAutoSearch: (selectedStop: string) => void;
}

// Auto complete component
const { Option } = AutoComplete;

const SearchInput = ({
  stations,
  handleSelectAutoSearch,
}: TporpsSearchInput) => {
  const [search, setSearch] = useState("");

  const handleSelect = useCallback(
    (selectedStop: string) => {
      setSearch("");
      handleSelectAutoSearch(selectedStop);
    },
    [handleSelectAutoSearch]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: "100px",
        zIndex: 10,
        width: "100%",
        paddingRight: "50px",
      }}
    >
      <AutoComplete
        id="stops_autoComplete"
        value={search}
        placeholder="Enter stops name"
        open={search ? true : false}
        onSelect={handleSelect}
        onSearch={(input: string) => {
          setSearch(input);
        }}
        style={{
          width: "75%",
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
