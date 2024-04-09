import React, { useContext, useState } from 'react'
import axios from "axios";
import styles from '../../styles/Auth.module.css'
import { GlobalContext } from '../../GlobalState';
import PuffLoader from "react-spinners/PuffLoader";
import { BiErrorAlt } from "react-icons/bi";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Register = () => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const { setAuthenticationWindow, setAuthenticated, setUser } = useContext(GlobalContext)

    
    const ErrorMessage = () => {
        return (<h3>{errorMessage}</h3>)
    }


    const createError = (message) => {
        setError(true)
        setErrorMessage(message)
        setTimeout(() => {
            setError(false)
            setErrorMessage("")
        }, 4000);
    }

    const onSubmit = e => {
        setLoading(true)
        e.preventDefault()
        
        if (password === passwordConfirm) {
            
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                
            }           
                     
    
            axios.post("api/auth/register", { username: username, password: password }, { withCredentials: false }, config)
                .then(res => {
                    setLoading(false)
                    console.log(res.data)
                    if (!res.data.error) {
                        setUser(res.data.user)
                        setAuthenticated(true)
                        localStorage.setItem("JWT", res.data.jwt)
                        setAuthenticationWindow("success")
                    } else {
                        createError(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                    //   createError(err.request.statusText);
                }); 
            
        } else {
            createError("Passwords do not match!")
            setLoading(false)
        }
    }
        

    return (
        <div className={styles.auth__content}>
            <div className={styles.auth__content__inner}> 
                <h2 className={styles.title}>sign up</h2>
                <div className={styles.error__container}>
                    {loading && 
                        <PuffLoader
                            color={"#c29b40"}
                            loading={loading}
                            cssOverride={override}
                            size={120}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    }
                    {error && !loading &&
                        <>
                            <BiErrorAlt size={36} />
                            <ErrorMessage />  
                        </>
                    }
                </div>
                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.form__input__container}>
                        <input
                            autoFocus  
                            className={styles.form__input} 
                            type="text" value={username} 
                            disabled={loading} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="enter username here..." 
                            required
                        />
                    </div>
                    <div className={styles.form__input__container}>
                        <input 
                            className={styles.form__input} 
                            type="password" 
                            value={password} 
                            disabled={loading} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="enter password here..." 
                            required
                        />
                    </div>
                    <div className={styles.form__input__container}>
                        <input 
                            className={styles.form__input} 
                            type="password" 
                            value={passwordConfirm} 
                            disabled={loading} 
                            onChange={(e) => setPasswordConfirm(e.target.value)} 
                            placeholder="confirm password..." 
                            required
                        />
                    </div>
                    <div className={styles.submit__container}>
                        {!loading && <button className={styles.button} type="submit">SIGN UP</button>}
                    </div>
                </form>
                {/* <p>already have an account? login <Link className={`${styles.link} ${styles.button__left}`} to="/login">here</Link></p> */}
            </div>
        </div>
    )      
}

export default Register