import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/Auction.module.css'
import axios from 'axios'
import CountdownTimer from '../components/auctions/CountdownTimer'

const Auction = () => {

    const navigate = useNavigate()
    const { state } = useLocation();

    const [artworks, setArtworks] = useState()
    const [image, setImage] = useState(true)


    // navigate to homepage when there is no artwork data
    useEffect(() => {
        if (!state) {
            navigate('/')
        }
    }, [])

    if (state === null) {
        return null
    } 

    console.log(state)
    const auction = state.auction
    const endDate = state.ttl.toString().slice(4, 30)
    console.log(state.ttl.toString())

    const getArtworks = async () => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const artworkIDArray = state.auction.artwork_ids.$values
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
        
            const artworkAPIRes = await axios.get(url, config)
            setArtworks(artworkAPIRes.data.data)            
        } catch (error) {
            throw error
        }

    }

    useEffect(() => {
        getArtworks()
    }, [state])
    




  return (
    <div className={styles.auction__container}>
        <div className={styles.auction__image__container}>
            {image ?
                <img className={styles.auction__image}
                    src={auction.image_url} alt={auction.title}
                    onError={() => setImage(false)}  
                />
            :
                <div className={styles.auction__image__error}>
                    <h3>Image not available</h3>
                </div>
            }
        </div>
        <div className={styles.auction__content__container__outer}>
            <div className={styles.auction__content__container__inner}>
                <div>
                    <h1>{auction.title}</h1>                   
                </div>  
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}><CountdownTimer expirationTime={state.ttl} actionOnEnd={() => navigate('/')}/> Until Lots Begin Closing</div>
                <p>{endDate} BRUSSELS</p>
                <p>Lots close independently at one-minute intervals; closure times are subject to change </p>    
            </div>
        </div>
    </div>
  )
}

export default Auction