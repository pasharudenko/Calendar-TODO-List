import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";

import { Calendar } from "../containers/Calendar";
import Modal from "../components/Modal";
import reducer from "../store/reducers/reducer";

configure({
  adapter: new Adapter()
});

jest.mock("axios", () => {
  const info = { data: [] };

  return {
    get: jest.fn(() => Promise.resolve(info)),
    post: jest.fn(() => Promise.resolve(info))
  };
});

describe("<Calendar />", () => {
  let component;

  beforeEach(() => {
    component = shallow(<Calendar />);
  });

  it("should fetch data from the server", () => {
    component
      .instance()
      .componentDidMount()
      .then(() => {
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(
          "http://react/Training/calendar-upgrade/server/show.php"
        );
        expect(component.state()).toHaveProperty("data", []);
      });
  });

  it("should pass right value in function when clicked next or prev month", () => {
    component.setProps({ changeCalendar: jest.fn() });

    component
      .find("button")
      .at(0)
      .simulate("click");
    expect(component.instance().props.changeCalendar).toHaveBeenCalledWith("-");

    component
      .find("button")
      .at(1)
      .simulate("click");

    expect(component.instance().props.changeCalendar).toHaveBeenCalledWith("+");
  });

  it("should save to DB", () => {
    component.setState({ isModalOpen: true, openedDay: 1 });
    component.setProps({ currentDate: 1573566303549 });

    document.body.innerHTML =
      '<input type="text" id="input" value="input"><input type="text" id="textarea" value="textarea">';

    component
      .find(Modal)
      .dive()
      .find("button")
      .at(0)
      .simulate("click");
    expect(axios.post).toHaveBeenCalled();

    const info = {
      date: 1572615903549,
      name: "input",
      text: "textarea"
    };

    expect(axios.post).toHaveBeenCalledWith(
      "http://react/Training/calendar-upgrade/server/create.php",
      info
    );
  });

  it("should update to DB", () => {
    document.body.innerHTML =
      '<input type="text" id="input" value="new input"><input type="text" id="textarea" value="new textarea">';

    component.setState({
      isModalOpen: true,
      id: 1,
      name: "name",
      text: "text",
      data: [
        {
          id: 1,
          name: "name",
          text: "text"
        }
      ]
    });

    component
      .find(Modal)
      .dive()
      .find("button")
      .at(0)
      .simulate("click");

    expect(axios.post).toHaveBeenCalled();
    expect(
      axios.post
    ).toHaveBeenCalledWith(
      "http://react/Training/calendar-upgrade/server/update.php",
      { id: 1, name: "new input", text: "new textarea" }
    );

    expect(component.state().isOpendModal).toBeFalsy();
    expect(component.state().data).toEqual([
      { id: 1, name: "new input", text: "new textarea" }
    ]);
  });

  it("should delete to DB", () => {
    component.setState({
      isModalOpen: true,
      id: 1,
      name: "name",
      text: "text"
    });

    component
      .find(Modal)
      .dive()
      .find("button")
      .at(1)
      .simulate("click");

    expect(axios.post).toHaveBeenCalled();
    expect(
      axios.post
    ).toHaveBeenCalledWith(
      "http://react/Training/calendar-upgrade/server/delete.php",
      { id: 1 }
    );
    expect(component.state().data).toEqual([]);
  });
});

describe("calendar reducer", () => {
  it("should set initial state", () => {
    const initialState = {
      currentDate: null,
      currentMonthNumber: null,
      currentMonthName: null,
      currentDaysInMonth: null,
      currentYear: null
    };

    expect(
      reducer(initialState, { type: "SET_INITIAL_STATE", payload: new Date() })
    ).toEqual(expect.not.objectContaining(initialState));
  });

  it("should cahnge calendar state", () => {
    const initialState = {
      currentDate: "2019-11-12T09:12:12.012Z",
      currentMonthNumber: 10,
      currentMonthName: "November",
      currentDaysInMonth: 30,
      currentYear: 2019
    };

    expect(
      reducer(initialState, { type: "CHANGE_CALENDAR", payload: "+" })
    ).toEqual(
      expect.objectContaining({
        currentDaysInMonth: 31,
        currentMonthName: "December",
        currentMonthNumber: 11
      })
    );

    expect(
      reducer(initialState, { type: "CHANGE_CALENDAR", payload: "-" })
    ).toEqual(
      expect.objectContaining({
        currentDaysInMonth: 31,
        currentMonthName: "October",
        currentMonthNumber: 9
      })
    );
  });
});
