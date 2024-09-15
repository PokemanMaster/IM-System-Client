import {useRoutes} from "react-router-dom"
import router from "./router";
import React from 'react'


export default function App() {
    const tourist = useRoutes(router)
    return (
        <>
            {tourist}
        </>
    )
}


