import React, { useContext, useState } from 'react'
import { GlobalContext } from '../GlobalState'
import { RxAvatar } from "react-icons/rx";
import styles from "../styles/Avatar.module.css"
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom"

const Avatar = () => {

    const { logout } = useContext(GlobalContext)
    const [ showDropdown, setShowDropdown] = useState(false)


  return (
    <div className={styles.avatar__container__outer} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
      <RxAvatar size={40} className={styles.avatar__icon}/>
      {showDropdown &&
        <div className={styles.dropdown__container__outer}>
          <div className={styles.dropdown__container__inner}>
            <Link className={styles.link} to="/inventory">
              INVENTORY
            </Link>
            <Link className={styles.link} to="/mysales">
              MY SALES
            </Link>
            <button onClick={() => logout()}>LOG OUT</button>
          </div>
        </div> 
      }
    </div>
  )
}

export default Avatar