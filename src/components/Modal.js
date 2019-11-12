import React from "react";

function Modal(props) {
  const saveHanlder = () => {
    const input = document.getElementById("input").value;
    const textarea = document.getElementById("textarea").value;
    props.save({
      name: input,
      text: textarea
    });
  };

  const updateHandler = () => {
    const input = document.getElementById("input").value;
    const textarea = document.getElementById("textarea").value;
    props.update({
      name: input,
      text: textarea
    });
  };

  const deleteHandler = () => {
    props.delete();
  };

  return (
    <div className="modal">
      <div className="modal-container">
        <h1>Insert your reminder</h1>
        <input type="text" id="input" defaultValue={props.name} />
        <textarea id="textarea" defaultValue={props.text}></textarea>
        {props.name && props.text ? (
          <button onClick={updateHandler}>Edit data</button>
        ) : (
          <button onClick={saveHanlder}>Save data</button>
        )}
        {props.name && props.text ? (
          <button onClick={deleteHandler}>Delete data</button>
        ) : null}
      </div>
    </div>
  );
}

export default Modal;
