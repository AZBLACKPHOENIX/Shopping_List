import React, { useState } from "react";
import styles from './index.module.css'
import Heading from "../Heading/heading";
import { Link } from "react-router-dom";
export const Index = () => {
    return (
        <div className={styles.Shopping_List}>
            <div className={styles.heading}>
                <Heading start="Welcome To Phoenix " highlight="Shopping " end="List" />
            </div>
            <div className={styles.content}>
                <p>Do you want to upgrade and move to the next stage of tech?</p>
                <p>Instead of having temparary shopping list, we provide you with</p>
                <p>Effecient, Solid, Cloud Storage Shopping List</p>
            </div>
            <div className={styles.buttons}>
               <Link to="/Register">
                    <button>Register</button>
               </Link>
               <Link to="/Login">
                     <button>Log In</button>
               </Link>
            </div>
        </div>
    )
}