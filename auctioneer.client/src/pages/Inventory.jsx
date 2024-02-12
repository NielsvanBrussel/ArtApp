import React, { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../GlobalState'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Inventory.module.css'
import axios from 'axios'

const Inventory = () => {


    const [inventoryData, setInventoryData] = useState([])
    const { user, setUser } = useContext(GlobalContext)


    const sellItem = async ({price, api_id}) => {
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
                api_id: api_id
            }

            const res = await axios.post("api/sales", data, config)
            if (!res.data.error) {
                setUser(res.data.user)
            }
            console.log(res)
            
        } catch (error) {
            console.log(error)
        }
    }

    const getInventoryData = async() => {

        const artworkIDArray = user.artworks.$values.map(artwork => artwork.api_id)


        // if user owns no artworks, dont fetch
        if (artworkIDArray.length > 0) {
            
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
    
            console.log(url)
    
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
             
                const res = await axios.get(url, config)
                setInventoryData(res.data.data)
            } catch (error) {
                console.log(error)
            }
        } 
    }

    useEffect(() => {
        getInventoryData()
    }, [user])
    
    
    useEffect(() => {
       console.log(inventoryData)
    }, [inventoryData])


    const Artwork = ({ item, index }) => {

        const navigate = useNavigate()

        const url = `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        // console.log('rerendering')
        const [image, setImage] = useState(true)

        const navigateToArtwork = () => {
            navigate('/artwork', { state: {artwork: item, price: 2000}})
        }


        return (
            <div className={styles.inventory__item__container__outer}>
                <div className={styles.inventory__item__container__inner}>
                    <div className={styles.inventory__item__image__container}>
                    {image ?
                        <img className={styles.inventory__item__image}
                            src={url} alt={item.title}
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
                                <h4>{item.title}</h4>
                                <p>{item.artist_display}</p>
                            </div>
                            <button onClick={() => navigateToArtwork()}>DETAILS</button>
                            <button onClick={() => sellItem({api_id: item.id, price: 499})}>sell</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div>
        <h1>Inventory</h1>
        <div className={styles.inventory__items__container__outer}>
            <div className={styles.inventory__items__container__inner}>
                {inventoryData.length > 0 && inventoryData.map((artwork, index) => <Artwork item={artwork} key={index} />)}
            </div>
        </div>
    </div>
  )
}

export default Inventory