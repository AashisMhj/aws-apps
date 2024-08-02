import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//
import { useAuthContext } from "../context/Auth.context";
import AppHeader from "../components/appHeader/AppHeader";
import { Container } from "@mui/material";


export default function PrivateLayout({ children }: { children: ReactNode }) {
    const { is_logged_in, is_auth_loading } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(is_auth_loading) return;
        if (!is_logged_in) navigate('/login');
    }, [is_logged_in, navigate, is_auth_loading])
    if (!is_logged_in || is_auth_loading) return <></>
    return <div>
        <AppHeader />
        <Container>
            {children}
        </Container>
    </div>
}