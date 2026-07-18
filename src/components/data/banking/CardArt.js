import React from 'react'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles(() => ({
  cardArt: {
    display: 'table-row',
    '& img': {
    maxWidth: 100,
    maxHeight: 100,
    display: 'table-cell',
    verticalAlign: 'middle',
    paddingRight: 5
    },
    '& span': {
    display: 'table-cell',
    verticalAlign: 'middle'
    }
  }
}))

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

function CardArt(props) {
  const {cardArt, dataSource} = props
  const classes = useStyles()
  const imageUri = resolveImageUri(cardArt.imageUri, dataSource)
  
  return (
    <li>
      {!!cardArt.title && <div>{cardArt.title}</div>}
      <div>
        <a className={classes.cardArt} href={imageUri} target="_blank" rel="noopener noreferrer">
          <img src={imageUri} alt=""/>
          <span>{imageUri}</span>
        </a>
      </div>
    </li>
  )
}

export default CardArt