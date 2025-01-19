import { NEXT_PUBLIC_DEFAULT_LANGUAGE } from '#utils/envs'
import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx)
  }

  render() {
    const locale = this.props.__NEXT_DATA__.query.locale as unknown as string | string[] | undefined

    if (Array.isArray(locale)) {
      throw new Error('The query "locale" cannot be an array!')
    }

    return (
      <Html lang={locale || NEXT_PUBLIC_DEFAULT_LANGUAGE}>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              '/metrics/?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.GTM_ID}');`,
            }}
          />
        </Head>
        <body className='bg-pageBackground'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
