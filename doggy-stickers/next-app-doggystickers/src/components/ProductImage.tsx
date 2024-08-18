'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { ImageType } from '@/types'
import { imageResolver } from '@/helper'

type ProductImageProps = {
  images: ImageType[],
  main_image: ImageType
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


function ProductImage({ images, main_image }: ProductImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [current_main_image, setCurrentMainImage] = useState(main_image);

  function scroll(scrollOffset: number) {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset
    }
  }

  return (
    <div className="w-full md:w-1/2 max-w-md border border-palette-lighter bg-white rounded shadow-lg">
      <div className="relative h-96">
        <Image
          src={imageResolver(main_image)}
          alt={main_image.attributes.alternativeText || 'alt text'}
          height={500}
          width={500}
          className="transform duration-500 ease-in-out hover:scale-105 h-full w-full"
        />
      </div>
      <div className="relative flex border-t border-palette-lighter">
        <button
          aria-label="left-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute left-0 z-10 opacity-75"
          onClick={() => scroll(-300)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3 mx-1 text-palette-primary" />
        </button>
        <div
          ref={ref}
          style={{ scrollBehavior: "smooth" }}
          className="flex space-x-1 w-full overflow-auto border-t border-palette-lighter"
        >
          {
            images.map((imgItem, index) => (
              <button
                key={index}
                className="relative w-40 h-32 flex-shrink-0 rounded-sm "
                onClick={() => setCurrentMainImage(imgItem)}
              >
                <Image
                  src={imageResolver(imgItem)}
                  alt={imgItem.attributes.alternativeText || ''}
                  width={160}
                  height={128}
                  className="h-full w-full"
                />
              </button>
            ))
          }
        </div>
        <button
          aria-label="right-scroll"
          className="h-32 bg-palette-lighter hover:bg-palette-light  absolute right-0 z-10 opacity-75"
          onClick={() => scroll(300)}
        >
          <FontAwesomeIcon icon={faArrowRight} className="w-3 mx-1 text-palette-primary" />
        </button>
      </div>
    </div>
  )
}

export default ProductImage
