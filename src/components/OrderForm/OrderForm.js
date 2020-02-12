// @flow
import React from 'react'
import OrderFormRenderer from './OrderFormRenderer'
import { formatNumber, unformat } from 'accounting-js'
import { Menu, MenuItem, ContextMenuTarget } from '@blueprintjs/core'
import { MATCHER_FEE } from '../../config/environment';

type Props = {
  authenticated: boolean,
  side: 'BUY' | 'SELL',
  askPrice: number,
  bidPrice: number,
  bestAskMatcher: string,
  bestBidMatcher: string,
  tokensBySymbol: Object,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  loggedIn: boolean,
  address: string,
  operatorAddress: string,
  exchangeAddress: string,
  selectedOrder: Object,
  onCollapse: string => void,
  onExpand: string => void,
  onResetDefaultLayout: void => void,
}

type State = {
  side: 'BUY' | 'SELL',
  fraction: number,
  priceType: string,
  selectedTabId: string,
  price: string,
  stopPrice: string,
  amount: string,
  total: string,
  isOpen: boolean
}

class OrderForm extends React.PureComponent<Props, State> {
  static defaultProps = {
    loggedIn: true,
    bidPrice: 0,
    askPrice: 0,
    baseTokenBalance: 0,
    quoteTokenBalance: 0
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      side: 'BUY',
      fraction: 0,
      isOpen: true,
      priceType: 'null',
      selectedTabId: 'limit',
      price: formatNumber(this.props.bidPrice, { precision: 3 }),
      stopPrice: formatNumber(this.props.bidPrice, { precision: 3 }),
      amount: '0.0',
      total: '0.0'
    }
  }

  componentWillReceiveProps({ bidPrice, askPrice, selectedOrder }: *) {
    if (selectedOrder === null || selectedOrder === this.props.selectedOrder) {
      return;
    }

    const { side } = this.state
    const { price, total } = selectedOrder;

    if (1 || (side === 'BUY' && price > bidPrice) || (side === 'SELL' && price < askPrice)) {
      this.setState({
        price: price,
        amount: total,
        total: (price * Number(total)).toString(),
      });
    }
  }

  onInputChange = ({ target }: Object) => {
    const { loggedIn } = this.props
    switch (target.name) {
      case 'stopPrice':
        this.handleStopPriceChange(target.value)
        break
      case 'price':
        this.handlePriceChange(target.value)
        break
      case 'total':
        this.handleTotalChange(target.value)
        break
      case 'amount':
        this.handleAmountChange(target.value)
        break
      case 'fraction':
        loggedIn && this.handleUpdateAmountFraction(target.value)
        break

      default:
        break
    }
  }

  handleSendOrder = () => {
    let { amount, price, side } = this.state

    amount = unformat(amount)
    price = unformat(price)

    //this.props.sendNewOrder(side, amount, price)
  }

  handleUpdateAmountFraction = (fraction: number) => {
    const { side, price } = this.state
    const { quoteTokenBalance, baseTokenBalance } = this.props

    let amount, total
    let numericPrice = unformat(price)

    if (side === 'SELL') {
      amount = (baseTokenBalance / 100) * fraction
      total = numericPrice * amount

      this.setState({
        fraction: fraction,
        amount: formatNumber(amount, { precision: 3 }),
        total: formatNumber(total, { precision: 3 })
      })

    } else {
      // Temporary solution to handle the case where price = 0. 
      // In the case orderbooks are full, we do not need to care about this
      if (numericPrice === 0) {
        this.setState({
          fraction: fraction, 
          amount: formatNumber(0, { precision: 3 }),
          total: formatNumber(0, { precision: 3 })
        })

        return
      }

      total = (quoteTokenBalance / 100) * fraction
      amount = total / numericPrice

      this.setState({
        fraction: fraction,
        amount: formatNumber(amount, { precision: 3 }),
        total: formatNumber(total, { precision: 3 })
      })
    }
  }

  handlePriceChange = (price: string) => {
    let { amount } = this.state

    let fPrice = unformat(price);
    if (!fPrice)
      return this.setState({price, total: '0'})
    let rounded_price = fPrice.toPrecision(8); // drop the excessive precision
    let fRoundedPrice = parseFloat(rounded_price);
    if (fRoundedPrice !== fPrice)
      price = fRoundedPrice.toString();

    amount = unformat(amount)
    let total = amount * unformat(price)

    this.setState({
      total: formatNumber(total, { precision: 3 }),
      //amount: formatNumber(amount, { precision: 3 }),
      price: price
    })
  }

  handleSideChange = (side: 'BUY' | 'SELL') => {
    this.setState({ side })
  }

  handleStopPriceChange = (stopPrice: string) => {
    let { amount } = this.state

    amount = unformat(amount)
    let total = amount * unformat(stopPrice)

    this.setState({
      total: formatNumber(total, { precision: 3 }),
      amount: formatNumber(amount, { precision: 3 }),
      stopPrice: stopPrice
    })
  }

  handleAmountChange = (amount: string) => {
    let { price, selectedTabId, stopPrice } = this.state
    let total

    stopPrice = unformat(stopPrice)
    price = unformat(price)

    selectedTabId === 'stop' ? (total = stopPrice * unformat(amount)) : (total = price * unformat(amount))

    this.setState({
      total: formatNumber(total, { precision: 3 }),
      amount: amount
    })
  }

  handleTotalChange = (total: string) => {
    let { price, selectedTabId, stopPrice } = this.state
    let amount

    price = unformat(price)
    stopPrice = unformat(stopPrice)

    selectedTabId === 'stop'
      ? stopPrice === 0
        ? (amount = 0)
        : (amount = unformat(total) / stopPrice)
      : price === 0
        ? (amount = 0)
        : (amount = unformat(total) / price)

    this.setState({
      price: formatNumber(price, { precision: 3 }),
      stopPrice: formatNumber(stopPrice, { precision: 3 }),
      amount: formatNumber(amount, { precision: 3 }),
      total: total
    })
  }


  handleChangeOrderType = (tabId: string) => {
    const { side } = this.state
    const { askPrice, bidPrice } = this.props

    this.setState({
      selectedTabId: tabId,
      fraction: 0,
      priceType: 'null',
      price: '',
      stopPrice: '',
      amount: '',
      total: ''
    })

    if (tabId === 'limit' && side === 'BUY') {
      this.setState({ price: formatNumber(askPrice, { precision: 3 }) })
    } else if (tabId === 'limit') {
      this.setState({ price: formatNumber(bidPrice, { precision: 3 }) })
    } else if (tabId === 'market' && side === 'BUY') {
      this.setState({ price: formatNumber(askPrice, { precision: 3 }) })
    } else if (tabId === 'market') {
      this.setState({ price: formatNumber(bidPrice, { precision: 3 }) })
    }
  }

  toggleCollapse = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
    this.props.onCollapse('orderForm')
  }

  renderContextMenu = () => {
    const {
      state: { isOpen },
      props: { onResetDefaultLayout },
      expand,
      toggleCollapse
    } = this

    return (
        <Menu>
            <MenuItem icon="page-layout" text="Reset Default Layout" onClick={onResetDefaultLayout} />
            <MenuItem icon={isOpen ? "chevron-up" : "chevron-down"} text={isOpen ? "Close" : "Open"} onClick={toggleCollapse} />
            <MenuItem icon="zoom-to-fit" text="Fit" onClick={expand} />
        </Menu>
    );
  }

  expand = () => {
    this.props.onExpand('orderForm')
  }

  render() {
    const {
      state: { 
        side,
        selectedTabId,
        fraction, 
        priceType, 
        price, 
        isOpen, 
        amount, 
        total
      },
      props: { 
        baseTokenSymbol, 
        loggedIn, 
        quoteTokenSymbol,
        baseTokenBalance, 
        quoteTokenBalance, 
        baseTokenDecimals, 
        quoteTokenDecimals, 
        address,
        operatorAddress,
        exchangeAddress,
        askPrice,
        bidPrice,
        bestAskMatcher,
        bestBidMatcher,
        tokensBySymbol,
        authenticated
      },
      onInputChange,
      handleChangeOrderType,
      handleSendOrder,
      handleSideChange,
      toggleCollapse,
      renderContextMenu
    } = this


    //TODO REFACTOR REFACTOR REFACTOR REFACTOR REFACTOR REFACTOR REFACTOR 
    let maxAmount
    let quoteTokenFee = unformat(amount) * unformat(price) * MATCHER_FEE;
    let maxQuoteTokenAmount = quoteTokenBalance - Number(quoteTokenFee)

    //if (price !== '0.000') {
      if (side === 'BUY') {
        maxAmount = (price !== '0.000') ? formatNumber(maxQuoteTokenAmount / unformat(price), { decimals: 3 }) : '0.000'
      } else {
        maxAmount = formatNumber(baseTokenBalance, { decimals: 3 })
      }
    //} else {
    //  maxAmount = '0.0'
    //}

    let insufficientBalance = (unformat(amount) > unformat(maxAmount))
    
    let buttonType = authenticated
      ? side === "BUY"
        ? "BUY"
        : "SELL"
      : side === "BUY"
        ? "BUY_LOGIN"
        : "SELL_LOGIN"
    
    return (
      <OrderFormRenderer
        selectedTabId={selectedTabId}
        side={side}
        fraction={fraction}
        priceType={priceType}
        price={price}
        maxAmount={maxAmount}
        amount={amount}
        total={total}
        isOpen={isOpen}
        baseTokenSymbol={baseTokenSymbol}
        quoteTokenSymbol={quoteTokenSymbol}
        insufficientBalance={insufficientBalance}
        loggedIn={loggedIn}
        onInputChange={onInputChange}
        toggleCollapse={toggleCollapse}
        handleChangeOrderType={handleChangeOrderType}
        handleSendOrder={handleSendOrder}
        baseTokenDecimals={baseTokenDecimals}
        quoteTokenDecimals={quoteTokenDecimals}
        address={address}
        operatorAddress={operatorAddress}
        exchangeAddress={exchangeAddress}
        askPrice={askPrice}
        bidPrice={bidPrice}
        bestAskMatcher={bestAskMatcher}
        bestBidMatcher={bestBidMatcher}
        tokensBySymbol={tokensBySymbol}
        handleSideChange={handleSideChange}
        expand={this.expand}
        onContextMenu={renderContextMenu}
        authenticated={authenticated}
        buttonType={buttonType}
      />
    )
  }
}

export default ContextMenuTarget(OrderForm)
