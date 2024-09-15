import React, {lazy} from 'react';
import {Navigate} from "react-router-dom";
import LayoutView from "../layout";

const Friends = lazy(() => import("../views/Friends"));
const Group = lazy(() => import("../views/Group"));
const Personal = lazy(() => import("../views/Personal"));
const CreateGroup = lazy(() => import("../views/CreateGroup"));
const Login = lazy(() => import("../views/Login"));
const Register = lazy(() => import("../views/Register"));
const Chat = lazy(() => import("../views/Chat"))
const GChat = lazy(() => import("../views/GChat"))

// 懒加载组件加载时的 Loading 界面
const withLoadingComponent = (component) => (
    <React.Suspense fallback={<div>loading...</div>}>
        {component}
    </React.Suspense>
);

const router = [
    {
        path: "/",
        element: <Navigate to="/login"/>
    },
    {
        path: "/layout",
        element: <LayoutView/>,
        children: [
            {
                path: "friends",
                element: withLoadingComponent(<Friends/>)
            },
            {
                path: "group",
                element: withLoadingComponent(<Group/>)
            },
            {
                path: "personal",
                element: withLoadingComponent(<Personal/>)
            },
        ]
    },
    {
        path: "/chat",
        element: withLoadingComponent(<Chat/>)
    },
    {
        path: "/gchat",
        element: withLoadingComponent(<GChat/>)
    },
    {
        path: "creategroup",
        element: withLoadingComponent(<CreateGroup/>)
    },
    {
        path: "/register",
        element: withLoadingComponent(<Register/>)
    },
    {
        path: "/login",
        element: withLoadingComponent(<Login/>)
    },
    {
        path: "*",
        element: <Navigate to="/login"/>
    }
];


export default router;
