import { sanitizeUrl } from '../../../utils/url';
import React from 'react'
import FeeDiscount from './FeeDiscount'
import Duration from '../Duration'
import {translateFeeType} from '../../../utils/dict'
import {makeStyles} from '@material-ui/core'
import ecomp from '../../../utils/enum-comp'
import {isDuration} from '../../../utils/datetime'

const useStyles = makeStyles(() => ({
  sectionTitle: {
    fontStyle: 'italic'
  },
  sectionContent: {
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 20
  }
}))

const Fee = (props) => {
  const classes = useStyles()
  const fee = props.fee
  const {
    name,
    feeType,
    accrualFrequency,
    currency,
    additionalValue,
    additionalInfo,
    additionalInfoUri,
    discounts
  } = fee

  let amount = fee.amount
  if (amount === undefined || amount === null) {
    if (fee.fixedAmount && fee.fixedAmount.amount !== undefined && fee.fixedAmount.amount !== null) {
      amount = fee.fixedAmount.amount
    }
  }

  let balanceRate = fee.balanceRate
  let transactionRate = fee.transactionRate
  let accruedRate = fee.accruedRate

  if (fee.rateBased) {
    const rate = fee.rateBased.rate
    const rateType = fee.rateBased.rateType
    if (rateType === 'BALANCE') {
      if (balanceRate === undefined || balanceRate === null) balanceRate = rate
    } else if (rateType === 'TRANSACTION') {
      if (transactionRate === undefined || transactionRate === null) transactionRate = rate
    } else {
      if (accruedRate === undefined || accruedRate === null) accruedRate = rate
    }
  }
  return (
    <li>
      <div>
        {name}
        {!!amount && <span> - ${amount}</span>}
        {!!balanceRate && <span> - {(balanceRate * 100).toFixed(2)}%</span>}
        {!!transactionRate && <span> - {(transactionRate * 100).toFixed(2)}%</span>}
        {!!accruedRate && <span> - {(accruedRate * 100).toFixed(2)}%</span>}
        {!!accrualFrequency && <span> - <Duration prefix="every" value={accrualFrequency}/></span>}
      </div>
      <div>
        Fee Type - {translateFeeType(feeType)}
        {feeType === 'PERIODIC' && <span> - <Duration prefix="every" value={additionalValue}/></span>}

      </div>
      {!!currency && <div>Currency - {currency}</div>}
      {
        feeType !== 'PERIODIC' && !!additionalValue && 
        <div>
          {isDuration(additionalValue) ? <><Duration prefix="every" value={additionalValue}/></> : additionalValue}
        </div>}
      {(!!additionalInfo || !!additionalInfoUri || !!additionalValue) && (
        <details style={{ marginTop: '4px', fontSize: '0.8rem', cursor: 'pointer', color: '#666' }}>
          <summary style={{ fontWeight: '500', outline: 'none' }}>Additional Fee Details</summary>
          <div style={{ padding: '4px 8px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginTop: '2px' }}>
            {!!additionalValue && <div>Value: <strong>{additionalValue}</strong></div>}
            {!!additionalInfo && <div>Info: {additionalInfo}</div>}
            {!!additionalInfoUri && (
              <div>
                <a href={sanitizeUrl(additionalInfoUri)} target='_blank' rel='noopener noreferrer' style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Read official guidelines
                </a>
              </div>
            )}
          </div>
        </details>
      )}
      {
        !!discounts && discounts.length > 0 &&
          <div>
            <div className={classes.sectionTitle}>Discounts:</div>
            <ul className={classes.sectionContent}>
              {discounts.sort((a, b)=>ecomp(a.discountType, b.discountType)).map(
                (discount, index) =><FeeDiscount key={index} discount={discount}/>)}
            </ul>
          </div>
      }
    </li>
  )
}

export default Fee
