import { COMPARE_PRODUCTS } from './actions'
import { DESELECT_BANKING_PRODUCT } from '../selection/actions'

export default function bankingComparison(state=[], action) {
  if (action.type === COMPARE_PRODUCTS) {
    return [...action.payload]
  } else {
    return state
  }
}
