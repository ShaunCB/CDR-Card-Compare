import React from 'react'
import {connect} from 'react-redux'
import {START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList} from '../../../store/banking/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import ProductCategory from './ProductCategory'
import {normalise} from '../../../utils/url'

class BankingProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: ''
    }
  }

  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const { url } = dataSource
    const normalisedUrl = normalise(url)
    const productListUrl = normalisedUrl + '/banking/products'
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, normalisedUrl, productListUrl, versionInfo.xV, versionInfo.xMinV)
  }

  render() {
    const { dataSourceIndex } = this.props
    const { searchQuery } = this.state
    let productList = this.props.productList[dataSourceIndex];
    productList = !!productList ? productList : {}
    const { progress, loading, products, productDetails } = productList
    const productsByCategory = {}
    
    if (!!products && !loading) {
      const filteredProducts = products.filter(product => 
        product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      filteredProducts.forEach(product => {
        let productCategory = "Consumer Credit Cards";
        const n = (product.name || '').toLowerCase();
        if (n.includes('business')) {
          productCategory = 'Small Business Cards';
        } else if (n.includes('corporate') || n.includes('commercial')) {
          productCategory = 'Corporate Cards';
        }
        if (!productsByCategory[productCategory]) {
          productsByCategory[productCategory] = []
        }
        const detail = productDetails && productDetails.find(d => d.productId === product.productId)
        productsByCategory[productCategory].push(detail || product)
      })
    }

    return (
      <div>
        {
          !loading && !!products && products.length > 0 &&
          <div style={{ marginBottom: '8px', paddingRight: '7%' }}>
            <input 
              type="text" 
              placeholder="Search cards..." 
              value={searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #d9d9d9',
                fontSize: '0.8rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        }
        <div style={{maxHeight: 300, overflow: 'auto'}}>
          {
            loading &&
            <LinearProgress style={{width: '93%'}} />
          }
          {
            progress === START_RETRIEVE_PRODUCT_LIST && loading && <p>Getting all current products...</p>
          }
          {
            !loading && !!products &&
            Object.keys(productsByCategory).sort().map((category, index) => (
              <ProductCategory key={index} category={category} products={productsByCategory[category]} dataSourceIndex={dataSourceIndex}/>
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  productList: state.banking,
  versionInfo: state.versionInfo.vHeaders
})

const mapDispatchToProps = {startRetrieveProductList, retrieveProductList}

export default connect(mapStateToProps, mapDispatchToProps)(BankingProductList)
