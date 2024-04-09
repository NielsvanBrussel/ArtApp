import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import styles from '../../styles/Auctions.module.css'
import ActiveAuction from './ActiveAuction'
import UpcomingAuction from './UpcomingAuction'

const Auctions = () => {
    const [activeAuction, setActiveAuction] = useState()
    const [upComingAuctions, setUpcomingAuctions] = useState([])
    const [expirationTime, setExpirationTime] = useState(0)

    useEffect(() => {
        getAuctionData()
    }, [])

    const getAuctionData = useCallback(async () => {
    
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
         
            const res = await axios.get("api/exhibition", config)
            console.log(res)
    
            if (res.status === 200) {
                let expirationDate = new Date()
                expirationDate.setSeconds(expirationDate.getSeconds() + res.data.ttl)
                setExpirationTime(expirationDate)
                setActiveAuction(res.data.exhibitions.$values[0])
                const x = res.data.exhibitions.$values.slice(1)
                setUpcomingAuctions(x)
            }

        } catch (error) {
            console.log(error)
        }

    }, [])

  return (
    <div className={styles.main__container}>
        <div className={styles.item__header__container}> 
            <h1 className={styles.item__header}>Current Auction</h1>
            <div className={styles.item__header__underline}></div>
        </div>
        {activeAuction?
            <ActiveAuction data={activeAuction} expirationTime={expirationTime} getAuctionData={getAuctionData}/>
        :
            <div>loading...</div>
        }
        <div className={styles.item__header__container}> 
            <h1 className={styles.item__header}>Upcoming Auctions</h1>
            <div className={styles.item__header__underline}></div>
        </div>
        <div className={styles.future__auctions__container}>
            {upComingAuctions.length > 0 && upComingAuctions.map((item, index) => <UpcomingAuction key={index} data={item}/>)}
        </div>
    </div>
  )
}

export default Auctions