import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const ProfilePicture = ({ url }) => {
  return (
    <div className={styles.profilePicture + " profile-pic"}>
      {url ? <img src={url} /> : <Icon path={mdiAccount} size={1.5} />}
    </div>
  );
};

export default ProfilePicture;
