import {conoutHtmlError, conoutError} from '../store/conout/actions'

export function createConoutError(error, url) {
  return conoutError('Caught ' + error + ' while requesting ' + url + (error.name === 'TypeError' ?
    ' Possibly caused by the endpoint not supporting Cross-Origin Requests (CORS)' : ''))
}

export function checkExposedHeaders(response, fullUrl, dispatch) {
  try {
    if (!response.headers || !response.headers.get('x-v')) {
      const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
      )
      const safeUrl = escapeHTML(fullUrl)
      const plainMsg = `Response for ${fullUrl}: doesn't expose header x-v: possibly caused by incomplete `
      const htmlMsg = `Response for ${safeUrl}: doesn't expose header x-v: possibly caused by incomplete `
      const corsSupport = 'CORS support'
      dispatch(conoutHtmlError(
        plainMsg + corsSupport,
        `${htmlMsg}<a href="https://cdr-support.zendesk.com/hc/en-us/articles/900003054706-CORS-support" target="_blank">${corsSupport}</a>`
      ))
    }
  } catch (error) {
    // Ignore CORS header extraction exceptions and continue
  }
}
