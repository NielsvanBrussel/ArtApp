import React from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../GlobalState'
import styles from '../styles/Header.module.css'
import { RxAvatar } from "react-icons/rx";
import Avatar from './Avatar';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom"

const Header = () => {

    const { authenticated, setAuthenticationWindow } = useContext(GlobalContext)

  return (
    <div className={styles.header__container__outer}>
        <div className={styles.header__container__inner}>
            <Link className={styles.link} to="/">
                <div className={styles.header__logo__container}>
                    <h1 className={styles.header__logo}>Barlow & Pyne</h1>
                </div>
            </Link>
            <div className={styles.header__nav__container}>
                <div className={styles.header__nav__subcontainer}>
                    <button className={styles.header__nav__button}>BUY NOW</button>
                    <Link className={styles.link} to="/privatesales">
                        <button className={styles.header__nav__button}>PRIVATE SALES</button>
                    </Link>
                    <button className={styles.header__nav__button}>SELL</button>
                </div>
                <div className={styles.header__nav__subcontainer}>
                    {authenticated ?
                        <Avatar />
                    :
                        <>
                            <button className={styles.header__nav__button} onClick={() => setAuthenticationWindow("login")}>LOG IN</button>
                            <button className={styles.header__nav__button} onClick={() => setAuthenticationWindow("register")}>SIGN UP</button>
                        </> 
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header