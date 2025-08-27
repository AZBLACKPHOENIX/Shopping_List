import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/authSlice";
import styles from './dash.module.css'
import { faArrowLeft, faHome,  faList, faTools, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch()
  

    const handleLogOut = () => {
        dispatch(logout())
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.profile}>
                <p>{user?.name[0]}</p>
              
            </div>
            <div className={styles.username}>
            <h3>{user?.name}</h3>
            </div>

            <div className={styles.links}>
                <Link to="/Home" className={styles.link}>
                    <div className={styles.link_item}>
                        <p><FontAwesomeIcon icon={faHome} className={styles.icon} /></p>
                        <p>Home</p>
                    </div>
                </Link>

                <Link to="/Add" className={styles.link}>
                    <div className={styles.link_item}>
                        <p><FontAwesomeIcon icon={faList} className={styles.icon} /></p>
                        <p>New</p>
                    </div>
                </Link>

                <Link to="/Profile" className={styles.link}>
                    <div className={styles.link_item}>
                        <p><FontAwesomeIcon icon={faUser} className={styles.icon} /></p>
                        <p>Profile</p>
                    </div>
                </Link>

                <Link to="/Settings" className={styles.link}>
                    <div className={styles.link_item}>
                        <p><FontAwesomeIcon icon={faTools} className={styles.icon} /></p>
                        <p>Settings</p>
                    </div>
                </Link>

                
                <Link to="/Login" className={styles.link} onClick={handleLogOut}>
                    <div className={styles.link_item}>
                        <p><FontAwesomeIcon icon={faArrowLeft} className={styles.icon} /></p>
                        <p>Logout</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}