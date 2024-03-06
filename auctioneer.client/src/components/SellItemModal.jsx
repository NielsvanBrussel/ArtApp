import React, { useContext, useState } from 'react'
import { GlobalContext } from '../GlobalState';
import { GrClose } from "react-icons/gr";
import styles from '../styles/SellItemModal.module.css'
import axios from 'axios';
import { PuffLoader } from 'react-spinners';
import { Checkmark } from 'react-checkmark';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const SellItemModal = ({setSaleModalActive, itemToSell}) => {

    const [price, setPrice] = useState(0)
    const [image, setImage] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { setUser } = useContext(GlobalContext)

    const url = `https://www.artic.edu/iiif/2/${itemToSell.image_id}/full/843,/0/default.jpg`
   

    const ErrorMessage = () => {
        if (errorMessage === 'Sale created.') {
            return <Checkmark size='124px' color='#c29b40'/>
        }
        return <h3>{errorMessage}</h3>
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
        e.preventDefault()
        setLoading(true)
        if (price === 0) {
            createError("Please set the price at a value higher than 0.")
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        } else {
            sellItem()
        }
    }

    const sellItem = async () => {

       
        try {

            const JWT = localStorage.getItem('JWT')

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JWT}`
                },
            }

            const data = {
                price: price,
                api_id: itemToSell.id
            }

            const res = await axios.post("api/sales", data, config)
            if (!res.data.error) {
                setUser(res.data.user)
            }
            createError(res.data.message)
            setTimeout(() => {
                setSaleModalActive(false)
            }, 2000);
            
        } catch (error) {
            console.log(error)
            createError("An error occured please try again.")
            setLoading(false)
        }
    }



  return (
    <div className={styles.modal__outer}>
        <div className={styles.modal__inner}>
            <div className={styles.modal__button__container}>
                <GrClose className={styles.modal__button} size={36} onClick={() => setSaleModalActive(false)}/>
            </div>
            <h1>Sell item</h1>
            <div className={styles.modal__container__outer}>
                <div className={styles.modal__container__inner}>
                    <div className={styles.modal__image__container__outer}>
                        <div className={styles.modal__image__container__inner}>
                            {image ?
                                <img className={styles.modal__image}
                                    src={url} alt={itemToSell.title}
                                    onError={() => setImage(false)}  
                                />
                            :
                                <div className={styles.modal__image__error}>
                                    <h3>Image not available</h3>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.modal__text__container__outer}>
                        <div className={styles.modal__text__container__inner}>
                            <div>
                                <p>Title: {itemToSell.title}</p>
                                <p>Artist: {itemToSell.artist_display}</p>
                                <p>Medium: {itemToSell.medium_display}</p>
                                <p>Category: {itemToSell.category_titles.map((category, index) => `${category}${index + 1 < itemToSell.category_titles.length ? ", " : ""}`)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>          
                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.form__input__container}>
                        <label>Set price</label>
                        <span>
                        €                
                        <input 
                            className={styles.form__input} 
                            type="value" value={price} 
                            disabled={loading} 
                            onChange={(e) => setPrice(e.target.value)} 
                            placeholder="enter amount here..." 
                            required
                        />
                        </span>
                    </div>
                    {loading ?
                        <div className={styles.submit__container}>
                            <button className={`${styles.button} ${styles.inactive}`}  type="button">
                                <div className={styles.button__inner__container}>
                                    <PuffLoader
                                        color={"#c29b40"}
                                        loading={loading}
                                        cssOverride={override}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            </button>
                        </div>
                        :
                        <div className={styles.submit__container}>
                            <button className={styles.button} type="submit">
                                <div className={styles.button__inner__container}>
                                    CREATE LISTING
                                </div>
                            </button>
                        </div>
                    }
                </form>
                {error && <ErrorMessage />}
        </div>
    </div>
  )
}

export default SellItemModal