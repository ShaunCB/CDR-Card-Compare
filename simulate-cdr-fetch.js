const assert = require('assert');

// Mock data structures
const mockState = {
  banking: [
    {
      products: [
        {
          productId: 'amex-gold-card',
          name: 'Amex Gold Card',
          brand: 'American Express',
          description: 'Premium charge card',
          productCategory: 'CRED_AND_CHRG_CARDS',
          lastUpdated: '2026-07-12',
          brandName: 'Amex',
          applicationUri: 'https://amex.com',
          isTailored: false,
          additionalInformation: {}
        }
      ],
      productDetails: []
    }
  ]
};

const mockGetState = () => mockState;
const dispatchedActions = [];
const mockDispatch = (action) => {
  if (typeof action === 'function') {
    return action(mockDispatch, mockGetState);
  }
  dispatchedActions.push(action);
  return action;
};

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

// System test logic matching our actions.js retrieveProductDetail logic
function retrieveProductDetail(dataSourceIdx, url, productId) {
  return (dispatch, getState) => {
    const fullUrl = url + '/banking/products/' + encodeRFC3986URIComponent(productId);
    
    const request = new Request(fullUrl, {
      headers: new Headers({
        'x-v': '7',
        'x-min-v': '1',
        'Accept': 'application/json'
      })
    });

    return fetch(request)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Response not OK. Status: ${response.status} (${response.statusText})`);
      })
      .then(json => {
        const { productDetails } = getState().banking[dataSourceIdx];
        const { data } = json;
        if (productDetails.some(prod => prod.productId === data.productId)) {
          return { idx: dataSourceIdx, response: null };
        }
        return { idx: dataSourceIdx, response: json };
      })
      .catch(error => {
        const bankingState = getState().banking[dataSourceIdx];
        const summaryProduct = bankingState && bankingState.products && bankingState.products.find(p => p.productId === productId);
        if (summaryProduct) {
          const stubbedDetail = {
            data: {
              productId: summaryProduct.productId,
              name: summaryProduct.name,
              brand: summaryProduct.brand,
              description: summaryProduct.description,
              productCategory: summaryProduct.productCategory || 'CRED_AND_CHRG_CARDS',
              features: [{ featureType: 'OTHER', additionalInfo: 'See Provider Website' }],
              fees: [{ name: 'Details Unavailable (CORS/Preflight Mismatch)', feeType: 'EVENT', additionalInfo: 'See Provider Website' }],
              lendingRates: [{ rate: 0.0, lendingRateType: 'VARIABLE', additionalInfo: 'See Provider Website' }],
              depositRates: [],
              constraints: [],
              eligibility: []
            }
          };
          return { idx: dataSourceIdx, response: stubbedDetail };
        }
        return { idx: dataSourceIdx, response: null };
      });
  };
}

// Test Runner
async function runTests() {
  console.log('Running CDR fetching simulation tests...');

  // PROFILE A: Valid payload but no x-v header (CORS mask)
  global.fetch = async (req) => {
    assert.strictEqual(req.headers.get('x-v'), '7');
    assert.strictEqual(req.headers.get('x-min-v'), '1');
    assert.strictEqual(req.headers.get('Accept'), 'application/json');
    return {
      ok: true,
      headers: new Map(), // No x-v returned in headers (CORS masked)
      json: async () => ({
        data: {
          productId: 'amex-gold-card',
          name: 'Amex Gold Card',
          brand: 'American Express',
          features: [{ featureType: 'OTHER', additionalInfo: 'Direct' }]
        }
      })
    };
  };

  const actionA = retrieveProductDetail(0, 'https://apigw.americanexpress.com/cdr/unauth', 'amex-gold-card');
  const resultA = await mockDispatch(actionA);
  assert.ok(resultA.response);
  assert.strictEqual(resultA.response.data.productId, 'amex-gold-card');
  console.log('PROFILE A (CORS masked headers) test passed!');

  // PROFILE B: HTTP 406 response
  global.fetch = async (req) => {
    return {
      ok: false,
      status: 406,
      statusText: 'Not Acceptable'
    };
  };

  const actionB = retrieveProductDetail(0, 'https://apigw.americanexpress.com/cdr/unauth', 'amex-gold-card');
  const resultB = await mockDispatch(actionB);
  assert.ok(resultB.response);
  // Ensure stub fallback is applied
  assert.deepStrictEqual(resultB.response.data.features, [{ featureType: 'OTHER', additionalInfo: 'See Provider Website' }]);
  console.log('PROFILE B (406 Status fallback) test passed!');
  console.log('All simulation tests passed perfectly!');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
