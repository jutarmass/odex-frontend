let ENGINE_HTTP_URL, ENGINE_WS_URL, DEFAULT_NETWORK_ID, MIXPANEL_TOKEN

if (window.env) {
  // ENGINE_HTTP_URL = '/engine'
  // ENGINE_WS_URL = 'ws/engine'
  ENGINE_HTTP_URL = window.env.REACT_APP_ENGINE_HTTP_URL
  ENGINE_WS_URL = window.env.REACT_APP_ENGINE_WS_URL
  DEFAULT_NETWORK_ID = window.env.REACT_APP_DEFAULT_NETWORK_ID
  MIXPANEL_TOKEN = window.env.REACT_APP_MIXPANEL_TOKEN

} else {
  ENGINE_HTTP_URL = process.env.REACT_APP_ENGINE_HTTP_URL
  ENGINE_WS_URL = process.env.REACT_APP_ENGINE_WS_URL
  MIXPANEL_TOKEN = '0x'
  DEFAULT_NETWORK_ID = process.env.REACT_APP_DEFAULT_NETWORK_ID || 'default'
}

export const MATCHER_FEE = 0.001;

export {
  ENGINE_HTTP_URL,
  ENGINE_WS_URL,
  DEFAULT_NETWORK_ID,
  MIXPANEL_TOKEN
}

export const EXCHANGE_ADDRESS = {
  'livenet': 'T2G5GDEMTKWJYPTHJ73KQAPUEUU4WJL7', 
  'testnet': 'T2G5GDEMTKWJYPTHJ73KQAPUEUU4WJL7',
}[DEFAULT_NETWORK_ID]
