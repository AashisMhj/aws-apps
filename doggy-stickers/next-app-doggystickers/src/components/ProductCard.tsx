import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/Price'
import { ProductType } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductCardProps = {
    product: ProductType
}

export default function ProductCard({ product }:ProductCardProps) {
  const slug = product.attributes.slug;
  const title = product.attributes.title
  const description = product.attributes.short_description
  const price = product.attributes.variant[0].price

  return (
    <Link
      href={`/products/${slug}`}
      passHref
    >
      <div className="h-120 w-72 rounded shadow-lg mx-auto border border-palette-lighter">
        <div className="h-72 border-b-2 border-palette-lighter relative">
          <Image
            src={`${API_URL}${product.attributes.main_image.data.attributes.url}`}
            alt={product.attributes.main_image.data.attributes.alternativeText || title}
            layout="fill"
            className="transform duration-500 ease-in-out hover:scale-110"
          />
        </div>
        <div className="h-48 relative">
          <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
            {title}
          </div>
          <div className="text-lg text-gray-600 p-4 font-primary font-light">
            {description}
          </div>
          <div
            className="text-palette-dark font-primary font-medium text-base absolute bottom-0 right-0 mb-4 pl-8 pr-4 pb-1 pt-2 bg-palette-lighter 
            rounded-tl-sm triangle"
          >
            <Price
              currency="$"
              num={price}
              numSize="text-lg"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

