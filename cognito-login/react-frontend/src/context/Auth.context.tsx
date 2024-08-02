import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
//

export type AuthContextType = {
    is_logged_in: boolean,
    is_auth_loading: boolean,
    checkLogin: () => void,
    loginUser: (accessToken:string, refreshToken:string, idToken: string | null)=> void
    logout: ()=>void
}

export const AuthContext = createContext<AuthContextType>({
    is_logged_in: false,
    is_auth_loading: false,
    checkLogin: ()=> null,
    loginUser: () => null,
    logout: ()=>null
});

export function useAuthContext(){
    return useContext(AuthContext);
}

function checkLogin(){
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if(accessToken && refreshToken) return true;
    else return false;
}

function removeTokens(){
    localStorage.clear();
}

export function getTokens(){
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    const idToken = localStorage.getItem('id-token')

    if(accessToken && refreshToken) return {accessToken, refreshToken, idToken};
    return null;

}

export function setTokens(accessToken: string, refreshToken:string | null, idToken: string|null){
    localStorage.setItem('access-token', accessToken);
    if(refreshToken) localStorage.setItem('refresh-token', refreshToken);
    if(idToken) localStorage.setItem('id-token', idToken);
}

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [is_logged_in, setIsLoggedIn] = useState(false);
    const [is_auth_loading, setIsAuthLoading] = useState(true);
    const loginUser = useCallback((accessToken:string, refreshToken:string, idToken:string|null)=>{
        setTokens(accessToken, refreshToken, idToken)
        setIsLoggedIn(true);
    }, []);
    const logout = useCallback(()=>{
        removeTokens();
        setIsLoggedIn(false);
    }, [])
    useEffect(()=>{
        setIsLoggedIn(checkLogin());
        setIsAuthLoading(false);
    }, [])
    return <AuthContext.Provider value={{is_logged_in, checkLogin, loginUser,logout, is_auth_loading}}>
        {children}
    </AuthContext.Provider>
}

