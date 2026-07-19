import { sanitizeUrl } from '../../../utils/url';
import React from 'react'

const ExternalLink = ({link, children}) => (
  <a href={sanitizeUrl(link)} target='_blank' rel='noopener noreferrer'>{children}</a>
)

export default ExternalLink
