import React, { useState, useEffect } from 'react'
import styles from '../../styles/Auctions.module.css'
import { TfiInfoAlt } from "react-icons/tfi";

const UpcomingAuction = ({ data }) => {


  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const [image, setImage] = useState(true)
  
  const date = new Date();

  const day = days[date.getDay()]
  const month = months[date.getMonth()]


  return (
    <div className={`${styles.auction__container} ${styles.column}`}>
            <div className={styles.auction__image__container}>
                {image ?
                    <img className={styles.auction__image}
                        src={data.image_url} alt={data.title}
                        onError={() => setImage(false)}  
                    />
                :
                    <div className={styles.auction__image__error}>
                        <h3>Image not available</h3>
                    </div>
                }
            </div>
            <div className={styles.auction__text__container__outer}>
                <div className={styles.auction__text__container__inner}>
                    <h3 className={styles.auction__header}>{data.title}</h3>
                    <div>
                      <p>{day} {date.getDate()} {month}</p>
                      <p>{data.short_description}</p>
                      <div className={styles.auction__button__container}>
                          <button className={styles.button__alt}>BID</button>
                          <div className={styles.icon__container}>
                              <TfiInfoAlt size={32}/>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default UpcomingAuction