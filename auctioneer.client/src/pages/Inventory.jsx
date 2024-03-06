import React, { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../GlobalState'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Inventory.module.css'
import axios from 'axios'
import PuffLoader from "react-spinners/PuffLoader";
import SellItemModal from '../components/SellItemModal'

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Inventory = () => {


    const [inventoryData, setInventoryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [saleModalActive, setSaleModalActive] = useState(false)
    const [itemToSell, setItemToSell] = useState()
    const { user } = useContext(GlobalContext)



    const getInventoryData = async() => {

        const artworkIDArray = user.artworks.$values.map(artwork => artwork.api_id)

        // if user owns no artworks, dont fetch
        if (artworkIDArray.length > 0) {
            
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
        
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
             
                const res = await axios.get(url, config)
                setInventoryData(res.data.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        } 
    }

    const sellItem = (item) => {
        setItemToSell(item)
        setSaleModalActive(true)
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
                            <div className={styles.inventory__item__button__container}> 
                                <button className={styles.button__link} onClick={() => navigateToArtwork()}>DETAILS</button>
                                {/* <button onClick={() => sellItem({api_id: item.id, price: 499})}>SELL</button> */}
                                <button className={styles.button} onClick={() => sellItem(item)}>SELL</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div>
        <h1 className={styles.page__header}>My Inventory</h1>
        {loading ?
            <div className={styles.loading__container}>
                <PuffLoader
                    color={"#c29b40"}
                    loading={loading}
                    cssOverride={override}
                    size={140}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        :
            <div className={styles.inventory__items__container__outer}>
                <div className={styles.inventory__items__container__inner}>
                {inventoryData.length > 0 ?
                    inventoryData.map((artwork, index) => <Artwork item={artwork} key={index} index={index}/>)
                :
                    <div>No items in inventory</div>
                }
                
                </div>
            </div>
        }
        {saleModalActive && 
            <SellItemModal setSaleModalActive={setSaleModalActive} itemToSell={itemToSell}/>
        }
    </div>
  )
}

export default Inventory