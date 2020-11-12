import React, {
  Fragment,
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { Col, Button, Dropdown, Menu, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";

// Typescript
export interface TstateDND {
  vorschlag: {
    title: string;
    items: {
      _id: string;
      name: string;
    }[];
  };
  trajekt: {
    title: string;
    items: {
      _id: string;
      name: string;
    }[];
  };
}

interface TnavBarProps {
  stopSequenceList: any;
  savedStopSequence: any;
  updateDate: string;
  isSending: boolean;
  stateDND: TstateDND;
  currentMode: string;
  currentStopSequenceName: any;
  onSendRequest: (modes: string, currentMode: string) => void;
  onClearAll: () => void;
  handleUpdateAfterSave: () => void;
  handleDeleteStopSequence: (id: string) => void;
  ondisplayStopSequence: (stopSequenceName: any) => void;
}

const NavBar = ({
  isSending,
  stateDND,
  stopSequenceList,
  savedStopSequence,
  updateDate,
  currentMode,
  currentStopSequenceName,
  onSendRequest,
  onClearAll,
  handleUpdateAfterSave,
  handleDeleteStopSequence,
  ondisplayStopSequence,
}: TnavBarProps) => {
  const [modes, setModes] = useState<string>("");
  const [stopSequenceName, setStopSequenceName] = useState<string>("");
  const stopSequenceRef = useRef("");
  const [styleChanged, setStyleChanged] = useState(false);

  // handle the drop menu to display the choosed Modes on Map
  const handleDropDownMenu = useCallback(
    (event: any) => {
      setModes(event.item.props.children[1]);
      if (event.item.props.children[1] !== currentMode) {
        setStopSequenceName("");
        onClearAll();
      }
    },
    [currentMode, onClearAll]
  );
  // Menu of the drop menu
  const menu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownMenu}>
        <Menu.Item key="2">13</Menu.Item>
        <Menu.Item key="3">5</Menu.Item>
        <Menu.Item key="4">8</Menu.Item>
        <Menu.Item key="5">9</Menu.Item>
        <Menu.Item key="6">2</Menu.Item>
        <Menu.Item key="7">4</Menu.Item>
      </Menu>
    ),
    [handleDropDownMenu]
  );

  // handle the drop menu to display the stop sequence on the map
  const handleDropDownStopsequenceMenu = useCallback(
    (event: any) => {
      if (currentStopSequenceName.name === event.item.props.children[1]) return;
      const response = stopSequenceList.filter(
        (el: any) => el.name === event.item.props.children[1]
      )[0];
      ondisplayStopSequence(response);
      setStopSequenceName(event.item.props.children[1]);
    },
    [stopSequenceList, currentStopSequenceName, ondisplayStopSequence]
  );

  // stop sequence drop down menu
  const stopSequenceMenu = useMemo(
    () => (
      //@ts-ignore
      <Menu onClick={handleDropDownStopsequenceMenu}>
        {stopSequenceList &&
          stopSequenceList.map((el: any, index: number) => (
            <Menu.Item
              key={index}
              onClick={() => {
                stopSequenceRef.current = el._id;
              }}
            >
              {el.name}
            </Menu.Item>
          ))}
      </Menu>
    ),
    [stopSequenceList, handleDropDownStopsequenceMenu]
  );

  const resize = () => {
    if (window.innerWidth < 695) {
      setStyleChanged(true);
    } else {
      setStyleChanged(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
  });

  return (
    <Fragment>
      <Col xxl={2} xs={6} style={{ paddingTop: "20px" }}>
        <Dropdown overlay={menu}>
          <p className="ant-dropdown-link" style={{ cursor: "pointer" }}>
            <strong>Modes : </strong>
            {modes} <DownOutlined />
          </p>
        </Dropdown>
      </Col>
      <Col xxl={3} xs={6} style={{ paddingTop: "20px" }}>
        <Dropdown
          overlay={stopSequenceMenu}
          disabled={stopSequenceList && stopSequenceList.length ? false : true}
        >
          <p className="ant-dropdown-link" style={{ cursor: "pointer" }}>
            <strong>Stop sequences : </strong> <DownOutlined />
            <br />
            {stopSequenceName}
          </p>
        </Dropdown>
      </Col>
      <Col xxl={3} xs={8} style={{ paddingTop: "20px", paddingLeft: "20px" }}>
        <p>
          <strong>Current mode : </strong>
          {currentMode}
          <br />
          <strong>Current stop sequence : </strong>
          <br />
          {stopSequenceName}
        </p>
      </Col>
      <Col
        xxl={8}
        xs={16}
        style={
          styleChanged
            ? {
                display: "flex",
                flexFlow: "wrap",
                paddingLeft: "70px",
                paddingTop: "20px",
                paddingRight: "20px",
              }
            : {
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "20px",
                paddingRight: "20px",
              }
        }
      >
        <Button
          id="navbar_getData_button"
          type="primary"
          disabled={isSending || modes ? false : true}
          style={styleChanged ? { width: "200px" } : undefined}
          onClick={() => {
            onSendRequest(modes, currentMode);
          }}
        >
          {modes === "" ? "Select a Mode" : `Get data with mode ${modes}`}
        </Button>
        <Button
          id="navbar_reset_button"
          type="primary"
          danger
          style={styleChanged ? { width: "200px" } : undefined}
          disabled={stateDND.trajekt.items.length ? false : true}
          onClick={() => {
            setStopSequenceName("");
            onClearAll();
          }}
        >
          Reset
        </Button>
        <Badge count={savedStopSequence.length}>
          <Button
            id="navbar_update_button"
            type="primary"
            style={styleChanged ? { width: "200px" } : undefined}
            onClick={() => {
              handleUpdateAfterSave();
            }}
            disabled={!savedStopSequence.length ? true : false}
          >
            Update
          </Button>
        </Badge>
        <Button
          id="navbar_delete_button"
          type="primary"
          danger
          style={styleChanged ? { width: "200px" } : undefined}
          disabled={Object.keys(currentStopSequenceName).length ? false : true}
          onClick={() => {
            if (
              window.confirm("You really want to delete the stop sequence ?")
            ) {
              handleDeleteStopSequence(stopSequenceRef.current);
              setStopSequenceName("");
            }
          }}
        >
          Delete stop sequence
        </Button>
      </Col>
    </Fragment>
  );
};

export default NavBar;
