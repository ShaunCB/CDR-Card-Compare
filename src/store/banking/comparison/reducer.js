import { COMPARE_PRODUCTS } from './actions'
import { DESELECT_BANKING_PRODUCT } from '../selection/actions'

export default function bankingComparison(state=[], action) {
  if (action.type === COMPARE_PRODUCTS) {
    return [...action.payload]
  } else if (action.type === DESELECT_BANKING_PRODUCT) {
    const { dataSourceIdx, product } = action.payload;
    return state.filter(comp => !(comp.dataSourceIdx === dataSourceIdx && comp.product.productId === product.productId));
  } else {
    return state
  }
}
