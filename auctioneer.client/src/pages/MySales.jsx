import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '../styles/PrivateSales.module.css'
import PrivateSaleItem from '../components/PrivateSaleItem'

const MySales = () => {

    const [salesData, setSalesData] = useState()

    useEffect(() => {
        getSales()
    }, [])
    
    const getSales = async () => {
        try {

          const JWT = localStorage.getItem('JWT')

          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${JWT}`
              },
          }

         
            const res = await axios.get("api/sales/user", config) 
            
            console.log(res)
                                                                                                                                                                         
            const artworkIDArray = res.data.$values.map(artwork => artwork.api_id)
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
         
            const artworkAPIRes = await axios.get(url, config)

            const data = res.data.$values.map(data => ({...artworkAPIRes.data.data.find(artwork => artwork.id === data.api_id), ...data}))
            setSalesData(data)
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className={styles.privatesales__container__outer}>
      {salesData && salesData.map(sale => <PrivateSaleItem data={sale} />)}
    </div>
  )
}

export default MySales