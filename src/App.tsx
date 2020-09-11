import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Aufgabe from "./components/index";
import Acceuil from "./components/react";

// Redux
import { Provider } from "react-redux";
import Store from "./store";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Aufgabe} />
          <Route exact path="/react" component={Acceuil} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
