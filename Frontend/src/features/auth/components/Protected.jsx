import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Protected = ({ children }) => {

    const {
        loading,
        user
    } = useAuth()


    // Still checking authentication
    if (loading) {
        return (
            <main>
                <h1>Loading.......</h1>
            </main>
        )
    }


    // Authentication check finished
    // but no user exists
    if (!user) {
        return <Navigate to="/login" replace />
    }


    // User is authenticated
    return children
}


export default Protected