'use client'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCartContext } from '@/context/Cart.context'
import { ImageType, ProductType, VariantType } from '@/types'

type ProductFormType = {
  slug: string,
  product_id: number
  variants: VariantType[],
  selected_variant_index: number,
  setSelectedVariantIndex: (new_index: number) => void
  mainImg: ImageType
}

export default function ProductForm({ variants, product_id, selected_variant_index, setSelectedVariantIndex }: ProductFormType) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCartContext()
  const isLoading = false;

  const atcBtnStyle = isLoading ?
    `pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
                      justify-center items-baseline  hover:bg-palette-dark opacity-25 cursor-none`
    :
    `pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
                      justify-center items-baseline  hover:bg-palette-dark`

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    const variant_index = parseInt(e.target.value);
    setSelectedVariantIndex(variant_index);
  }

  async function handleAddToCart() {
    addToCart(product_id, selected_variant_index, quantity);
  }


  return (
    <div className="w-full">
      <div className="flex justify-start space-x-2 w-full">
        <div className="flex flex-col items-start space-y-1 flex-grow-0">
          <label className="text-gray-500 text-base">Qty.</label>
          <input
            type="number"
            inputMode="numeric"
            id="quantity"
            name="quantity"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => {
              const parsedInt = parseInt(event.target.value);
              if (isNaN(parsedInt)) setQuantity(1)
              else setQuantity(parsedInt)
            }}
            className="text-gray-900 form-input border border-gray-300 w-20 rounded-sm focus:border-palette-light focus:ring-palette-light"
          />
        </div>
        <div className="flex flex-col items-start space-y-1 flex-grow">
          <label className="text-gray-500 text-base">Size</label>
          <select
            id="size-selector"
            name="size-selector"
            onChange={handleVariantChange}
            value={selected_variant_index}
            className="form-select border border-gray-300 rounded-sm w-full text-gray-900 focus:border-palette-light focus:ring-palette-light"
          >
            {
              variants.map((item, index) => (
                <option
                  id={item.id + ''}
                  key={item.id}
                  value={index}
                >
                  {item.type.replace('variant', '')} (price: {item.price})
                </option>
              ))
            }
          </select>
        </div>
      </div>

      <button
        className={atcBtnStyle}
        aria-label="cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
        <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
      </button>
      <div className='my-2 text-xl text-center'>
        {
          variants[selected_variant_index] && <span>
            {
              `Total:  ${variants[selected_variant_index].price * quantity} `
            }
          </span>

        }
      </div>
    </div>
  )
}

