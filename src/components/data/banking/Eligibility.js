import { sanitizeUrl } from '../../../utils/url';
import React from 'react'
import {translateEligibilityType} from '../../../utils/dict'

const Eligibility = (props) => {
  const {eligibilityType, additionalValue, additionalInfo, additionalInfoUri} = props.eligibility
  return (
    <li>
      <div>
        {translateEligibilityType(eligibilityType)}
        {eligibilityType === 'OTHER' && <span> - {additionalInfo}</span>}
        {
          ( eligibilityType === 'MIN_AGE' ||
            eligibilityType === 'MAX_AGE' ||
            eligibilityType === 'EMPLOYMENT_STATUS' ||
            eligibilityType === 'RESIDENCY_STATUS') &&
          <span> - {additionalValue}</span>
        }
        {
          ( eligibilityType === 'BUSINESS' ||
            eligibilityType === 'PENSION_RECIPIENT' ||
            eligibilityType === 'STAFF' ||
            eligibilityType === 'STUDENT' ||
            eligibilityType === 'NATURAL_PERSON') && !!additionalValue &&
          <span> - {additionalValue}</span>
        }
        {
          ( eligibilityType === 'BUSINESS' ||
            eligibilityType === 'PENSION_RECIPIENT' ||
            eligibilityType === 'STAFF' ||
            eligibilityType === 'STUDENT' ||
            eligibilityType === 'NATURAL_PERSON') && !!additionalInfo &&
          <div>{additionalInfo}</div>
        }
        {(eligibilityType === 'MIN_INCOME' || eligibilityType === 'MIN_TURNOVER') && <span> - ${additionalValue}</span>}
      </div>
      {(!!additionalInfo || !!additionalInfoUri || !!additionalValue) && (
        <details style={{ marginTop: '4px', fontSize: '0.8rem', cursor: 'pointer', color: '#666' }}>
          <summary style={{ fontWeight: '500', outline: 'none' }}>Additional Eligibility Details</summary>
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
    </li>
  )
}

export default Eligibility
