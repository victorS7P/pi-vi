const { REACT_APP_ENV } = process.env

export const API_URL = {
  development: 'http://localhost:5001',
  production: 'https://35.243.155.76:5001',
}[REACT_APP_ENV]
