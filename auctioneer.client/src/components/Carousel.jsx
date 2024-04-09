import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import styles from '../styles/Carousel.module.css'
import CarouselItem from './CarouselItem'
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { PuffLoader } from 'react-spinners';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Carousel = () => {

    const [hourlySalesData, setHourlySalesData] = useState()
    const [carouselIndex, setCarouselIndex] = useState(0)
    const [ticking, setTicking] = useState(true)

    const carouselRef = useRef()


    useEffect(() => {
        getHourlySales()
    }, [])

    useEffect(() => {
        moveSlide()
    }, [carouselIndex])

    useEffect(() => {
        const timer = setTimeout(() => {
            ticking && hourlySalesData && changeIndex(1)}, 10000)
        return () => clearTimeout(timer)
    }, [ticking, hourlySalesData, carouselIndex]) 


    const moveSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.style.transform =  `translate3d(${carouselIndex * -100}%, 0, 0)`;
        }
    }
    

    const getHourlySales = useCallback(async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
         
            const res = await axios.get("api/hourlysales", config)
            const x = JSON.parse(res.data.data)
            setHourlySalesData(x.data)   
        } catch (error) {
            console.log(error)
        }
    }, [])

    const changeItem = (value) => {
        setTicking(false)
        changeIndex(value)
    }

    const changeIndex = (amount) => {
        let newIndex = carouselIndex + amount
        if (newIndex < 0) {
            newIndex = hourlySalesData.length - 1
        } else if (newIndex === hourlySalesData.length) {
            newIndex = 0
        }
        setCarouselIndex(newIndex)
    }  


  return (
    <div>
        <div className={styles.carousel__container__outer}>
            <div className={styles.carousel__container__inner} ref={carouselRef}>
                {hourlySalesData ? 
                    hourlySalesData.map((item, index) => {
                        return (
                            <CarouselItem key={index} item={item} />
                        )
                    })
                :   
                    <div className={styles.carousel__loader}>
                        <PuffLoader
                            color={"#c29b40"}
                            loading={true}
                            cssOverride={override}
                            size={140}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                }
            </div>
            {hourlySalesData && 
                <div className={styles.carousel__navigation__container}>
                    <GrFormPrevious className={styles.carousel__navigation__button} size={30} onClick={() => changeItem(-1)}/>
                    {hourlySalesData.map((item, index) => {
                        return (
                            <div key={index} className={index === carouselIndex ? styles.carousel__navigation__dot__filled : styles.carousel__navigation__dot__empty} onClick={() => setCarouselIndex(index)}></div>
                        )
                    })}
                    <GrFormNext className={styles.carousel__navigation__button} size={30} onClick={() => changeItem(1)}/>          
                </div>
            }
        </div>
    </div>
  )
}

export default Carousel