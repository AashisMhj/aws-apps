import ProductCard from '@/components/ProductCard'
import { ProductType } from '@/types'

type ProductListingsProps = {
    products: ProductType[]
}

function ProductListings({ products }:ProductListingsProps) {
  if(products.length == 0) return <div className='text-5xl flex justify-center items-center text-yellow-600 py-10'>No Product</div>
  return (
    <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
      {
        products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
      }
    </div>
  )
}

export default ProductListings
