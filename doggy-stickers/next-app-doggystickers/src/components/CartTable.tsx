'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons'
//
import { useCartContext } from '@/context/Cart.context'
import Price from '@/components/Price'
import Image from 'next/image'
import { ProductType } from '@/types'
import { getProducts } from '@/lib/api'
import { imageResolver } from '@/helper'
import CheckOutButton from './CheckOutButton'
// import { getCartSubTotal } from '@/utils/helper'


function CartTable({ products }: { products: ProductType[] }) {
  const { addToCart, items: cart_items, clearItems, removeItem } = useCartContext();
  const [items, setItems] = useState<{ data: ProductType, selected_variant: number, quantity: number }[]>([])
  const [total, setTotal] = useState(0);

  function checkout(){
    // TODO implement checkout
  }

  useEffect(() => {
    const temp_items: { data: ProductType, selected_variant: number, quantity: number }[] = [];
    let cost = 0;
    cart_items.forEach((item) => {
      const data = products.find(el => el.id === item.product_id);
      if (!data) return;
      temp_items.push({
        data,
        selected_variant: item.selected_variant,
        quantity: item.quantity
      });
      cost = cost + (data.attributes.variant[item.selected_variant].price * item.quantity);
    });
    setItems(temp_items);
    setTotal(cost);
  }, [cart_items, products])


  return (
    <div className="min-h-80 max-w-3xl my-4 sm:my-8 mx-auto w-full">
      <table className="mx-auto">
        <thead>
          <tr className="uppercase text-xs sm:text-sm text-palette-primary border-b border-palette-light">
            <th className="font-primary font-normal px-6 py-4">Product</th>
            <th className="font-primary font-normal px-6 py-4">Quantity</th>
            <th className="font-primary font-normal px-6 py-4 hidden sm:table-cell">Price</th>
            <th className="font-primary font-normal px-6 py-4 hidden sm:table-cell">Amount</th>
            <th className="font-primary font-normal px-6 py-4">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-palette-lighter">
          {items.map((item, index) => (
            <tr key={`${item.data.id}-${index}`} className="text-sm sm:text-base text-gray-600 text-center">
              <td className="font-primary font-medium px-4 sm:px-6 py-4 flex items-center">
                <Image
                  src={imageResolver(item.data.attributes.main_image.data)}
                  alt={item.data.attributes.main_image.data.attributes.alternativeText || ''}
                  height={64}
                  width={64}
                  className={`hidden sm:inline-flex`}
                />
                <Link passHref href={`/products/${item.data.attributes.slug}`}>
                  <div className="pt-1 hover:text-palette-dark">
                    {item.data.attributes.title}, {item.data.attributes.variant[item.selected_variant]?.type}
                  </div>
                </Link>
              </td>
              <td className="font-primary font-medium px-4 sm:px-6 py-4">
                <input
                  type="number"
                  inputMode="numeric"
                  id="variant-quantity"
                  name="variant-quantity"
                  min="1"
                  step="1"
                  disabled
                  value={item.quantity}
                  // onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                  className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                />
              </td>
              <td className="font-primary text-base font-light px-4 sm:px-6 py-4 hidden sm:table-cell">
                <Price
                  currency="$"
                  num={item.data.attributes.variant[item.selected_variant]?.price}
                  numSize="text-lg"
                />
              </td>
              <td className="font-primary text-base font-light px-4 sm:px-6 py-4 hidden sm:table-cell">
                <Price
                  currency="$"
                  num={item.data.attributes.variant[item.selected_variant]?.price * item.quantity}
                  numSize="text-lg"
                />
              </td>
              <td className="font-primary font-medium px-4 sm:px-6 py-4">
                <button
                  aria-label="delete-item"
                  className=""
                  onClick={() => removeItem(index)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-8 h-8 text-palette-primary border border-palette-primary p-1 hover:bg-palette-lighter" />
                </button>
              </td>
            </tr>
          ))}
          <tr className="text-center">
            <td></td>
            <td className="font-primary text-base text-gray-600 font-semibold uppercase px-4 sm:px-6 py-4">Subtotal</td>
            <td className="font-primary text-lg text-palette-primary font-medium px-4 sm:px-6 py-4">
              <Price
                currency="$"
                num={total}
                numSize="text-xl"
              />
            </td>
            <td></td>
          </tr>
          {
            <tr>
              <td></td>
              <td className='' colSpan={3}>
                <button
                  className="pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex justify-center items-baseline  hover:bg-palette-dark"
                  aria-label="cart-button"
                  onClick={checkout}
                >
                  CheckOut
                  <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
                </button>
              </td>
              <td></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default CartTable
