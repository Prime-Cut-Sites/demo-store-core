import { render } from '@testing-library/react'
import { Link } from './Link'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

beforeEach(() => {
  useRouter.mockReset()
})

test('should be able to switch "locale" from root', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {
      locale: 'en-US'
    },
    asPath: '/'
  }))

  const { container } = render(<Link locale="en-US">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-US">Path 1</a></div>')
})

test('should be able to switch "locale" from a locale path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]',
    pathname: '/[locale]',
    query: { locale: 'en-BR' },
    asPath: '/en-BR',
  }))

  const { container } = render(<Link locale="en-US">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-US">Path 1</a></div>')
})

test('should be able to switch "locale" from any path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-BE' },
    asPath: '/en-BE/another'
  }))

  const { container } = render(<Link locale="en-US">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-US/another">Path 1</a></div>')
})

test('should be able to switch "href" from root', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/'
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/path-1">Path 1</a></div>')
})

test('should be able to switch "href" from a locale path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]',
    pathname: '/[locale]',
    query: { locale: 'en-BR' },
    asPath: '/en-BR',
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-BR/path-1">Path 1</a></div>')
})

test('should be able to switch "href" from any path', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-BE' },
    asPath: '/en-BE/another'
  }))

  const { container } = render(<Link href="/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-BE/path-1">Path 1</a></div>')
})

test('should be able to switch "href" with a path that contains a valid locale', () => {
  useRouter.mockImplementation(() => ({
    route: '/[locale]/another',
    pathname: '/[locale]/another',
    query: { locale: 'en-BE' },
    asPath: '/en-BE/another'
  }))

  const { container } = render(<Link href="/en-US/path-1">Path 1</Link>)
  expect(container).toContainHTML('<div><a href="/en-BE/en-US/path-1">Path 1</a></div>')
})
