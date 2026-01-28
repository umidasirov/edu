import React, { useContext } from 'react'

import user from "../../assets/user.png";
import { AccessContext } from '../../AccessContext';

const UserData = () => {
  const { profileData } = useContext(AccessContext);
    return (
    <div id='u-data'>
        <div className="u-left">
            <img src={profileData?.image || user} alt="" />
        </div>
        <div className="u-right">
            <div className="name">{profileData?.first_name} {profileData?.last_name}</div>
        </div>
    </div>
  )
}

export default UserData