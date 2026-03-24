/*
    requests are weird with react-native. cant just use http://localhost<port>. Instead need to use own laptops IP. 
    this makes it that whenever you do await api.get('/api/...) it does the whole http://ip thing. also you dont even need to type axios
    whenever you would put axios just use api.

    To get the API_URL check example.env. I can not give you this one.
*/

import axios from 'axios'

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
})

export default api