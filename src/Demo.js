import React, { useState, useLayoutEffect, useRef } from 'react'
import {
  MouseOutlined,
  TouchAppOutlined,
  KeyboardOutlined,
  SwapHoriz,
} from '@material-ui/icons'
import { navigate } from '@reach/router'

import useInteraction from './useInteraction'

import logo from './logo.svg'
import './Reset.scss'
import './Demo.scss'
import Styled from './Demo.styles'

const Demo = ({ location }) => {
  const [pointerType, pointerHistory, pointerAccuracy] = useInteraction({
    initial: null,
  })
  const [hover, setHover] = useState(false)
  const [imageHeight, setImageHeight] = useState(null)
  const [figcaptionHeight, setFigcaptionHeight] = useState(null)
  const imageRef = useRef(null)
  const figcaptionRef = useRef(null)

  const updateFigureSize = () => {
    setImageHeight(imageRef.current.offsetHeight)
    setFigcaptionHeight(figcaptionRef.current.offsetHeight)
  }

  useLayoutEffect(() => {
    let img = new Image()
    img.src = imageRef.current.src
    img.onload = () => {
      updateFigureSize()
    }

    window.addEventListener('resize', updateFigureSize)
    return () => window.removeEventListener('resize', updateFigureSize)
  }, [])

  const handleClick = event => {
    event.preventDefault()
    alert('clicked')
  }

  const handleNavigate = () => {
    alert('navigated')
    navigate(location.pathname, {
      state: {
        page: {},
      },
      replace: true,
    })
  }

  const toggleHover = event => {
    pointerType === 'mouse' && setHover(current => !current)
  }

  return (
    <Styled.Demo
      className="Demo"
      pointer={pointerType}
      data-user-interaction={pointerType}
      data-user-can-hover={pointerType === 'mouse'}
    >
      <header>
        <img src={logo} className="React-logo" alt="logo" />
        <h1 onClick={handleNavigate}>useInteraction</h1>
      </header>
      <main>
        <h3>
          React hook <code>useInteraction()</code> allows to get the user
          interaction type: <code>touch</code>, <code>mouse</code> or{' '}
          <code>keyboard</code>.
          <br />
        </h3>
        <p>
          <strong>
            <code className="variable">pointerType</code>
          </strong>{' '}
          provides the current input of the user interaction.
          <br /> <br />
          <strong>
            <code className="variable">pointerHistory</code>
          </strong>{' '}
          keeps a record of previous inputs of the user interaction listed in
          reverse chronological order.
          <br /> <br />
          <strong>
            <code className="variable">pointerAccuracy</code>
          </strong>{' '}
          is the max size of contact geometry collected from the current
          pointer.
          <br />
          [Experimental Feature]{' '}
          <i>
            Not all browsers yet support{' '}
            <a
              href="https://caniuse.com/#feat=pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pointer events
            </a>
          </i>
        </p>

        <section id="image">
          <h2>detect hover capability</h2>
          <div>
            <MouseOutlined /> <SwapHoriz /> <TouchAppOutlined />
            <br />
            <span>
              switching between <code>mouse</code>/<code>touch</code> or{' '}
              <code>mouse</code>/<code>keyboard</code> will show/hide the figure
              caption
            </span>
            <br />
            <MouseOutlined /> <SwapHoriz /> <KeyboardOutlined />
          </div>
          <Styled.Figure
            pointer={pointerType}
            size={[imageHeight, figcaptionHeight]}
          >
            <a
              href="https://flic.kr/p/kq58ST"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                ref={imageRef}
                src="https://farm8.staticflickr.com/7353/12743181443_9dfd24a886_z.jpg"
                alt="Beautiful light"
              />
            </a>
            <figcaption ref={figcaptionRef}>
              <h3>
                <a
                  href="https://flic.kr/p/kq58ST"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Beautiful light
                </a>{' '}
                (CC BY-NC-ND 2.0)
              </h3>
              <small>
                by{' '}
                <a
                  href="https://www.flickr.com/people/rfunnell/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ross Funnell
                </a>
              </small>
              <p className="description">
                The room was vacant except for a metal slab that served as a bed
                and the six-legged, cat-like creature sitting on the edge of the
                bed watching its sleeping occupant.
              </p>
            </figcaption>
          </Styled.Figure>
          <h3>
            It can be used to present to the user actions and information behind
            hover states; in place of the hover CSS media feature{' '}
            <code>@media (hover: hover)</code>, not supported by all browsers.
          </h3>
        </section>
        <section id="form">
          <h2>detect keyboard navigation</h2>
          <div>
            <MouseOutlined /> <SwapHoriz /> <KeyboardOutlined />
            <br />
            <span>
              switching between <code>mouse</code>/<code>keyboard</code> will
              show/hide an outline around the focused element
            </span>
          </div>
          <form>
            <input type="text" />
            <select>
              <option value=""></option>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
            <textarea />
            <div>{hover ? `hovered` : `-`}</div>
            <button
              onClick={handleClick}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
            >
              OKAY
            </button>
          </form>
          <h3>
            It can also help to provide the keyboard users with a visual
            indicator of the element (link, button, and form control) that
            currently has focus.
            <br />
            <br />
            <i>
              Keyboard strokes has no effect on the interaction type when the
              user is typing in a form element (input, select, and textarea).
              Only keyboard navigation is monitored.
            </i>
          </h3>
        </section>
      </main>
      <footer>
        <code>
          pointer: {pointerType || `none`} (can
          {pointerType !== 'mouse' && 'not'} hover)
          <br />
          history: {`[${pointerHistory.join(', ')}]`}
          <br />
          accuracy: {pointerAccuracy || `none`}
          <br />
        </code>
      </footer>
    </Styled.Demo>
  )
}

export default Demo
