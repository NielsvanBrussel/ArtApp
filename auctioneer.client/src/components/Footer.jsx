import React from 'react'
import { FaXTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <div className={styles.footer__container__outer}>
        <div className={styles.footer__container__inner}>
            <div>
            </div>
            <p>Copyright (c) &copy; 2024 Barlow & Pyne</p>
            <div className={styles.footer__icon__container}>
                <FaXTwitter />
                <FaFacebookF />
                <FaInstagram />
                <FaYoutube />
            </div>
        </div>
    </div>
  )
}

export default Footer