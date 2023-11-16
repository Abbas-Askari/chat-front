import React from "react";
import styles from "./users.module.css";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import { useDispatch, useSelector } from "react-redux";
import { changedQuery } from "./usersSlice";
const Search = () => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.users).query;

  return (
    <div className={styles.search}>
      <input
        onChange={(e) => {
          dispatch(changedQuery(e.target.value));
        }}
        type="text"
        placeholder="Search Users"
      />
      <Icon path={mdiMagnify} size={1}></Icon>
    </div>
  );
};

export default Search;
