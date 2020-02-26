import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Demo from './Demo'
import { Location } from '@reach/router'

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'use-interaction')
}

ReactDOM.render(
  <Location>{({ location }) => <Demo location={location} />}</Location>,
  document.getElementById('root')
)
