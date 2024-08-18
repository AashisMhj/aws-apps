'use client'
import { VariantType } from "@/types";
import { createContext, useContext, useState, useEffect, PropsWithChildren, useCallback } from "react";

type CartItemType = {product_id:number, selected_variant:number, quantity:number};

type CartContextType = {
    items: CartItemType[],
    addToCart: (product_id:number, selected_variant:number, quantity:number) => void,
    clearItems: ()=> void,
    removeItem: (remove_index:number)=> void
}

export const CartContext = createContext<CartContextType>({items: [], addToCart: ()=> null, clearItems: ()=> null, removeItem: ()=> null});
export const useCartContext = ()=>{
    return useContext(CartContext);
}

export function CartProvider({children}:PropsWithChildren){
    const [cart_items, setCartItems] = useState<CartItemType[]>([])

    const addToCart = useCallback((product_id:number, selected_variant:number, quantity:number)=>{
        const temp = [...cart_items];
        temp.push({product_id, selected_variant, quantity})
        setCartItems(temp);
    }, [cart_items]);

    const clearItems = useCallback(()=>{
        setCartItems([]);
    }, []);

    const removeItem = useCallback((remove_index:number)=>{
        const temp = [...cart_items];
        temp.splice(remove_index, 1)
        setCartItems(temp);
    }, [cart_items])

    return (
        <CartContext.Provider value={{items: cart_items, addToCart, clearItems, removeItem}}>
            {children}
        </CartContext.Provider>
    )
}
