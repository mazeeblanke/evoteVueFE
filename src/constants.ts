
export const clBaseURL = 'https://res.cloudinary.com/dpisximfc/image/upload/w_120,h_120,c_fill,g_auto,q_auto,f_auto/'

export const baseUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:7777/api`
  : 'https://arcane-refuge-82130.herokuapp.com/public/api'


export const CAMPAIGN_ENDPOINT_URL = '/campaigns'

export const USER_ENDPOINT_URL = '/users'
