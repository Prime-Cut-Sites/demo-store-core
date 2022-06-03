import { SlidersHorizontal } from '#assets/icons'
import { useCatalogContext } from '#contexts/CatalogContext'
import type { Primitives } from '#utils/facets'
import facetsConfig from 'config/facets.config'
import { useI18n } from 'next-localization'
import { useState } from 'react'
import { FacetColor, FacetPriceRange, FacetTag } from './FacetsAppearance'
import { Icon } from './Icon'

const FacetAppearance: React.FC<{ facetName: string, facetValues: Primitives[] }> = ({ facetName, facetValues }) => {
  const config = facetsConfig.find(facetConfig => facetConfig.field === facetName)

  if (!config) {
    console.error(`Facet configuration for ${facetName} is missing!`)
    return null
  }

  // TODO: implement sorting for `facetValues` reading the algorithm name from Config file

  switch (config.type) {
    case 'priceRange':
      return <FacetPriceRange facetName={facetName} facetValues={facetValues} />
    case 'color':
      return <FacetColor facetName={facetName} facetValues={facetValues} />
    case 'tag':
      return <FacetTag facetName={facetName} facetValues={facetValues} />
  }
}

export const Facet: React.FC<JSX.IntrinsicElements['div']> = ({ className = '', ...props }) => {
  const i18n = useI18n()
  const { availableFacets } = useCatalogContext()
  const [opened, setOpened] = useState<boolean>(false)

  const facetList = Object.entries(availableFacets)

  if (facetList.length === 0) {
    return null
  }

  return (
    <div className={`${className}`} {...props}>
      <Icon onSelect={setOpened} Icon={SlidersHorizontal} />
      <div className={`${opened ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity absolute right-0 w-full lg:w-2/3 bg-white z-10 pb-10 lg:p-4 lg:shadow-md lg:rounded-md`}>
        {
          facetList.map(([facetName, facetValues]) => {
            if (facetValues.length > 0) {
              return (
                <div key={facetName}>
                  <div className='font-bold mt-4'>{i18n.t(`facets.${facetName}`) || `facets.${facetName}`}</div>
                  <FacetAppearance facetName={facetName} facetValues={facetValues} />
                </div>
              )
            }
          })
        }
      </div>
    </div>
  )
}
