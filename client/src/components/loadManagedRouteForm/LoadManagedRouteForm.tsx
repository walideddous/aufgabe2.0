import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, Form, Select, Collapse } from "antd";
// Import types
import { TstopSequence, TManagedRoute } from "../../types/types";

interface TLoadStopSequence {
  toggleLoadOrNew: boolean;
  stopSequence: TstopSequence;
  managedRoutes: TManagedRoute[];
  currentManagedRoute: TManagedRoute | undefined;
  onStopsQuery: (modes: string[]) => void;
  onSearchManagedRouteQuery: (name: string) => void;
  onLoadManagedRouteQuery: (modes: string[], key: string) => void;
}
const { Panel } = Collapse;

const LoadManagedRouteForm = ({
  toggleLoadOrNew,
  stopSequence,
  managedRoutes,
  currentManagedRoute,
  onStopsQuery,
  onSearchManagedRouteQuery,
  onLoadManagedRouteQuery,
}: TLoadStopSequence) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>("");
  const [collapseOpen, setCollapseOpen] = useState<boolean>(true);
  const [selectedStopMode, setselectedStopMode] = useState("");

  // Auto complete component
  const { Option } = AutoComplete;

  // implementing the debouncing
  useEffect(() => {
    if (search) {
      const dispatchRequest = setTimeout(() => {
        onSearchManagedRouteQuery(search);
      }, 1000);

      return () => clearTimeout(dispatchRequest);
    }
  }, [search, onSearchManagedRouteQuery]);

  // handle the drop menu to display the choosed Modes on Map
  const handleModeChange = useCallback(
    (value: string) => {
      onStopsQuery([value + ""]);
      setselectedStopMode(value);
      setCollapseOpen(false);
    },
    [onStopsQuery]
  );

  const handleSelect = useCallback(
    (mode: string, options) => {
      const response = managedRoutes.filter(
        (el: any) => el.key === options.key
      )[0];
      if (response && response.key !== currentManagedRoute?.key) {
        onLoadManagedRouteQuery(response.modes, options.key);
        setCollapseOpen(false);
        setSearch("");
      }
    },
    [managedRoutes, currentManagedRoute, onLoadManagedRouteQuery]
  );

  useEffect(() => {
    if (!currentManagedRoute) {
      setCollapseOpen(true);
    }
  }, [currentManagedRoute]);

  return (
    <Collapse
      defaultActiveKey={"1"}
      activeKey={collapseOpen ? "1" : "2"}
      onChange={() => {
        setCollapseOpen(!collapseOpen);
      }}
    >
      <Panel
        header={
          !toggleLoadOrNew
            ? `Verkehrsmitteltyp ${selectedStopMode}`
            : "Linienname suchen"
        }
        key="1"
      >
        <Form form={form} layout="vertical">
          {!toggleLoadOrNew && (
            <Form.Item>
              <Select
                id="mode_selector"
                placeholder="Wählen Sie einen Vehrkehsmitteltyp aus"
                disabled={stopSequence.trajekt.items.length ? true : false}
                onChange={handleModeChange}
              >
                <Option value="13" id="13">
                  13
                </Option>
                <Option value="5" id="5">
                  5
                </Option>
                <Option value="8" id="8">
                  8
                </Option>
                <Option value="9" id="9">
                  9
                </Option>
                <Option value="2" id="2">
                  2
                </Option>
                <Option value="4" id="4">
                  4
                </Option>
              </Select>
            </Form.Item>
          )}
          {toggleLoadOrNew && (
            <Form.Item>
              <AutoComplete
                id="stopSequence_autoComplete"
                placeholder="Geben Sie dem Linienname ein"
                allowClear={true}
                value={search}
                onChange={(input: string) => {
                  setSearch(input);
                }}
                onSelect={handleSelect}
              >
                {managedRoutes &&
                  managedRoutes.map((el: any) => (
                    <Option value={el.name} key={el.key}>
                      {el.name}
                    </Option>
                  ))}
              </AutoComplete>
            </Form.Item>
          )}
        </Form>
      </Panel>
    </Collapse>
  );
};

export default React.memo(LoadManagedRouteForm);
