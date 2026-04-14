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


import {createContext, useReducer, useEffect, useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext()

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                loading: false}
        case 'LOGOUT': 
            return {
                ...state,
                user: null, 
                loading: false}
        case 'RESTORE_USER':
            return{
                ...state,
                user: action.payload,
                loading: false
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true
    })

    // check if user is logged in on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await AsyncStorage.getItem('user')
                if (stored) {
                    dispatch({type: 'RESTORE_USER', payload: JSON.parse(stored)})
                } else {
                    dispatch ({
                        type: 'RESTORE_USER',
                        payload: null
                    })
                }
            } catch (error) {
                console.error("Failed to load user from storage: ", error)
                dispatch({
                    type: "RESTORE_USER",
                    payload: null
                })
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

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};
