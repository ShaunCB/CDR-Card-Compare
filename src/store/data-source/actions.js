export const LOAD_DATA_SOURCE = 'LOAD_DATA_SOURCE'
export const ADD_DATA_SOURCE = 'ADD_DATA_SOURCE'
export const SYNC_DATA_SOURCES = 'SYNC_DATA_SOURCES'
export const SAVE_DATA_SOURCE = 'SAVE_DATA_SOURCE'
export const DELETE_DATA_SOURCE = 'DELETE_DATA_SOURCE'
export const MODIFY_DATA_SOURCE_NAME = 'MODIFY_DATA_SOURCE_NAME'
export const MODIFY_DATA_SOURCE_URL = 'MODIFY_DATA_SOURCE_URL'
export const MODIFY_DATA_SOURCE_ENERGY_PRD_URL = 'MODIFY_DATA_SOURCE_ENERGY_PRD_URL'
export const MODIFY_DATA_SOURCE_ICON = 'MODIFY_DATA_SOURCE_ICON'
export const ENABLE_DATA_SOURCE = 'ENABLE_DATA_SOURCE'

const sortDatasourcesByRank = (datasources) => {
  return [...datasources].sort((a, b) => a.name.localeCompare(b.name))
}

const MAJOR_NAMES = {'ANZ': [], 'CommBank': ['CBA', 'Commonwealth Bank'], 'NATIONAL AUSTRALIA BANK': ['NAB', 'National'], 'Westpac': []}
const MAJORS = Object.keys(MAJOR_NAMES)

function mergeDatasources(into, from) {
  const result = {};
  into.forEach(ds => result[ds.name] = ds)
  from.forEach(ds => {
    const {name} = ds
    if (MAJORS.includes(name)) {
      // Consolidate the aliases of the Big Four
      MAJOR_NAMES[name].forEach(alias => {
        result[name] = {...result[alias], ...result[name]}
        delete result[alias]
      })
    }
    result[name] = {...result[name], ...ds}
  })
  return Object.values(result)
}

function fetchDatasources() {
  const dssPromise = fetch(import.meta.env.BASE_URL + 'datasources.json')
    .then(response => response.json())
    .catch(() => {
      return fetch('https://api.cdr.gov.au/cdr-register/v1/all/data-holders/brands/summary', {headers: {"x-v": 1}})
        .then(response => response.json())
        .then(({data}) => data.map(({brandName: name, publicBaseUri: url, logoUri: icon, industries: sectors}) => ({name, url, icon, sectors})))
    })
  const ovsPromise = fetch(import.meta.env.BASE_URL + 'override.json')
    .then(response => response.json())
    .catch(() => [])
  return Promise.all([dssPromise, ovsPromise]).then(([datasources, overrides]) =>
    mergeDatasources(datasources, overrides)
  )
}

function loadLocalDatasources() {
  const ds = window.localStorage.getItem("cds-banking-prd-ds")
  return ds ? JSON.parse(ds) : false
}



export function loadDataSource() {
  let ds = loadLocalDatasources()

  const ensureCustomBrands = (array) => {
    if (!array.some(d => d.name === 'Latitude Credit Cards')) {
      array.push({
        name: 'Latitude Credit Cards',
        url: 'https://api.productcloud.com.au/public/LATITUDECARDS',
        icon: 'https://images.ctfassets.net/w0q68lqdeo57/yXPxCYiHJucDHSI6nTDNX/7656c648c094e8bfff54ef7a2b5f9dea/Latitude_primary-logo_indigo_RGB.png',
        sectors: ['non-bank-lending']
      })
    }
    if (!array.some(d => d.name === 'American Express')) {
      array.push({
        name: 'American Express',
        url: 'https://apigw.americanexpress.com/cdr/unauth/cds-au/v1',
        icon: 'https://www.aexp-static.com/cdaas/one/statics/axp-static-assets/1.8.0/package/dist/img/logos/dls-logo-bluebox-solid.svg',
        sectors: ['banking']
      })
    }
    return array
  }

  if (ds) {
    ds = ensureCustomBrands(ds)
    ds = sortDatasourcesByRank(ds)
    const rank = ['American Express', 'Latitude Credit Cards', 'CommBank', 'NATIONAL AUSTRALIA BANK', 'Westpac']
    ds.forEach(d => {
      if (rank.includes(d.name)) {
        d.enabled = true
      }
    })
  }
  return {
    type: LOAD_DATA_SOURCE,
    payload: ds ? Promise.resolve(ds) : fetchDatasources()
      .then(datasources => {
        datasources = ensureCustomBrands(datasources)
        datasources = sortDatasourcesByRank(datasources)
        const defaultBrands = ['American Express', 'Latitude Credit Cards', 'CommBank', 'NATIONAL AUSTRALIA BANK', 'Westpac']
        datasources.forEach(d => {
          if (defaultBrands.includes(d.name)) {
            d.enabled = true
          }
        })
        return datasources
      })
  }
}

export function addDataSource() {
  return {
    type: ADD_DATA_SOURCE
  }
}

export function syncDataSources() {
  return {
    type: SYNC_DATA_SOURCES,
    payload: fetchDatasources().then(datasources => {
      const localDatasources = loadLocalDatasources()
      const merged = localDatasources ? mergeDatasources(localDatasources, datasources) : datasources
      return sortDatasourcesByRank(merged)
    })
  }
}

export function saveDataSource(index, payload) {
  return {
    type: SAVE_DATA_SOURCE,
    index: index,
    payload: payload
  }
}

export function deleteDataSource(index) {
  return {
    type: DELETE_DATA_SOURCE,
    index: index
  }
}

export function modifyDataSourceName(index, payload) {
  return {
    type: MODIFY_DATA_SOURCE_NAME,
    index: index,
    payload: payload
  }
}

export function modifyDataSourceUrl(index, payload) {
  return {
    type: MODIFY_DATA_SOURCE_URL,
    index: index,
    payload: payload
  }
}

export function modifyDataSourceEnergyPrdUrl(index, payload) {
  return {
    type: MODIFY_DATA_SOURCE_ENERGY_PRD_URL,
    index: index,
    payload: payload
  }
}

export function modifyDataSourceIcon(index, payload) {
  return {
    type: MODIFY_DATA_SOURCE_ICON,
    index: index,
    payload: payload
  }
}

export function enableDataSource(index, payload) {
  return {
    type: ENABLE_DATA_SOURCE,
    index: index,
    payload: payload
  }
}
