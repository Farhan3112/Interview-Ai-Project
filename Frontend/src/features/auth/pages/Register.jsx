import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'


const Register = () => {

    const {
        loading,
        handleRegister
    } = useAuth()

    const navigate = useNavigate()


    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')


    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')


        const success = await handleRegister({
            username,
            email,
            password
        })


        if (success) {
            navigate('/')
        } else {
            setError('Registration failed')
        }
    }


    if (loading) {
        return (
            <main>
                <h1>Loading.......</h1>
            </main>
        )
    }


    return (
        <main>

            <div className="form-container">

                <h1>Register</h1>


                {error && (
                    <p>{error}</p>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>

                </form>


                <p>
                    Already have an account?

                    {' '}

                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </main>
    )
}


export default Register