import React from "react";
import styles from "./users.module.css";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
const Search = () => {
  return (
    <div className={styles.search}>
      <input type="text" placeholder="Search Users" />
      <Icon path={mdiMagnify} size={1}></Icon>
    </div>
  );
};

export default Search;
