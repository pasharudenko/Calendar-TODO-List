import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "../components/Modal";

export class Calendar extends Component {
  state = {
    isModalOpen: false,
    data: null,
    name: "",
    text: ""
  };

  componentDidMount() {
    return axios
      .get("http://react/Training/calendar-upgrade/server/show.php")
      .then(resposne => {
        this.setState({
          data: resposne.data
        });
      });
  }

  changeCalendar = value => {
    this.props.changeCalendar(value);
  };

  openModal = (event, openedDay, isEditable = false) => {
    event.stopPropagation();
    if (isEditable) {
      this.setState({
        isModalOpen: true,
        id: isEditable.id,
        name: isEditable.name,
        text: isEditable.text
      });
      return;
    }

    this.setState({
      isModalOpen: true,
      openedDay,
      name: "",
      text: ""
    });
  };

  saveToDB = data => {
    this.setState({
      isModalOpen: false
    });

    const date = new Date(this.props.currentDate);
    date.setDate(this.state.openedDay);

    const dataToSend = {
      ...data,
      date: date.getTime()
    };
    axios
      .post(
        "http://react/Training/calendar-upgrade/server/create.php",
        dataToSend
      )
      .then(response => {
        this.setState(prevState => ({
          data: [...prevState.data, { id: response.data, ...dataToSend }]
        }));
      });
  };

  updateToDB = data => {
    const dataToSend = {
      id: this.state.id,
      ...data
    };
    const reminders = [...this.state.data];
    const index = reminders.findIndex(curr => {
      return curr.id === dataToSend.id;
    });
    reminders[index].name = data.name;
    reminders[index].text = data.text;
    this.setState({
      data: reminders,
      isModalOpen: false
    });
    axios.post(
      "http://react/Training/calendar-upgrade/server/update.php",
      dataToSend
    );
  };

  deleteToDB = () => {

    axios.post("http://react/Training/calendar-upgrade/server/delete.php", {
      id: this.state.id
    });

    const reminders = this.state.data.filter(curr => {
      return curr.id !== this.state.id;
    });
    this.setState({
      data: reminders,
      isModalOpen: false,
      name: "",
      text: ""
    });
  };

  renderCalendar = () => {
    const calendar = [];

    for (let i = 1; i <= this.props.currentDaysInMonth; i++) {
      let date = new Date(this.props.currentDate);
      date.setDate(i);

      date = date.getTime();
      const reminders = [];
      for (let element in this.state.data) {
        if (+this.state.data[element].date === date)
          reminders.push(
            <li
              key={
                this.state.data[element].name + this.state.data[element].text
              }
              onClick={event =>
                this.openModal(event, null, {
                  id: this.state.data[element].id,
                  name: this.state.data[element].name,
                  text: this.state.data[element].text
                })
              }
            >
              {this.state.data[element].name}
            </li>
          );
      }

      calendar.push(
        <div key={i.toString()} onClick={event => this.openModal(event, i)}>
          <span>{i}</span>
          <ul>{reminders}</ul>
        </div>
      );
    }
    return calendar;
  };

  render() {
    return (
      <div className="container">
        {this.state.isModalOpen ? (
          <Modal
            save={this.saveToDB}
            update={this.updateToDB}
            delete={this.deleteToDB}
            name={this.state.name}
            text={this.state.text}
          />
        ) : null}
        <div>
          <div className="calendar">
            <nav className="calendar-nav">
              <button
                onClick={() => {
                  this.changeCalendar("-");
                }}
              >
                Previos Month
              </button>
              <h1>
                {this.props.currentMonthName} {this.props.currentYear}
              </h1>
              <button
                onClick={() => {
                  this.changeCalendar("+");
                }}
              >
                Next Month
              </button>
            </nav>
            <div className="calendar-container">{this.renderCalendar()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentDate: state.reducer.currentDate,
    currentMonthNumber: state.reducer.currentMonthNumber,
    currentMonthName: state.reducer.currentMonthName,
    currentDaysInMonth: state.reducer.currentDaysInMonth,
    currentYear: state.reducer.currentYear
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeCalendar: value => {
      dispatch({
        type: "CHANGE_CALENDAR",
        payload: value
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
