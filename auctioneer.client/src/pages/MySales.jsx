import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '../styles/PrivateSales.module.css'
import PrivateSaleItem from '../components/PrivateSaleItem'
import PuffLoader from "react-spinners/PuffLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const MySales = () => {

    const [salesData, setSalesData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSales()
    }, [])
    
    const getSales = async () => {

        setLoading(true)
        try {

          const JWT = localStorage.getItem('JWT')

          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${JWT}`
              },
          }

         
            const res = await axios.get("api/sales/user", config) 
                                                                                                                                                                                     
            const artworkIDArray = res.data.$values.map(artwork => artwork.api_id)
            const url = `https://api.artic.edu/api/v1/artworks?ids=${artworkIDArray.join()}&fields=id,title,date_display,artist_display,artwork_type_title,category_titles,image_id,medium_display,term_titles`
         
            const artworkAPIRes = await axios.get(url, config)

            const data = res.data.$values.map(data => ({...artworkAPIRes.data.data.find(artwork => artwork.id === data.api_id), ...data}))
            setSalesData(data)
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div>
      <h1 className={styles.page__header}>My Sales</h1>
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
        <div className={styles.privatesales__container__outer}>
          <div className={styles.privatesales__container__inner}>
            {salesData.length > 0 ? 
             salesData.map(sale => <PrivateSaleItem data={sale} key={sale.api_id} getSales={getSales}/>)
            :
            <div>
              <p className={styles.blue__font}>You are not selling any items at the moment.</p>
            </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default MySales