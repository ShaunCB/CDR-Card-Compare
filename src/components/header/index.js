import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    padding: theme.spacing(1.5),
    boxSizing: 'border-box'
  },
  banner: {
    width: '100%',
    maxWidth: '520px',
    height: 'auto',
    display: 'block'
  }
}))

export default function Header(props) {
  const classes = useStyles()
  return (
    <div className={classes.header}>
      <img src={`${import.meta.env.BASE_URL}CDR Card Compare.png`} alt="CDR Card Compare" className={classes.banner} />
    </div>
  )
}
