import React, { useMemo, useState } from 'react'
import styles from '../styles/Carousel.module.css'
import { useNavigate } from 'react-router-dom'

const CarouselItem = ({item}) => {

    const navigate = useNavigate()

    const url = `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
    // console.log('rerendering')
    const [image, setImage] = useState(true)

    const position = useMemo(() => {return Math.random() >= 0.5 ? true : false} , []) 

    const navigateToArtwork = () => {
        navigate('/artwork', { state: {artwork: item, price: 2000}})
    }

    return(
        <div className={styles.slide__container}>
            <div className={styles.slide__image__container}>
                {image ?
                    <img className={styles.slide__image}
                        src={url} alt={item.title}
                        onError={() => setImage(false)}  
                    />

                :
                    <div className={styles.slide__image__error}>
                        <h3>Image not available</h3>
                    </div>
                }
            </div>
            <div className={position ? styles.slide__text__container__outer__left : styles.slide__text__container__outer__right}>
                <div className={styles.slide__text__container__inner}>
                    <h4>{item.title}</h4>
                    <p>{item.artist_display}</p>
                    <button onClick={() => navigateToArtwork()}>DISCOVER</button>
                </div>
            </div>
        </div>
    )
}

export default CarouselItem