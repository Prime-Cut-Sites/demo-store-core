import { GetStaticPathsResult } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Locale, locales as allLocales } from './locale'
import { combine } from './utils'

type WithLocalePathsResult<P> = GetStaticPathsResult<P & { locale: string }>

type Props<P extends ParsedUrlQuery> = GetStaticPathsResult<P> | ((localeCode: string) => GetStaticPathsResult<P>)

const appendLocaleToPath = <P extends ParsedUrlQuery>(locale: Locale, path: GetStaticPathsResult<P>['paths'][number]): WithLocalePathsResult<P>['paths'][number] => {
  if (typeof path === 'string') {
    return `/${locale.code}${path}`
  }

  return {
    ...path,
    params: {
      ...path.params,
      locale: locale.code
    }
  }
}

export const withLocalePaths = <P extends ParsedUrlQuery>(getStaticPathsResult: Props<P>, locales: Locale[] = allLocales): WithLocalePathsResult<P> => {

  if (locales.length === 0) {
    throw new Error('At least one Locale is mandatory!')
  }

  if (typeof getStaticPathsResult === 'function') {
    const withLocalePathsResult: WithLocalePathsResult<P>[] = locales.map(locale => {
      const { fallback, paths } = getStaticPathsResult(locale.code)

      return {
        fallback,
        paths: paths.map(path => appendLocaleToPath(locale, path))
      }
    })

    const result = withLocalePathsResult.reduce((acc, cv) => {
      return {
        fallback: acc.fallback || cv.fallback,
        paths: [
          ...(acc.paths || []),
          ...cv.paths
        ]
      }
    }, {} as WithLocalePathsResult<P>)

    if (result.paths.length === 0) {
      return {
        // @ts-expect-error
        paths: locales.map(locale => ({
          params: {
            locale: locale.code
          }
        })),
        fallback: result.fallback
      }
    }

    return result
  }

  const { fallback, paths } = getStaticPathsResult

  if (paths.length === 0) {
    return {
      // @ts-expect-error
      paths: locales.map(locale => ({
        params: {
          locale: locale.code
        }
      })),
      fallback
    }
  }

  const newPaths: WithLocalePathsResult<P>['paths'][number][] = combine<
    Locale,
    GetStaticPathsResult<P>['paths'][number],
    WithLocalePathsResult<P>['paths'][number]
    >(locales, paths, appendLocaleToPath)

  return {
    paths: newPaths,
    fallback,
  }
}