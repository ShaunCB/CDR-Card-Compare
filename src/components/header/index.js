import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    '@media (prefers-color-scheme: dark)': {
      backgroundColor: '#1e293b',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(51, 65, 85, 0.8)',
    }
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  banner: {
    width: '100%',
    // Increased by 25% (from 384px to 480px) per user request to safely scale up the image 
    // while perfectly preserving aspect ratio and Flexbox alignment.
    maxWidth: '480px',
    height: 'auto',
    display: 'block'
  },
  techBadge: {
    backgroundColor: '#ff4d4f',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }
}));

export default function Header(props) {
  const classes = useStyles();
  
  // Cache-busting string remains to ensure we see the latest assets
  const assetVersion = "?v=1.1";

  return (
    <div className={classes.header}>
      <div className={classes.topRow}>
        <picture>
          <source 
            media="(prefers-color-scheme: dark)" 
            srcSet={`${import.meta.env.BASE_URL}opencard-au-dark-mode.webp${assetVersion}`} 
          />
          <img 
            src={`${import.meta.env.BASE_URL}opencard-au.webp${assetVersion}`} 
            alt="OpenCard AU Logo" 
            className={classes.banner} 
          />
        </picture>
        <span className={classes.techBadge}>TECH DEMO</span>
      </div>
    </div>
  );
}
