import { createContext, useEffect, useState } from 'react'
import { getMe } from './services/auth.api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    // true when we are checking the existing login session
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const getAndSetUser = async () => {

            try {
                const data = await getMe()

                setUser(data.user)

            } catch (error) {

                // 401 means user is not logged in
                setUser(null)

            } finally {

                // Authentication check is finished
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}