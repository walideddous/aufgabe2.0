import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Aufgabe from "./components/index";
import Acceuil from "./components/react";

import exemple from "./components/exemple";

// Redux
import { Provider } from "react-redux";
import Store from "./store";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Acceuil} />
          <Route exact path="/prototyp" component={Aufgabe} />
          <Route exact path="/exemple" component={exemple} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
