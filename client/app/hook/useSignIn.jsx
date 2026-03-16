/*
    does the error handling for signin from the backend
    adjusts the payload
    gives back use states for frontend to know whats going on

    Exports:
    totalFailure - this will be set to true whenever a total unexpected failure occurs. hopefully this doesnt happen like ever

    signUpFail - this has multiple modes. check down in the cases to see what each number means. -1 means no fail

    signUpPass - set to true when sign up is successful

    Imports:
        useState

        useAuthContext - allows to change payload

        api - allows us to do easier axios requests without having to type out entire IP
*/


import {useState} from 'react'
import { useAuthContext } from './useAuthContext'
import api from '../../api.js'

export const useSignin = () => {
    const {dispatch} = useAuthContext()
    const [totalFailure, setTotalFailure] = useState(false);
    const [signUpFail, setSignUpFail] = useState(-1)
    const [signUpPass, setSignUpPass] = useState(false)


    const signup = async (userName, password) =>{

        try {
            const response = await api.post("/api/signup", {
                userName,
                password
            })


            const json = response.data

            
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({type: "LOGIN", payload: json})

            console.log(json)

            setSignUpPass(true)
            setSignUpFail(-1)
            setTotalFailure(false)


                //what can follow in here is what you want to happen after an ok response. assuming it reaches this
                //comment it should be added to db fine
        } catch (error) {

            if(!error){
                console.error("Other error: ", error.message)
                setTotalFailure(true)
            }

            switch(error.response.data.code){
                //missing fields, user exists, bad username, bad password
                case "MISSING_FIELDS":
                    setSignUpFail(1)
                    break
                
                case "USER_EXISTS":
                    setSignUpFail(2)
                    break

                case "BAD_USERNAME":
                    setSignUpFail(3)
                    break
                
                case "BAD_PASSWORD": 
                    setSignUpFail(4)
                    break
                
                default:
                    setSignUpFail(0)
                    break
            }
        }
    }
    return {signup, signUpFail, totalFailure, signUpPass}
}


export default useSignin