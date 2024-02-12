import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/Artwork.module.css'
import { GlobalContext } from '../GlobalState'
import axios from 'axios'

const Artwork = () => {

    

    const navigate = useNavigate()
    const { state } = useLocation();


    // navigate to homepage when there is no artwork data
    useEffect(() => {
        if (!state) {
            navigate('/')
        }
    }, [])

    if (state === null) {
        return null
    }

    const { authenticated, setAuthenticationWindow, user, setUser } = useContext(GlobalContext)
    const [image, setImage] = useState(true)
    const [ownsItem, setOwnsItem] = useState(false)



    const checkUserOwnsItem = () => {
        const itemfound = user?.artworks?.$values?.some(artwork => artwork.api_id === item.id)
        setOwnsItem(itemfound)
    }

    useEffect(() => {
        if (user) {
            checkUserOwnsItem()
        }
    }, [user])
    


    const item = state.artwork
    const price = state.price
    const url = `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`




    const buyItem = async () => {
        if (!authenticated) {
            setAuthenticationWindow("login")
        } else {
            try {

                const JWT = localStorage.getItem('JWT')
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JWT}`
                    },
                }
            
                const res = await axios.post("api/transaction/buynew", item.id, config)
                setUser(res.data.user)

                
            } catch (error) {
                console.log(error)
            }
        }
    }

    

  return (
    <div className={styles.artwork__container__outer}>
        <div className={styles.artwork__container__inner}>
            <div className={styles.artwork__image__container__outer}>
                <div className={styles.artwork__image__container__inner}>
                    {image ?
                        <img className={styles.artwork__image}
                            src={url} alt={item.title}
                            onError={() => setImage(false)}  
                        />
                    :
                        <div className={styles.artwork__image__error}>
                            <h3>Image not available</h3>
                        </div>
                    }
                </div>
            </div>
            <div className={styles.artwork__text__container__outer}>
                <div className={styles.artwork__text__container__inner}>
                    <div>
                        <div className={styles.flexbox}>
                            <p className={styles.category}>Title:</p>
                            <p>{item.title}</p>
                        </div>
                        <div className={styles.flexbox}>
                            <p className={styles.category}>Artist:</p>
                            <p>{item.artist_display}</p>
                        </div>
                        <div className={styles.flexbox}>
                            <p className={styles.category}>Date:</p>
                            <p>{item.date_display}</p>
                        </div>
                        <div className={styles.flexbox}>
                            <p className={styles.category}>Type:</p>
                            <p>{item.artwork_type_title}</p>
                        </div>
                        {item.category_titles.length &&
                            <div className={styles.flexbox}>
                                <p className={styles.category}>Category:</p>
                                <p>{item.category_titles.map((category, index) => `${category}${index + 1 < item.category_titles.length ? ", " : ""}`)}</p>
                            </div>
                        }
                        <div className={styles.flexbox}>
                            <p className={styles.category}>Medium:</p>
                            <p>{item.medium_display}</p>
                        </div>
                    </div>
                    { ownsItem &&
                        <div>
                            <h4>item in inventory</h4>
                        </div>
                    }
                    <div className={styles.sales__container}>
                        { ((authenticated && user.currency >= price && !ownsItem) || !authenticated) &&
                        <>
                            <div className={styles.flexbox}>
                                <p className={styles.category}>Price</p>
                                <p>€{price}</p>
                            </div>
                            <button onClick={() => buyItem()}>BUY</button>
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Artwork