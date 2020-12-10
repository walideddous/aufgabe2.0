import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

const Store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default Store;



/*
{
  "name": "components",
  "version": "1.0.0",
  "description": "",
  "main": "agent.js",
  "scripts": {
    "test": "react-scripts test --coverage",
    "lint": "eslint ./src/",
    "build": "webpack --mode development --display-error-details",
    "build:prod": "webpack --mode production",
    "visualizer": "webpack --mode development --json > agent-stats.json",
    "visualizer:prod": "webpack --mode production --json > agent-stats-prod.json",
    "start": "webpack-dev-server --mode development --open --hot --disableHostCheck=true --host 0.0.0.0 --port 3347"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.20.0",
    "babel-plugin-rewire": "^1.2.0",
    "customize-cra": "^0.8.0"
  },
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^10.4.7",
    "@testing-library/react-hooks": "^3.4.2",
    "@types/jest": "^26.0.17",
    "@types/node": "^14.14.11",
    "axios-cache-adapter": "^2.5.0",
    "babel-eslint": "^10.0.3",
    "babel-jest": "^26.6.3",
    "babel-plugin-import": "^1.13.3",
    "css-loader": "^3.5.3",
    "eslint": "^6.8.0",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-jquery": "^1.5.1",
    "eslint-plugin-react": "^7.21.5",
    "fetch-mock": "^9.11.0",
    "html-webpack-plugin": "^3.2.0",
    "identity-obj-proxy": "^3.0.0",
    "jquery": "^1.12.4",
    "less": "^3.12.0",
    "less-loader": "^5.0.0",
    "less-vars-to-js": "^1.3.0",
    "node-fetch": "^2.6.1",
    "react-app-rewired": "^2.1.6",
    "rewire": "^5.0.0",
    "style-loader": "^1.2.1",
    "ts-jest": "^26.4.4",
    "typescript": "^4.1.2",
    "unfetch": "^4.2.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  },
  "jest": {
    "roots": [
      "<rootDir>",
      "<rootDir>/../common"
    ],
    "modulePaths": [
      "<rootDir>",
      "<rootDir>/../common"
    ],
    "moduleDirectories": [
      "node_modules",
      "src/react",
      "src"
    ],
    "displayName": "AGENT",
    "automock": true,
    "coverageReporters": [
      "json",
      "text",
      "lcovonly",
      "clover"
    ],
    "coverageDirectory": "<rootDir>/../common/src/test/coverage/agent/",
    "moduleNameMapper": {
      "^MODULES(.*)$": "<rootDir>/node_modules$1",
      "^JQUERYUI(.*)$": "<rootDir>/../common/src/jquery-ui/1.11$1",
      "^COMMON_SRC(.*)$": "<rootDir>/../common/src$1",
      "^COMMON_MODULES(.*)$": "<rootDir>/../common/node_modules$1",
      "^@apollo(.*)$": "<rootDir>/../common/node_modules/@apollo$1",
      "^@testing-library(.*)$": "<rootDir>/../common/node_modules/@testing-library$1",
      "^react(.*)$": "<rootDir>/../common/node_modules/react$1",
      "^react-h5(.*)$": "<rootDir>/../common/node_modules/react-h5$1",
      "^enzyme(.*)$": "<rootDir>/../common/node_modules/enzyme$1",
      "^antd(.*)$": "<rootDir>/../common/node_modules/antd$1",
      "^moxios(.*)$": "<rootDir>/../common/node_modules/moxios$1",
      "^apollo(.*)$": "<rootDir>/../common/node_modules/apollo$1",
      "^graphql(.*)$": "<rootDir>/../common/node_modules/graphql$1",
      "^@ant-design(.*)$": "<rootDir>/../common/node_modules/@ant-design$1",
      "^$(.*)$": "<rootDir>/../common/node_modules/jquery",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|scss)$": "<rootDir>/../common/src/test/__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    },
    "setupFiles": [
      "<rootDir>/../common/src/test/rtl.setup.js"
    ],
    "jest": {
      "transform": {
        "^.+\\.tsx?$": "ts-jest"
      },
      "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
      ]
    }
  }
}




*/