import React, { useContext, useEffect } from 'react'
import { Checkmark } from 'react-checkmark'
import { GlobalContext } from '../../GlobalState'

const Success = () => {

  const { setAuthenticationWindow } = useContext(GlobalContext)

  useEffect(() => {
    setTimeout(() => {
      setAuthenticationWindow('none')
    }, 3000);
  }, [])
  
  return (
    <Checkmark size='124px' color='#c29b40'/>
  )
}

export default Success