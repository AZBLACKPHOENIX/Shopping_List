import React, { useEffect, useState } from 'react'
import { Auth } from './Auth'
import styles from './Auth.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import Heading from '../Heading/heading';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser } from "../redux/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { Link } from 'react-router-dom';

export function Register() {
    const [showPassword, setshowPassword] = useState(false)
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const dispatch: AppDispatch = useDispatch();
    const { loading, user } = useSelector((state: RootState) => state.auth);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(RegisterUser(form))
    }

    const navigate = useNavigate()

    useEffect(()=>{
        if (user){
            alert('Registration Sucessfully, Please Log In')
            navigate("/Login")
        }
    })

    return (
        <form onSubmit={handleSubmit}>
            <Auth>
                <div>
                    <Heading start='Sign ' highlight='Up' end="!" />
                </div>
                <div className={styles.inputs}>
                    <div className={styles.inputcontainer}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                    </div>

                    <div className={styles.inputcontainer}>
                        <input type='text' placeholder='Email' onChange={handleChange} value={form.email} name='email' />
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                    </div>

                    <div className={styles.inputcontainer}>
                        <input type='tel' placeholder='Phone number' onChange={handleChange} value={form.phone} name='phone'/>
                        <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                    </div>

                    <div className={styles.inputcontainer}>
                        <input className={styles.password} type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange} name='password'/>
                        <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} onClick={() => setshowPassword(!showPassword)} />
                    </div>
                </div>

                <div className={styles.button}>
                    <button type="submit" disabled={loading}> {loading ? "Signing Up..." : "Sign Up"}</button>
                </div>

                <div className={styles.content}>
                    <Link to="/Login">
                        Already hav an account? Click here!
                    </Link>
                </div>
            </Auth>
        </form>
    )
}