import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'


function CheckOutButton() {
  return (
    <Link
      href='/checkout'
      aria-label="checkout-products"
      className="bg-palette-primary text-white text-lg font-primary font-semibold pt-2 pb-1 leading-relaxed flex 
      justify-center items-center focus:ring-1 focus:ring-palette-light focus:outline-none w-full hover:bg-palette-dark rounded-sm"
    >
      Check Out
      <FontAwesomeIcon icon={faArrowRight} className="w-4 ml-2 inline-flex" />
    </Link>
  )
}

export default CheckOutButton
