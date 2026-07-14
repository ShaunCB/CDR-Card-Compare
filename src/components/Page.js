import React from 'react'
import DataSourcePanel from './data-source/DataSourcePanel'
import BankingPanel from './data/banking/BankingPanel'
import ConsolePanel from './data/ConsolePanel'
import Header from './header'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import BankingComparisonPanel from './comparison/BankingComparisonPanel'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DiscoveryInfo from './data/discovery/DiscoveryInfo'

const useStyles = makeStyles(theme => ({
  hidden: {
    display: 'none'
  }
}))
  
function Page() {
  const [value, setValue] = React.useState(0)
  const classes = useStyles()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Container maxWidth={false}>
      <Header title='Card Comparator Prime'/>
      <AppBar position="static" style={{marginTop: 8, marginBottom: 8}}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Credit & Charge Cards" />
          <Tab label="Status and Outages" />
        </Tabs>
      </AppBar>
      <div className={value === 0 ? '' : classes.hidden}>
        <BankingPanel/>
        <BankingComparisonPanel/>
      </div>
      <div className={value === 1 ? '' : classes.hidden}>
        <DiscoveryInfo/>
      </div>
      <div style={{ marginTop: 24 }}>
        <DataSourcePanel/>
      </div>
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <ConsolePanel/>
      </div>
    </Container>
  );
}

export default Page;
