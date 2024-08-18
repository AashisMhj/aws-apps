'use client'
import { useState } from 'react'
import BackToProductButton from '@/components/BackToProductButton'
import ProductInfo from '@/components/ProductInfo'
import ProductForm from '@/components/ProductForm'
import { ProductType } from '@/types'

type ProductDetailsProps = {
    productData: ProductType
}

function ProductDetails({ productData }:ProductDetailsProps) {
  const [selected_variant_index, setSelectedVariantIndex] = useState(0)
  return (
    <div className="flex flex-col justify-between h-full w-full md:w-1/2 max-w-xs mx-auto space-y-4 min-h-128">
      <BackToProductButton />
      <ProductInfo 
        title={productData.attributes.title}
        description={productData.attributes.short_description}
        price={productData.attributes.variant[selected_variant_index]?.price}
      />
      <ProductForm 
        product_id={productData.id}
        slug={productData.attributes.slug}
        variants={productData.attributes.variant} 
        mainImg={productData.attributes.main_image.data}
        selected_variant_index={selected_variant_index}
        setSelectedVariantIndex={setSelectedVariantIndex}
      />
    </div>
  )
}

export default ProductDetails
