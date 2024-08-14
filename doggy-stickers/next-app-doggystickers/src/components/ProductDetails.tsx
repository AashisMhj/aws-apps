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
  const [variantPrice, setVariantPrice] = useState(productData.attributes.variant[0].price)

  return (
    <div className="flex flex-col justify-between h-full w-full md:w-1/2 max-w-xs mx-auto space-y-4 min-h-128">
      <BackToProductButton />
      <ProductInfo 
        title={productData.attributes.variant[0].type}
        description={productData.attributes.short_description}
        price={variantPrice}
      />
      <ProductForm 
        title={productData.attributes.title}
        slug={productData.attributes.slug}
        variants={productData.attributes.variant} 
        mainImg={productData.attributes.main_image.data}
        setVariantPrice={setVariantPrice}
      />
    </div>
  )
}

export default ProductDetails
