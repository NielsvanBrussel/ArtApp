import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/PrivateSaleItem.module.css'

const PrivateSaleItem = ({ data }) => {

  const navigate = useNavigate()

  const [image, setImage] = useState(true)
  const url = `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`
  
  const navigateToArtwork = () => {
      navigate('/artwork', { state: {artwork: data, price: data.price}})
  }

  return (
    <div className={styles.inventory__item__container__outer}>
        <div className={styles.inventory__item__container__inner}>
            <div className={styles.inventory__item__image__container}>
            {image ?
                <img className={styles.inventory__item__image}
                    src={url} alt={data.title}
                    onError={() => setImage(false)}  
                />
            :
                <div className={styles.inventory__item__image__error}>
                    <h3>Image not available</h3>
                </div>
            }
            </div>
            <div className={styles.inventory__item__text__container__outer}>
                <div className={styles.inventory__item__text__container__inner}>
                    <div>
                        <h4>{data.title}</h4>
                        <p>{data.artist_display}</p>
                        <p>€{data.price}</p>
                    </div>
                    <button onClick={() => navigateToArtwork()}>DETAILS</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PrivateSaleItem