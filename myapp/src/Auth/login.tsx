import { useEffect, useState, type ReactElement } from 'react'
import { Auth } from './Auth'
import styles from './Auth.module.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Heading from '../Heading/heading';
import { useDispatch, useSelector } from "react-redux";
import { loginuser, RegisterUser } from "../redux/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { getAdapter } from 'axios';

export function LogIn() {
    const dispatch = useDispatch<any>();
    const { loading, error, user } = useSelector((state: RootState) => state.auth);
    const [showPassword, setshowPassword] = useState(false)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const result = await dispatch(loginuser(form));
        console.log(form.email, form.password)
        if (loginuser.fulfilled.match(result)) {
            alert("Login successful!");
            navigate("/Home");
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (user) {
            navigate("/Home")
        }
    }, [user])

    return (

        <form onSubmit={handleSubmit}>
            <Auth>
                <div>
                    <Heading start='Sign ' highlight='In' end="!" />
                </div>
                <div className={styles.inputs}>

                    <div className={styles.inputcontainer}>
                        <input type='text' placeholder='Email' onChange={handleChange} value={form.email} name='email' />

                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                    </div>

                    <div className={styles.inputcontainer}>
                        <input className={styles.password} type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} name="password" onChange={handleChange} />
                        <FontAwesomeIcon className={styles.icon} icon={showPassword ? faEyeSlash : faEye} onClick={() => setshowPassword(!showPassword)} />
                    </div>
                </div>
                <div className={styles.button}>
                    <button type="submit">Sign In</button>
                </div>
                <div className={styles.content}>
                    <Link to="/Register">
                        Don't have an account? Click here!
                    </Link>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </Auth>
        </form>


    )
}