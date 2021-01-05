import React, { useState } from "react";
import { AutoComplete } from "antd";

// Typescript
import { Tstations } from "../../types/types";

interface TporpsSearchInput {
  stations: Tstations[];
  handleSelectAutoSearch: (selectedStop: Tstations) => void;
}

// Auto complete component
const { Option } = AutoComplete;

const SearchInput = ({
  stations,
  handleSelectAutoSearch,
}: TporpsSearchInput) => {
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        position: "absolute",
        top: "40px",
        zIndex: 10,
        width: "70%",
        left: "20%",
      }}
    >
      <AutoComplete
        id="stops_autoComplete"
        value={search}
        placeholder="Enter stops name"
        open={search ? true : false}
        onSelect={(selectedStop: string, option: any) => {
          const { stop } = option;
          setSearch("");
          handleSelectAutoSearch(stop);
        }}
        onSearch={(input: string) => {
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
              <Option value={el.name} key={el._id} stop={{ ...el }}>
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
