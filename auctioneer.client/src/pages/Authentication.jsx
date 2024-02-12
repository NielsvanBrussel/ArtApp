import React, { useContext } from 'react'
import { GlobalContext } from '../GlobalState'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Success from '../components/auth/Success'
import styles from '../styles/Authentication.module.css'
import { GrClose } from "react-icons/gr";

const Authentication = () => {

  const { setAuthenticationWindow, authenticationWindow } = useContext(GlobalContext)

  const getComponent = () => {
    switch (authenticationWindow) {
      case "register":
        return <Register />
      case "login":
        return <Login />
      case "success":
        return <Success />
    }
  }

  if (authenticationWindow !== 'none') {
    return (
      <div className={styles.auth__container__outer}>
        <div className={styles.auth__container__inner}>
          <div className={styles.auth__button__container}>
            <GrClose className={styles.auth__button} size={36} onClick={() => setAuthenticationWindow("none")}/>
          </div>
          {getComponent()}
        </div>
      </div>
    )
  } else {
    return null
  }

}

export default Authentication