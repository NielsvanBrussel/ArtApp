import React, { useState } from 'react'
import axios from 'axios'

const Test = () => {

    const JWT = localStorage.getItem('JWT')

    const [responseMsg, setResponseMsg] = useState("this is the response msg")



    const idk = async () => {

        try {
            console.log(JWT)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JWT}`
                },
            }
            const allo = "ricky"
            const res = await axios.post("api/test", allo, config)
            console.log(res)
            
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div style={{ border: 'black solid 4px', minHeight: '10rem'}}>
        <h3>test api</h3>
        <button onClick={() => idk()}>test</button>
        <p style={{ color: 'white'}}>{responseMsg}</p>
    </div>
  )
}

export default Test