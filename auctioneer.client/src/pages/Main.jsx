import React from 'react'
import Carousel from '../components/Carousel'
import styles from '../styles/Main.module.css'
import Auctions from '../components/auctions/Auctions'

const Main = () => {
  
  return (
    <div className={styles.container__outer}>
      <div className={styles.container__inner}>
        <Carousel />
        <Auctions />
      </div>
    </div>
  )
}

export default Main