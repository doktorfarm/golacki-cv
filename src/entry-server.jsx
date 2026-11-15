// Build-time rendering (SSG): the page ships as real HTML, React hydrates it afterwards.
import { renderToString } from 'react-dom/server'
import App from './App'
import * as data from './data'

export const render = () => renderToString(<App />)
export { data }
