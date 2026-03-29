/*
    This is essentially same structure as useSignIn
    handles errors for the frontend changes some states to determine what to display in frontend

    Exports:
    doLogin - this is what does all the error handling and request to the express backend

    loginFail - this has multiple different values it could be. each determining what case. check below for more

    loginPass - this is boolean. if true then login success, if false then login either hasnt occurred or was never a success. look to loginfail for more

    totalFailure - this is boolean and is only here if something unexpected occurrs. 

    Import:
    useState

    useAuthContext - allows to change payload

    api - allows us to do easier axios requests without having to type out entire IP
*/

import {useState} from 'react'
import { useAuthContext } from './useAuthContext'
import api from '../../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const {dispatch} = useAuthContext()
    const [loginFail, setLoginFail] = useState(-1)
    const [loginPass, setLoginPass] = useState(false)
    const [totalFailure, setTotalFailure] = useState(false)


    const doLogin = async (userName, password) => {
        try {
            const response = await api.post('/api/login', {
                userName,
                password
            })

            const json = response.data 

            await AsyncStorage.setItem('user', JSON.stringify(json))

            dispatch({type: "LOGIN", payload: json})
            setLoginFail(-1)
            setTotalFailure(false)
            setLoginPass(true)
            return true;

        } catch (error) {
            if (!error.response) {
                console.error("Network error: ", error.message)
                setTotalFailure(true)
            }

            switch(error.response.data.code){
                case "MISSING_FIELDS":
                    setLoginFail(1)
                    return false;
                
                case "WRONG_USERNAME":
                    setLoginFail(2)
                    return false;

                case "WRONG_PASSWORD":
                    setLoginFail(3)
                    return false;
                
                default:
                    setLoginFail(0)
                    return false;
            }
        }
    }

    return {doLogin, totalFailure, loginFail, loginPass}
}

export default useLogin