// @flow
import React from 'react'
import OHLCV from '../../components/OHLCV'
import OrdersTable from '../../components/OrdersTable'
import OrderForm from '../../components/OrderForm'
import TradesTable from '../../components/TradesTable'
import TokenSearcher from '../../components/TokenSearcher'
import OrderBook from '../../components/OrderBook'
import { CloseableCallout, EmphasizedText } from '../../components/Common'
import { Redirect } from 'react-router-dom'
import { AutoSizer } from 'react-virtualized'
import { SizesAsNumbers as Sizes } from '../../components/Common/Variables'

import { Responsive } from 'react-grid-layout'

import type { DisplayMode } from '../../types/account'

const ResponsiveReactGridLayout = Responsive

type Layout = Array<Object>
type LayoutMap = { [string]: Layout }

type Props = {
  authenticated: boolean,
  isConnected: boolean,
  isInitiated: boolean,
  balancesLoading: boolean,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  pairName: string,
  displayMode: DisplayMode,
  displayModes: Array<DisplayMode>,
  queryTradingPageData: () => void,
  updateDisplayMode: (DisplayMode) => void,
}

type State = {
  calloutVisible: boolean,
  calloutOptions: Object,
  layouts: LayoutMap,
  items: Array<string>,
  collapsedItems: any,
  currentBreakpoint: string,
  initData: boolean
}

const defaultSizes = {
  'lg': {
    'tokenSearcher': { x: 0, y: 0, w: 12, h: 30, minW: 12 },
    'orderForm': { x: 0, y: 30, w: 12, h: 18, minW: 12, minH: 18, maxH: 18 },
    'ohlcv': { x: 12, y: 0, w: 36, h: 28 },
    'ordersTable': { x: 12, y: 35, w: 23, h: 18 },
    'orderBook': { x: 48, y: 0, w: 12, h: 28, minW: 10 },
    'tradesTable': { x: 35, y: 35, w: 25, h: 18 },
  },
  'md': {
    'tokenSearcher': { x: 0, y: 0, w: 18, h: 30, minW: 12 },
    'orderForm': { x: 0, y: 30, w: 18, h: 20, minW: 12, minH: 18, maxH: 20 },
    'ohlcv': { x: 18, y: 0, w: 42, h: 30 },
    'ordersTable': { x: 18, y: 30, w: 42, h: 20 },
    'orderBook': { x: 18, y: 50, w: 21, h: 30 },
    'tradesTable': { x: 39, y: 50, w: 21, h: 30 },
  },
  'sm': {
    'tokenSearcher': { x: 0, y: 0, w: 30, h: 18, minW: 12 },
    'orderForm': { x: 30, y: 0, w: 30, h: 18, minW: 12, minH: 18, maxH: 18 },
    'ohlcv': { x: 0, y: 16, w: 60, h: 30 },
    'ordersTable': { x: 0, y: 106, w: 60, h: 20 },
    'orderBook': { x: 0, y: 46, w: 30, h: 30 },
    'tradesTable': { x: 30, y: 46, w: 30, h: 30 },
  },
  'xs': {
    'tokenSearcher': { x: 0, y: 0, w: 60, h: 20, minW: 12 },
    'orderForm': { x: 0, y: 40, w: 60, h: 18, minW: 12, minH: 18, maxH: 18 },
    'ohlcv': { x: 0, y: 20, w: 60, h: 20 },
    'ordersTable': { x: 0, y: 56, w: 60, h: 20 },
    'orderBook': { x: 0, y: 76, w: 60, h: 30 },
    'tradesTable': { x: 0, y: 96, w: 60, h: 30 },
  },
}

const fullScreenOHLCVLayouts: LayoutMap = {
  'lg': [{ i: 'ohlcv', x: 0, y: 0, w: 60, h: 60 }],
  'md': [{ i: 'ohlcv', x: 0, y: 0, w: 60, h: 60 }],
  'sm': [{ i: 'ohlcv', x: 0, y: 0, w: 60, h: 60 }],
  'xs': [{ i: 'ohlcv', x: 0, y: 0, w: 60, h: 60 }],
}

const defaultLayouts = {
  'lg': [
    { i: 'tokenSearcher', x: 0, y: 0, w: 12, h: 28, minW: 12 },
    { i: 'orderForm', x: 0, y: 35, w: 12, h: 18, minW: 12, minH: 18, maxH: 18 },
    { i: 'ohlcv', x: 12, y: 0, w: 36, h: 28, minW: 10 },
    { i: 'ordersTable', x: 12, y: 35, w: 23, h: 18, minW: 10 },
    { i: 'orderBook', x: 48, y: 0, w: 12, h: 28, minW: 10 },
    { i: 'tradesTable', x: 35, y: 35, w: 25, h: 18, minW: 10 },
  ],
  'md': [
    { i: 'tokenSearcher', x: 0, y: 0, w: 18, h: 30, minW: 12 },
    { i: 'orderForm', x: 0, y: 30, w: 18, h: 20, minW: 12, minH: 18, maxH: 20 },
    { i: 'ohlcv', x: 18, y: 0, w: 42, h: 30, minW: 15 },
    { i: 'ordersTable', x: 18, y: 30, w: 42, h: 20, minW: 15 },
    { i: 'orderBook', x: 18, y: 50, w: 21, h: 30, minW: 15 },
    { i: 'tradesTable', x: 39, y: 50, w: 21, h: 30, minW: 12 },
  ],
  'sm': [
    { i: 'tokenSearcher', x: 0, y: 0, w: 30, h: 18, minW: 12 },
    { i: 'orderForm', x: 30, y: 0, w: 30, h: 18, minW: 12, minH: 18, maxH: 18 },
    { i: 'ohlcv', x: 0, y: 16, w: 60, h: 30 },
    { i: 'ordersTable', x: 0, y: 106, w: 60, h: 20 },
    { i: 'orderBook', x: 0, y: 46, w: 30, h: 30, minW: 20 },
    { i: 'tradesTable', x: 30, y: 46, w: 30, h: 30 },
  ],
  'xs': [
    { i: 'tokenSearcher', x: 0, y: 0, w: 60, h: 20, minW: 60, maxW: 60 },
    { i: 'orderForm', x: 0, y: 40, w: 60, h: 18, minH: 18, maxH: 18, minW: 60, maxW: 60 },
    { i: 'ohlcv', x: 0, y: 20, w: 60, h: 20, minW: 60, maxW: 60 },
    { i: 'ordersTable', x: 0, y: 56, w: 60, h: 20, minW: 60, maxW: 60 },
    { i: 'orderBook', x: 0, y: 76, w: 60, h: 20, minW: 60, maxW: 60 },
    { i: 'tradesTable', x: 0, y: 96, w: 60, h: 20, minW: 60, maxW: 60 },
  ]
}

class TradingPage extends React.PureComponent<Props, State> {

  state = {
    items: ['tokenSearcher', 'orderForm', 'ohlcv', 'ordersTable', 'orderBook', 'tradesTable'],
    calloutVisible: false,
    calloutOptions: {},
    layouts: defaultLayouts,
    currentBreakpoint: 'lg',
    collapsedItems: {
      'tokenSearcher': false,
      'orderForm': false,
      'ohlcv': false,
      'ordersTable': false,
      'orderBook': false,
      'tradesTable': false
    },
    initData: false
  }

  callouts = {
    notAuthenticated: () => ({
      title: 'Authenticated Required',
      intent: 'danger',
      message: 'Please authenticate to start trading'
    }),



  }

  componentDidMount() {
    const { mode } = this.props.match.params;
    if (mode) {
      const { displayModes, updateDisplayMode } = this.props;
      const displayMode = displayModes.find(m => m.name === mode);
      if (displayMode) {
        updateDisplayMode(displayMode);
      }
    }

    if (this.props.isConnected) {
      this.props.queryTradingPageData();
      this.setState({initData: true})
    }

    // this.checkIfCalloutRequired()
  }

  componentDidUpdate(prevProps: Props) {
   
    if (prevProps.displayMode.name !== this.props.displayMode.name) {
      const { history, pairName, displayMode } = this.props;
      history.replace(`/trade/${pairName}/${displayMode.name}`)
    }

    if (prevProps.isConnected || !this.props.isConnected || !this.props.isInitiated || this.state.initData) {
      return;
    }

    this.props.queryTradingPageData();
    this.setState({initData: true})
  }

  checkIfCalloutRequired = () => {
    const {
      authenticated,
      baseTokenBalance,
      quoteTokenBalance,
    } = this.props

    if (!authenticated) {
      let calloutOptions = this.callouts.notAuthenticated()
      this.setState({ calloutVisible: true, calloutOptions })
    }

    if (baseTokenBalance === '0.0' && quoteTokenBalance === '0.0') {
      return
    }

  }

  closeCallout = () => {
    this.setState({ calloutVisible: false })
  }

  onCollapse = (item: string) => {
    let { currentBreakpoint, layouts } = this.state
    let newLayout = []
    let currentLayout = layouts[currentBreakpoint]

    currentLayout.forEach(elem => {
      if (elem.i === item) {
        this.state.collapsedItems[item]
          ? newLayout.push({ ...elem, h: defaultSizes[currentBreakpoint][item].h })
          : newLayout.push({ ...elem, h: 4 })
      } else {
        newLayout.push(elem)
      }
    })

    let newLayouts = { ...this.state.layouts, [currentBreakpoint]: newLayout }
    this.setState({
      layouts: newLayouts, collapsedItems: {
        ...this.state.collapsedItems,
        [item]: !this.state.collapsedItems[item]
      }
    })
  }

  onFullScreenOHLCV = () => {
    this.setState({ layouts: fullScreenOHLCVLayouts, items: ['ohlcv'] })
  }

  onLayoutChange = (currentLayout: Layout, layouts: LayoutMap) => {
    this.setState({ layouts })
  }

  onBreakpointChange = (currentBreakpoint: string, newCols: number) => {
    this.setState({ currentBreakpoint })
  }

  onResetDefaultLayout = () => {
    this.setState({
      layouts: defaultLayouts,
      items: ['tokenSearcher', 'orderForm', 'ohlcv', 'ordersTable', 'orderBook', 'tradesTable'],
      collapsedItems: {
        'tokenSearcher': false,
        'orderForm': false,
        'ohlcv': false,
        'ordersTable': false,
        'orderBook': false,
        'tradesTable': false
      }
    })
  }

  onExpand = (item: string) => {
    let { currentBreakpoint, layouts } = this.state
    let currentLayout = layouts[currentBreakpoint]

    let currentItem = currentLayout.filter(elem => elem.i === item)[0]
    let otherItems = currentLayout.filter(elem => elem.i !== item)
    let { y: yc, h: hc, x: xc, w: wc } = currentItem

    let newX = 0
    let newXPlusW = 60 // number of columns
    let newYPlusH = 100000

    otherItems.forEach(elem => {
      let { x, y, h, w, i } = elem

      // check if items heights overlap
      if ((yc < (y + h) && (yc + hc) >= (y + h)) || (yc <= y && (yc + hc) > y)) {
        //left side collision detection
        if ((x + w) <= xc) {
          if ((x + w) > newX) newX = x + w
        }

        //probably x + w
        //right side collision detection        
        if (x >= (xc + wc)) {
          if (x < newXPlusW) newXPlusW = x
        }
      }

      // check if items lengths overlap
      if (((xc > x) && (xc <= (x + w))) || (((xc + wc) > x) && ((xc + wc) <= (x + w)))) {
        //down side side collision detection
        //we only expand vertically if the difference below is small
        if ((yc + hc) <= y && (y < (yc + hc + 100))) {
          if (y < newYPlusH) newYPlusH = y
        }
      }
    })

    //we didn't find a nearby element blocking vertically
    if (newYPlusH === 100000) newYPlusH = yc + hc

    let newLayout = []
    currentLayout.forEach(elem => {
      if (elem.i === item) {
        newLayout.push({ ...elem, x: newX, w: newXPlusW - newX, h: newYPlusH - yc })
      } else {
        newLayout.push(elem)
      }
    })

    let newLayouts = { ...this.state.layouts, [currentBreakpoint]: newLayout }
    this.setState({ layouts: newLayouts })
  }


  renderItem = (item: string) => {
    const { items } = this.state
    const fullScreen = (items[0] === "ohlcv" && items.length === 1)


    const renderedItems = {
      tokenSearcher: (
        <div key="tokenSearcher">
          <TokenSearcher
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
            match={this.props.match}
            isConnected={this.props.isConnected}
            initData={this.state.initData}
          />
        </div>
      ),
      orderForm: (
        <div key="orderForm">
          <OrderForm
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
          />
        </div>
      ),
      ohlcv: (
        <div key="ohlcv">
          <OHLCV
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
            onFullScreen={this.onFullScreenOHLCV}
            fullScreen={fullScreen}
          />
        </div>
      ),
      ordersTable: (
        <div key="ordersTable">
          <OrdersTable
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
          />
        </div>
      ),
      orderBook: (
        <div key="orderBook">
          <OrderBook
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
          />
        </div>
      ),
      tradesTable: (
        <div key="tradesTable">
          <TradesTable
            onCollapse={this.onCollapse}
            onExpand={this.onExpand}
            onResetDefaultLayout={this.onResetDefaultLayout}
          />
        </div>
      )
    }

    return renderedItems[item]
  }

  render() {
    const { authenticated, isInitiated } = this.props
    const { calloutOptions, calloutVisible, layouts, items } = this.state

    // if (!authenticated) return <Redirect to="/login" />
    // if (!isInitiated) return null;

    return (
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width, height }) => (
          <ResponsiveReactGridLayout
            width={width}
            layouts={layouts}
            breakpoints={{ lg: Sizes.laptop, md: Sizes.tablet, sm: Sizes.mobileL, xs: Sizes.mobileM, xxs: Sizes.mobileS }}
            cols={{ lg: 60, md: 60, sm: 60, xs: 60, xxs: 60 }}
            onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
            onBreakpointChange={this.onBreakpointChange}
            className="layout"
            rowHeight={10}
            compactType="vertical"
            draggableHandle=".drag"
          >
            {items.map(item => this.renderItem(item))}
          </ResponsiveReactGridLayout>
        )}
      </AutoSizer>
    )
  }
}

export default TradingPage


// {/* <CloseableCallout
//   visible={calloutVisible}
//   handleClose={this.closeCallout}
//   {...calloutOptions}
// /> */}