import React, { createContext, useState } from "react";



// init and create admin context

export const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
    
   
   const [authenticated, setAuthenticated] = useState(false)
   const [authenticationWindow, setAuthenticationWindow] = useState("none")
   const [user, setUser] = useState()


    const logout = () => {
        setAuthenticated(false)
        setUser("")
        localStorage.setItem("JWT", "")
    }

    return  <GlobalContext.Provider 
                value={{
                    authenticated: authenticated,
                    user: user,
                    authenticationWindow,
                    setAuthenticationWindow,
                    setUser,
                    setAuthenticated,
                    logout,
                }}
            >

                    {children} 

            </GlobalContext.Provider>

}