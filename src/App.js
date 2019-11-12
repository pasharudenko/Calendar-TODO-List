import React from "react";
import { connect } from "react-redux";

import Calendar from "./containers/Calendar";

function App(props) {
  props.setInitialState(new Date());
  return (
    <div>
      <h1>Calendar Application</h1>
      <Calendar />
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setInitialState: date => {
      dispatch({
        type: "SET_INITIAL_STATE",
        payload: date
      });
    }
  };
};

export default connect(null, mapDispatchToProps)(App);
