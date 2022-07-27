import { Facet } from '#components/Facet'
import type { HeaderProps } from '#components/Header'
import { Page } from '#components/Page'
import { ProductCard } from '#components/ProductCard'
import { Props as SubNavigationProps, SubNavigation } from '#components/SubNavigation'
import { Title } from '#components/Title'
import { CatalogProvider, useCatalogContext } from '#contexts/CatalogContext'
import type { LocalizedProductWithVariant } from '#utils/products'
import type { NextPage } from 'next'
import { useI18n } from 'next-localization'
import { useRouter } from 'next/router'

export type Props = HeaderProps & Partial<SubNavigationProps> & {
  products: LocalizedProductWithVariant[]
}

const ProductList: React.FC<{ hasSidebar: boolean }> = ({ hasSidebar }) => {
  const { products } = useCatalogContext()

  return (
    <div className={`w-full grid space-y-0 gap-6 lg:gap-y-12 sm:grid-cols-2 ${hasSidebar ? 'lg:grid-cols-2 2xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
      {
        products.map(product => (
          <ProductCard key={product.sku} product={product} useCommerceLayer={false} />
        ))
      }
    </div>
  )
}

const Header: React.FC<Partial<SubNavigationProps>> = ({ subNavigation }) => {
  const router = useRouter()
  const { products } = useCatalogContext()
  const i18n = useI18n()

  const resultsFor = i18n.t('general.resultsFor', {
    count: products.length,
    query: typeof router.query.q === 'string' ? router.query.q : ''
  })

  return (
    <Title title={<>{subNavigation?.current.text || resultsFor}</>}>
      <Facet />
    </Title>
  )
}

export const SearchPageComponent: NextPage<Props> = ({ navigation, products, subNavigation }) => {
  const isSubNavigationVisible = subNavigation !== undefined && !!subNavigation.path.find(c => c.children?.length && c.children.length >= 1)

  return (
    <Page
      navigation={navigation}
      title={subNavigation?.current.text}
      description={subNavigation?.current.description}
    >
      <CatalogProvider products={products}>

        <Header subNavigation={subNavigation} />

        <div className='lg:flex mt-10'>
          {
            isSubNavigationVisible && (
              <div className='shrink-0 basis-1/3 hidden lg:block'>
                <SubNavigation className='w-3/4' subNavigation={subNavigation} />
              </div>
            )
          }

          <ProductList hasSidebar={isSubNavigationVisible} />
        </div>

      </CatalogProvider>
    </Page>
  )
}
