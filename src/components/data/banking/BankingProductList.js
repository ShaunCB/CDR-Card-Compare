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
        const detail = productDetails && productDetails.find(d => d.productId === product.productId)
        const fullProduct = detail || product
        
        let productCategory = 'Consumer Cards';
        
        const origCat = fullProduct.productCategory || '';
        const nameText = (fullProduct.name || '').toLowerCase();
        const descText = (fullProduct.description || '').toLowerCase();
        
        let isBusiness = origCat === 'BUSINESS_CARDS';
        let isCorporate = origCat === 'CORPORATE_CARDS';
        
        if (nameText.includes('corporate') || descText.includes('corporate') || nameText.includes('commercial') || descText.includes('commercial') || nameText.includes('vpayment')) {
          isCorporate = true;
        } else if (nameText.includes('business') || descText.includes('business')) {
          isBusiness = true;
        }
        
        if (fullProduct.eligibility && Array.isArray(fullProduct.eligibility)) {
          fullProduct.eligibility.forEach(elig => {
            const eligType = (elig.eligibilityType || '').toLowerCase();
            const eligInfo = (elig.additionalInfo || '').toLowerCase();
            const eligValue = (elig.additionalValue || '').toLowerCase();
            if (eligType.includes('business') || eligInfo.includes('business') || eligValue.includes('business')) isBusiness = true;
            if (eligType.includes('corporate') || eligInfo.includes('corporate') || eligValue.includes('corporate') || eligType.includes('commercial') || eligInfo.includes('commercial') || eligValue.includes('commercial')) isCorporate = true;
          });
        }
        
        if (isCorporate) {
          productCategory = 'Corporate Cards';
        } else if (isBusiness) {
          productCategory = 'Business Cards';
        } else if (origCat !== 'CRED_AND_CHRG_CARDS' && origCat !== 'BUSINESS_CARDS' && origCat !== 'CORPORATE_CARDS' && origCat !== '') {
          productCategory = origCat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }

        if (!productsByCategory[productCategory]) {
          productsByCategory[productCategory] = []
        }
        productsByCategory[productCategory].push(fullProduct)
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
            (() => {
              const keys = Object.keys(productsByCategory);
              const targetOrder = ['Consumer Cards', 'Business Cards', 'Corporate Cards'];
              const others = keys.filter(k => !targetOrder.includes(k)).sort();
              const orderedKeys = [...targetOrder, ...others].filter(k => keys.includes(k));
              return orderedKeys.map((category, index) => (
                <ProductCategory key={index} category={category} products={productsByCategory[category]} dataSourceIndex={dataSourceIndex}/>
              ));
            })()
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
