import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { GlobalContext } from '../GlobalState'
import PrivateSaleItem from '../components/PrivateSaleItem'
import styles from '../styles/PrivateSales.module.css'

const PrivateSales = () => {

    const [salesData, setSalesData] = useState()

    const { user } = useContext(GlobalContext)

    useEffect(() => {
        getSales()
    }, [])
    
    const getSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
         
            const res = await axios.get("api/sales", config)
            
            console.log(res.data)
                                                                                                                                                             
            const artworkIDArray = res.data.$values.map(artwork => artwork.api_id)
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
         
            const artworkAPIRes = await axios.get(url, config)

            console.log(artworkAPIRes.data)

            const data = res.data.$values.map(data => ({...artworkAPIRes.data.data.find(artwork => artwork.id === data.api_id), ...data}))
            setSalesData(data)
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className={styles.privatesales__container__outer}>
        {salesData && salesData.map(sale => {
            if (user) {
                if (sale.user_id !== user.id) {
                    return <PrivateSaleItem data={sale} />
                }
            } else {
                return <PrivateSaleItem data={sale} />
            }
        })}
    </div>
  )
}

export default PrivateSales