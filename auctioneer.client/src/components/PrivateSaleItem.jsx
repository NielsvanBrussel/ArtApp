import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/PrivateSaleItem.module.css'
import { GlobalContext } from '../GlobalState'

const PrivateSaleItem = ({ data, getSales }) => {

  const navigate = useNavigate()

  const { user, setUser } = useContext(GlobalContext)

  const [image, setImage] = useState(true)
  const url = `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`
  
  const navigateToArtwork = () => {
      navigate('/artwork', { state: {artwork: data, price: data.price}})
  }

  

  const cancelSale = async () => {


    // TODO: confirmation

    const JWT = localStorage.getItem('JWT')

    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JWT}`
            },
        }

        const sale_id = data.id

        const res = await axios.post("api/sales/cancel", sale_id, config)
       
        if (!res.data.error) {
            // refetch sales
            getSales()
            setUser(res.data.user)
        }
        
    } catch (error) {
        console.log(error)
    }

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
                    <div className={styles.inventory__item__button__container}>
                        <button className={styles.button__link} onClick={() => navigateToArtwork()}>DETAILS</button>
                        <button className={styles.button} onClick={() => cancelSale()}>CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PrivateSaleItem