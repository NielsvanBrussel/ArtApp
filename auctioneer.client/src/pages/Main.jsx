import React from 'react'
import Carousel from '../components/Carousel'
import styles from '../styles/Main.module.css'

const Main = () => {
  
  return (
    <div className={styles.container__outer}>
      <div className={styles.container__inner}>
        <Carousel />
      </div>
    </div>
  )
}

export default Main