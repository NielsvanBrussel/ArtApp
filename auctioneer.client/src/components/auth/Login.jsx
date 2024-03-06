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

const Login = () => {
   
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
        
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            
        }
      
        axios.post("api/auth/login", { username: username, password: password }, { withCredentials: false }, config)
        .then(res => {
            setLoading(false)
            if (!res.data.error) {
                console.log(res.data.user)
                setUser(res.data.user)
                setAuthenticated(true)
                localStorage.setItem("JWT", res.data.jwt)
                setAuthenticationWindow("success")
                console.log(res.data.user)
            } else {
                createError(res.data.message)
            }
        })
        .catch(err => {
            console.log(err)
            createError(err.request.statusText);
            setLoading(false)
        }); 
            
    }
        

    return (
        <div className={styles.auth__content}>
            <div className={styles.auth__content__inner}> 
                <h2 className={styles.title}>log in</h2>
                <div className={styles.error__container}>
                    {loading && 
                        <PuffLoader
                            color={"#c29b40"}
                            loading={loading}
                            cssOverride={override}
                            size={140}
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
                            placeholder="enter email address here..." 
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
                    <div className={styles.submit__container}>
                        {!loading && <button className={styles.button} type="submit">LOG IN</button>}
                    </div>
                </form>
                {/* <p>already have an account? login <Link className={`${styles.link} ${styles.button__left}`} to="/login">here</Link></p> */}
            </div>
        </div>
    )  
}

export default Login