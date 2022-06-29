import { ShoppingBagOpen } from '#assets/icons'
import { Logo } from '#components/Logo'
import type { Props as NavigationProps } from '#components/Navigation'
import { Navigation } from '#components/Navigation'
import { Search } from '#components/Search'
import { Link } from '#i18n/Link'
import { CartLink, LineItemsCount } from '@commercelayer/react-components'
import { useEffect, useState } from 'react'


export type HeaderProps = Partial<NavigationProps>

const CartQuantity: React.FC<{ quantity: number }> =  ({ quantity: propQuantity }) => {
  const [quantity, setQuantity] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const animation = 'animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]'
  const isVisible = propQuantity > 0


  useEffect(() => {
    if (propQuantity > 0) {
      setQuantity(propQuantity)
    }
  
    if (propQuantity !== quantity && quantity > 0) {
      setIsAnimating(true)
    }
  }, [propQuantity, quantity])

  return (
    <div className={`absolute bottom-0 translate-x-1/3 right-0 w-4 h-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <span className={`${isAnimating ? animation : ''} absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75`} onAnimationEnd={() => setIsAnimating(false)}></span>
      <div className='absolute h-full w-full text-white bg-violet-400 rounded-full text-xxs flex items-center justify-center'>{quantity}</div>
    </div>
  )
}

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <header className='border-b-gray-200 border-b pb-6 sticky top-0 bg-white z-50'>
      <nav className='flex items-center justify-between flex-wrap mb-4'>
        <div className='flex items-center flex-no-shrink text-white mr-6'>
          <Link href='/'><a><Logo /></a></Link>
        </div>
        <div className='flex items-center w-auto flex-grow justify-end'>
          {/* <a className='block lg:inline-block mr-4 text-gray-300'><User /></a> */}
          {/* <a className='block lg:inline-block mr-4 text-gray-300'><HeartStraight /></a> */}

          <CartLink
            className='block lg:inline-block relative'
            label={(
              <>
                <ShoppingBagOpen />
                <LineItemsCount>
                  {CartQuantity}
                </LineItemsCount>
              </>
            )} />

        </div>
      </nav>
      <div className='flex items-center justify-between flex-wrap gap-4 relative'>
        {navigation && <Navigation navigation={navigation} className='order-2 lg:order-1' />}
        <Search className='order-1 grow lg:grow-0' />
      </div>
    </header>
  )
}
