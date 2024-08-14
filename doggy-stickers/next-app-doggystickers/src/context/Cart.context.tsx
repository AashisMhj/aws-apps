'use client'
import { createContext, useContext, useState, useEffect, PropsWithChildren, useCallback } from "react";

type CartItemType = {id: string, quantity:number};

type CartContextType = {
    items: CartItemType[],
    addToCart: (id:number, quantity:number) => void
}

export const CartContext = createContext<CartContextType>({items: [], addToCart: ()=> null});
export const useCartContext = ()=>{
    return useContext(CartContext);
}

export function CartProvider({children}:PropsWithChildren){
    const [cart_items, setCartItems] = useState<CartItemType[]>([])

    useEffect(()=>{
        // TODO get cart items
    }, []);

    const addToCart = useCallback((id:number, quantity:number)=>{
        // logic to update Cart Items
    }, []);

    return (
        <CartContext.Provider value={{items: cart_items, addToCart}}>
            {children}
        </CartContext.Provider>
    )
}
