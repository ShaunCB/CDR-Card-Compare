import React from 'react'
import { pattern } from 'iso8601-duration'
import { parseDurationText } from '../../utils/datetime'

const Duration = props => {
  const { prefix, value } = props
  if (!value || value.length === 0) {
    return false
  }
  if (!pattern.test(value)) {
    return <span>{value}</span>
  }
  return <span>{prefix ? prefix + ' ' : ''}{parseDurationText(value)}</span>
}

export default Duration
