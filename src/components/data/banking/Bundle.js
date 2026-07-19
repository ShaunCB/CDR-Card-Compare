import { sanitizeUrl } from '../../../utils/url';
import React from 'react'

const Bundle = (props) => {
  const {bundle} = props
  return (
    <li>
      <div>{bundle.name}</div>
      <div>{bundle.description}</div>
      {!!bundle.additionalInfo && <div>{bundle.additionalInfo}</div>}
      {!!bundle.additionalInfoUri && <div><a href={sanitizeUrl(bundle.additionalInfoUri)} target='_blank' rel='noopener noreferrer'>More info</a></div>}
    </li>
  )
}

export default Bundle
