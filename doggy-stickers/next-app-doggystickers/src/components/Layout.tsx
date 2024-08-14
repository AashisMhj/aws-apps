import { CartProvider } from "@/context/Cart.context";
import Footer from "./Footer";
import { PropsWithChildren } from "react";
import Nav from "./Nav";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <CartProvider>
            <div className="flex flex-col justify-between min-h-screen">
                <Nav />

                <main>
                    {children}
                </main>

                <Footer />
            </div>
        </CartProvider>
    )
}