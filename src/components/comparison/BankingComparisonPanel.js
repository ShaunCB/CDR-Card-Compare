import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
import Typography from '@material-ui/core/Typography'
import {fade} from '@material-ui/core/styles/colorManipulator'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {productDataKeys} from '../../utils/dict'
import {format, parseDurationText} from '../../utils/datetime'
import AdditionalInfo from '../data/banking/AdditionalInfo'
import ecomp from '../../utils/enum-comp'
import Bundle from '../data/banking/Bundle'
import Constraint from '../data/banking/Constraint'
import DepositRate from '../data/banking/DepositRate'
import LendingRate from '../data/banking/LendingRate'
import Eligibility from '../data/banking/Eligibility'
import Feature from '../data/banking/Feature'
import Fee from '../data/banking/Fee'
import CardArt from '../data/banking/CardArt'
import { deselectProduct } from '../../store/banking/selection'

const useStyles = makeStyles(theme => ({
  panel: {
    backgroundColor: fade('#fff', 0.9)
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: theme.typography.pxToRem(20),
  },
  table: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  headCell: {
    color: fade('#000', 0.9),
    fontWeight: 700,
    fontSize: '0.8rem',
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    borderBottom: '2px solid #eee'
  },
  dataCell: {
    verticalAlign: 'top'
  }
}))

const premiumDataKeys = [
  {key: 'annualFee', label: 'Annual Fee'},
  {key: 'purchaseRate', label: 'Purchase Rate'},
  {key: 'cashAdvanceRate', label: 'Cash Advance Rate'},
  {key: 'interestFreeDays', label: 'Interest-Free Days'},
  {key: 'rewardsMultiplier', label: 'Reward Multipliers'}
]

const getFeeAmount = (fee) => {
  if (!fee) return 0
  if (fee.amount !== undefined && fee.amount !== null) {
    return parseFloat(fee.amount)
  }
  if (fee.fixedAmount && fee.fixedAmount.amount !== undefined && fee.fixedAmount.amount !== null) {
    return parseFloat(fee.fixedAmount.amount)
  }
  return 0
}

const findAnnualFee = (fees) => {
  if (!fees) return null
  // Strict match: name is exactly "Annual Fee" or type is exactly "Annual Fee" (case-insensitive)
  const strictFee = fees.find(f => f && (
    (f.name && f.name.toLowerCase().trim() === 'annual fee') ||
    (f.feeType && f.feeType.toLowerCase().trim() === 'annual fee')
  ))
  if (strictFee) return strictFee

  // Fallback match: old logic
  return fees.find(f => f && (
    f.feeType === 'PERIODIC' || 
    (f.name && f.name.toLowerCase().includes('annual')) ||
    (f.name && f.name.toLowerCase().includes('account service'))
  ))
}

const renderPremiumField = (product, key) => {
  switch (key) {
    case 'annualFee': {
      if (!product.fees) return 'N/A'
      const annualFee = findAnnualFee(product.fees)
      if (annualFee) {
        const feeAmount = getFeeAmount(annualFee)
        if (annualFee.additionalValue) {
          const freq = parseDurationText(annualFee.additionalValue);
          if (freq) return `${feeAmount} (${annualFee.name || 'Annual Fee'}) - Charged every ${freq}`
        }
        return `${feeAmount} (${annualFee.name || 'Annual Fee'})`
      }
      return 'No Annual Fee'
    }
    case 'purchaseRate': {
      if (!product.lendingRates) return 'N/A'
      const purchaseRate = product.lendingRates.find(r => r && (r.lendingRateType === 'PURCHASE' || (r.additionalInfo && r.additionalInfo.toLowerCase().includes('purchase'))))
      if (purchaseRate) {
        return `${(parseFloat(purchaseRate.rate) * 100).toFixed(2)}%`
      }
      return 'N/A'
    }
    case 'cashAdvanceRate': {
      if (!product.lendingRates) return 'N/A'
      const cashRate = product.lendingRates.find(r => r && (r.lendingRateType === 'CASH_ADVANCE' || (r.additionalInfo && r.additionalInfo.toLowerCase().includes('cash advance'))))
      if (cashRate) {
        return `${(parseFloat(cashRate.rate) * 100).toFixed(2)}%`
      }
      return 'N/A'
    }
    case 'interestFreeDays': {
      if (!product.features) return 'N/A'
      const interestFree = product.features.find(f => f && (f.featureType === 'INTEREST_FREE' || f.featureType === 'INTEREST_FREE_TRANSFERS'))
      if (interestFree) {
        return interestFree.additionalValue ? (parseDurationText(interestFree.additionalValue) || interestFree.additionalValue) : (interestFree.additionalInfo || 'Yes')
      }
      return 'No Interest Free Period'
    }
    case 'rewardsMultiplier': {
      if (!product.features) return 'N/A'
      const rewards = product.features.find(f => f && (f.featureType === 'LOYALTY_PROGRAM' || f.featureType === 'BONUS_REWARDS'))
      if (rewards) {
        return rewards.additionalValue ? `${rewards.additionalValue}` : (rewards.additionalInfo || 'Yes')
      }
      return 'N/A'
    }
    default:
      return null
  }
}

const renderCardBadges = (product) => {
  const badges = []
  const hasChargeArt = product.cardArt && product.cardArt.some(art => art && art.title && art.title.toLowerCase().includes('charge'))
  const isCharge = (product.name && product.name.toLowerCase().includes('charge')) || 
                   (product.description && product.description.toLowerCase().includes('charge')) || 
                   hasChargeArt;
  if (isCharge) {
    badges.push({ text: 'Charge Card', color: '#1890ff', bg: '#e6f7ff' })
  } else {
    badges.push({ text: 'Credit Card', color: '#722ed1', bg: '#f9f0ff' })
  }
  if (product.fees) {
    const annualFee = findAnnualFee(product.fees)
    if (!annualFee || getFeeAmount(annualFee) === 0) {
      badges.push({ text: 'No Annual Fee', color: '#52c41a', bg: '#f6ffed' })
    }
  }
  if (product.features) {
    const rewards = product.features.some(f => f && (f.featureType === 'LOYALTY_PROGRAM' || f.featureType === 'BONUS_REWARDS'))
    if (rewards) {
      badges.push({ text: 'Rewards', color: '#fa8c16', bg: '#fff7e6' })
    }
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
      {badges.map((badge, idx) => (
        <span key={idx} style={{ fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px', color: badge.color, backgroundColor: badge.bg, border: `1px solid ${badge.color}40`, textTransform: 'uppercase' }}>
          {badge.text}
        </span>
      ))}
    </div>
  )
}

const resolveImageUri = (imageUri, dataSource) => {
  if (!imageUri) return null
  let resolved = imageUri.trim()
  
  if (resolved.startsWith('/')) {
    if (dataSource && dataSource.name && dataSource.name.toLowerCase().includes('national australia bank')) {
      resolved = 'https://www.nab.com.au' + resolved
    } else if (dataSource && dataSource.url) {
      try {
        const urlObj = new URL(dataSource.url)
        resolved = urlObj.origin + resolved
      } catch (e) {
        resolved = dataSource.url.replace(/\/+$/, '') + resolved
      }
    }
  }
  
  if (resolved.includes('openbank.api.nab.com.au')) {
    resolved = resolved.replace('openbank.api.nab.com.au', 'www.nab.com.au')
  } else if (resolved.includes('api.nab.com.au')) {
    resolved = resolved.replace('api.nab.com.au', 'www.nab.com.au')
  }
  
  if (resolved.startsWith('http://')) {
    resolved = 'https://' + resolved.substring(7)
  }

  if (/^(javascript|vbscript):/i.test(resolved)) {
    return null
  }
  
  return resolved
}

const renderCardImage = (product, dataSource) => {
  const cardArtObj = product.cardArt && product.cardArt.find(art => art && art.imageUri)
  const imageUri = cardArtObj ? resolveImageUri(cardArtObj.imageUri, dataSource) : null
  
  if (imageUri) {
    return (
      <div style={{ margin: '8px 0', width: '120px', height: '76px', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <img 
          src={imageUri} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
    )
  }
  
  const name = dataSource.name.toLowerCase()
  let bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  if (name.includes('american express') || name.includes('amex')) {
    bg = 'linear-gradient(135deg, #0070d2 0%, #003f7a 100%)'
  } else if (name.includes('commbank') || name.includes('cba')) {
    bg = 'linear-gradient(135deg, #ffe000 0%, #799f0c 100%)'
  } else if (name.includes('national australia bank') || name.includes('nab')) {
    bg = 'linear-gradient(135deg, #e4002b 0%, #7d0013 100%)'
  } else if (name.includes('westpac')) {
    bg = 'linear-gradient(135deg, #da291c 0%, #a6192e 100%)'
  } else if (name.includes('anz')) {
    bg = 'linear-gradient(135deg, #007dbd 0%, #004d7c 100%)'
  }

  return (
    <div 
      style={{ 
        margin: '8px 0', 
        width: '120px', 
        height: '76px', 
        borderRadius: '6px', 
        background: bg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '11px',
        textAlign: 'center',
        padding: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
    >
      {product.brand || dataSource.name}
    </div>
  )
}

const render = (product, key) => {
  const premium = renderPremiumField(product, key)
  if (premium !== null) return premium
  switch (key) {
    case 'description':
    case 'brand':
    case 'brandName':
      return product[key]
    case 'lastUpdated':
    case 'effectiveFrom':
    case 'effectiveTo':
      return !!product[key] ? format(product[key]) : ''
    case 'isTailored':
      return product[key] ? 'Yes' : 'No'
    case 'applicationUri':
      return !!product[key] && <a href={product[key]} target='_blank' rel='noopener noreferrer'>Apply here</a>
    case 'additionalInformation':
      return !!product[key] && <AdditionalInfo additionalInfo={product[key]} tableCell/>
    case 'bundles':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
            {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((bundle, index) => <Bundle key={index} bundle={bundle}/>)}
        </ul>
    case 'constraints':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((constraint, index) => <Constraint key={index} constraint={constraint}/>)}
        </ul>
    case 'depositRates':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((depositRate, index) => <DepositRate key={index} depositRate={depositRate}/>)}
        </ul>
    case 'lendingRates':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((lendingRate, index) => <LendingRate key={index} lendingRate={lendingRate}/>)}
        </ul>
    case 'eligibility':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((eligibility, index) =><Eligibility key={index} eligibility={eligibility}/>)}
        </ul>
    case 'features':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].sort((a, b)=>ecomp(a.name, b.name)).map((feature, index) => <Feature key={index} feature={feature}/>)}
        </ul>
    case 'fees':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].filter(fee => fee).sort((a, b)=>ecomp(a.name, b.name)).map((fee, index) => <Fee key={index} fee={fee}/>)}
        </ul>
    case 'cardArt':
      return !!product[key] && product[key].length > 0 &&
        <ul style={{margin: 0, padding:0}}>
          {product[key].map((cardArt, index) => <CardArt key={index} cardArt={cardArt}/>)}
        </ul>
    default:
      return ''
  }
}

const ComparisonPanel = (props) => {
  const {dataSources, products} = props
  const classes = useStyles()
  return (
    !!products && products.length > 0 &&
    <Accordion defaultExpanded className={classes.panel}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls='panel1c-content'
      >
        <div className={classes.heading}>
          <CompareArrowsIcon/><Typography style={{paddingLeft: 8}}>Product Comparison</Typography>
        </div>
      </AccordionSummary>
      <div style={{ maxHeight: 600, overflow: 'auto', width: '100%' }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell width='16%' style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, borderBottom: '2px solid #eee' }}/>
              {products.map((productData, index) =>
                <TableCell key={index} className={classes.headCell} width={`${90/products.length}%`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold' }}>{dataSources[productData.dataSourceIdx].name}</span>
                      {renderCardImage(productData.product, dataSources[productData.dataSourceIdx])}
                      <span style={{ fontSize: '0.85rem', color: '#555' }}>{productData.product.name}</span>
                      {renderCardBadges(productData.product)}
                    </div>
                    <button 
                      onClick={() => props.deselectProduct(productData.dataSourceIdx, productData.product)}
                      style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '0 5px', lineHeight: 1, marginLeft: 8 }}
                      title="Remove from comparison"
                    >
                      ×
                    </button>
                  </div>
                </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {premiumDataKeys.concat(productDataKeys).map(dataKey => (
              <TableRow key={dataKey.key} hover>
                <TableCell component='th' scope='row' align='right' className={classes.dataCell} width='16%' style={{ fontWeight: 'bold' }}>
                  {dataKey.label}
                </TableCell>
                {products.map((productData, index) =>
                  <TableCell key={index} className={classes.dataCell} width={`${90/products.length}%`}>
                    {render(productData.product, dataKey.key)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Accordion>
  )
}

const mapStateToProps = state => {
  const productsWithDetails = state.bankingComparison.map(comp => {
    const listData = state.banking[comp.dataSourceIdx]
    const details = listData && listData.productDetails.find(d => d.productId === comp.product.productId)
    return {
      ...comp,
      product: details || comp.product
    }
  })
  return {
    dataSources: state.dataSources,
    products: productsWithDetails
  }
}

const mapDispatchToProps = { deselectProduct }

export default connect(mapStateToProps, mapDispatchToProps)(ComparisonPanel)
