import React, { useState, useEffect } from 'react'

const CountdownTimer = ({ expirationTime, actionOnEnd }) => {

    const [countdownTimer, setCountdownTimer] = useState()
      
    useEffect(() => {
        const interval = setInterval(() => {
        getReturnValues(expirationTime - new Date().getTime())
        }, 1000);
    
        return () => clearInterval(interval);
    }, [expirationTime]);

    const getReturnValues = (countDown) => {
       
        // calculate time left
        let minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        if (minutes < 0 && seconds < 0) {
            minutes = 0
            seconds = 0
            actionOnEnd()
        }
      
        setCountdownTimer([minutes, seconds]);
    };

  return (
    <p style={{ minWidth: '4rem', margin: '0'}}>
        {countdownTimer ? 
            <>{countdownTimer[0] > 9 ? countdownTimer[0] : `0${countdownTimer[0]}`}:{countdownTimer[1] > 9 ? countdownTimer[1] : `0${countdownTimer[1]}`}</>
        :
            <></>
        }
    </p>
  )
}

export default CountdownTimer