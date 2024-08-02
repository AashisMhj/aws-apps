import { createContext, ReactNode, useContext, useState } from "react"
import AppToast from "../components/appToast/AppToast";

export type ToastContextType = {
    toast_content: ReactNode | null,
    setToastContent: (new_content:ReactNode | null) => void
}


export const ToastContext = createContext<ToastContextType>({
    toast_content: null,
    setToastContent: ()=>null
});

export function useToastContext(){
    return useContext(ToastContext);
}

export const ToastProvider = ({children}:{children:ReactNode})=>{
    const [toast_content, setToastContent] = useState<ReactNode | null>(null);

    return <ToastContext.Provider value={{setToastContent, toast_content}}>
        {children}
        <AppToast content={toast_content} setContent={setToastContent} />
    </ToastContext.Provider>
}