import React from "react";
import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

// const onClick = ({ event, props }: any) => console.log(event, props);

// create your menu first
/*
const MyAwesomeMenu = () => (
  <Menu id="menu_id">
    <Item onClick={onClick}>Lorem</Item>
    <Item onClick={onClick}>Ipsum</Item>
    <Separator />
    <Item disabled>Dolor</Item>
    <Separator />
    <Submenu label="Foobar">
      <Item onClick={onClick}>Foo</Item>
      <Item onClick={onClick}>Bar</Item>
    </Submenu>
  </Menu>
);
*/

const App = () => (
  <div>
    <MenuProvider id="menu_id">Right click me...</MenuProvider>
  </div>
);

export default App;
