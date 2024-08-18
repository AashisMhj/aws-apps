'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
//
import { useCartContext } from '@/context/Cart.context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Icon from "@/assets/svg/icon.svg";

export default function Nav() {
  const {items:cart} = useCartContext()

  return (
    <header className="border-b border-palette-lighter sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-6xl px-6 pb-2 pt-4 md:pt-6">
        <Link href="/" passHref>
          <div className=" cursor-pointer">
            <h1 className="flex no-underline">
              <Image height="32" width="32" alt="logo" className="h-8 w-8 mr-1 object-contain" src={Icon} />
              <span className="text-xl font-primary font-bold tracking-tight pt-1">
                {process.env.siteTitle}
              </span>
            </h1>
          </div>
        </Link>
        <div>
          <Link
            href="/checkout"
            passHref
          >
            <div className=" relative" aria-label="cart">
              <FontAwesomeIcon className="text-palette-primary w-6 m-auto" icon={faShoppingCart} />
              {
                cart.length === 0 ?
                  null
                  :
                  <div
                    className="absolute top-0 right-0 text-xs bg-yellow-300 text-gray-900 font-semibold rounded-full py-1 px-2 transform translate-x-10 -translate-y-3"
                  >
                    {cart.length}
                  </div>
              }
            </div>
          </Link>
        </div>
      </div>
    </header >
  )
}

