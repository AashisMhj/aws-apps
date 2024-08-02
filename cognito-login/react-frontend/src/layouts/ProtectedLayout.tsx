import { ReactNode, useEffect } from "react";
import { useAuthContext } from "../context/Auth.context";
import { useNavigate } from "react-router-dom";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { is_logged_in } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (is_logged_in) navigate('/')
    }, [is_logged_in, navigate])
    if (is_logged_in) return <></>
    return <div>
        {children}
    </div>
}