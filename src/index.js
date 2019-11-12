import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import "./assets/index.css";
import App from "./App";
import reducer from "./store/reducers/reducer";

const rootReducer = combineReducers({
  reducer
});

const store = createStore(rootReducer);

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
