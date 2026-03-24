/*
    This file is meant to allow the authentication be understood by every component in the application
    Essentially its passing the prop of authentication without using props

    Exports:
    AuthContext - Allows other files to call {user, dispatch} = useContext(AuthContext);
    

    authReducer - called when dispatch tries to change user. updates user for all components thanks to useContext

    AuthContextProvider - the component that wraps the entire app (in _layout.jsx) so everything actually has the context.
    Also provides the auth state and dispatch function
    user is just user data and dispatch would call authReducer to update any 
    user data that needs to be updated

    Import:
    createContext

    useReducer
*/


import {createContext, useReducer, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext()


export const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return {user: action.payload}
        case 'LOGOUT': 
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // check if user is logged in on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem('user')
                if (stored) {
                    dispatch({type: 'LOGIN', payload: JSON.parse(stored)})
                }
            } catch (error) {
                console.error("Failed to load user from storage: ", error)
            } 
        }

        loadUser()
    }, [])

    console.log("current auth state: ", state)

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}