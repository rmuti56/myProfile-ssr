import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import App from 'next/app'
import React from 'react'
import { initializeStore, IStore } from '../stores/store'

interface IOwnProps {
  isServer: boolean
  initialState: IStore
}

class MyApp extends App<IOwnProps> {
  public static async getInitialProps({ Component, ctx }: any) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store
    //
    const isServer = typeof window === 'undefined'
    const store = initializeStore(isServer)
    //
    // Check whether the page being rendered by the App has a
    // static getInitialProps method and if so call it
    //
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      initialState: getSnapshot(store),
      isServer,
      pageProps,
    }
  }

  private store: IStore

  constructor(props: any) {
    super(props)
    this.store = initializeStore(props.isServer, props.initialState) as IStore
  }

  public render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default MyApp