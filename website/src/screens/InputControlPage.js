import React from "react";

import styles from "./InputControl.module.css";

function InputControlPage(props) {
  return (
    <div className={styles.container}>
      {props.label && <label>{props.label}</label>}
      <input type="text" {...props} />
    </div>
  );
}

export default InputControlPage;