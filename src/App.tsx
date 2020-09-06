import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Aufgabe from './components/index';
import Acceuil from './components/react';

// Dnd
import Dnd from './components/dnd';

// Redux
import { Provider } from 'react-redux';
import Store from './store';

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Switch>
          <Route exact path='/' component={Acceuil} />
          <Route exact path='/aufgaben' component={Aufgabe} />
          <Route exact path='/dnd' component={Dnd} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
