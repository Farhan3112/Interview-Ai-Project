import { useContext } from 'react'
import { AuthContext } from '../auth.context'
import {
    login,
    register,
    logout
} from '../services/auth.api'


export const useAuth = () => {

    const context = useContext(AuthContext)


    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        )
    }


    const {
        user,
        setUser,
        loading,
        setLoading
    } = context


    // LOGIN
    const handleLogin = async ({ email, password }) => {

        setLoading(true)

        try {

            const data = await login({
                email,
                password
            })

            setUser(data.user)

            return true

        } catch (error) {

            console.log(error)

            return false

        } finally {

            setLoading(false)
        }
    }


    // REGISTER
    const handleRegister = async ({
        username,
        email,
        password
    }) => {

        setLoading(true)

        try {

            const data = await register({
                username,
                email,
                password
            })

            setUser(data.user)

            return true

        } catch (error) {

            console.log(error)

            return false

        } finally {

            setLoading(false)
        }
    }


    // LOGOUT
    const handleLogout = async () => {

        setLoading(true)

        try {

            await logout()

            setUser(null)

            return true

        } catch (error) {

            console.log(error)

            return false

        } finally {

            setLoading(false)
        }
    }


    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout
    }
}