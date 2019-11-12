const initialState = {
  currentDate: null,
  currentMonthNumber: null,
  currentMonthName: null,
  currentDaysInMonth: null,
  currentYear: null
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const setState = date => {
  date.setHours(12);
  date.setMinutes(12);
  date.setSeconds(12);
  date.setMilliseconds(12);
  const currentMonthNumber = date.getMonth();
  const currentYear = date.getFullYear();
  const currentDaysInMonth = new Date(
    currentYear,
    currentMonthNumber + 1,
    0
  ).getDate();
  const currentMonthName = monthNames[currentMonthNumber];
  return {
    currentDate: date,
    currentMonthNumber,
    currentMonthName,
    currentDaysInMonth,
    currentYear
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return {
        ...state,
        ...setState(action.payload)
      };

    case "CHANGE_CALENDAR":
      const copiedDate = new Date(state.currentDate);

      if (action.payload === "+") {
        copiedDate.setMonth(copiedDate.getMonth() + 1);
      } else {
        copiedDate.setMonth(copiedDate.getMonth() - 1);
      }

      return {
        ...state,
        ...setState(copiedDate)
      };
    default:
      return state;
  }
};

export default reducer;
