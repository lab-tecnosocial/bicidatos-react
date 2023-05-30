import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute=({
    isAllowed,
    redirectPath='/landing',
    children
})=>{
    if(!isAllowed){
        return <Navigate to={redirectPath} replace/>
    }
    return children?children: <Outlet/>;
}