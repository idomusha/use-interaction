import React from 'react'
import {
  MouseOutlined,
  TouchAppOutlined,
  KeyboardOutlined,
  SwapHoriz,
} from '@material-ui/icons'

import logo from './logo.svg'
import './Reset.scss'
import './Demo.scss'
import useInteraction from './useInteraction'

const Demo = () => {
  const [interaction, history, canHover, accuracy] = useInteraction()

  const handleClick = event => {
    event.preventDefault()
    alert('clicked')
  }

  return (
    <div
      className="Demo"
      data-user-interaction={interaction}
      data-user-can-hover={canHover}
    >
      <header>
        <img src={logo} className="React-logo" alt="logo" />
        <h1>useInteraction</h1>
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
            <code className="variable">interaction</code>
          </strong>{' '}
          provides the actual input used to navigate.
          <br /> <br />
          <strong>
            <code className="variable">history</code>
          </strong>{' '}
          keeps a record of all user interaction types:{' '}
          <i>
            that way a user that interacts both with mouse and touch can easily
            be detected.
          </i>
          <br /> <br />
          <strong>
            <code className="variable">canHover</code>
          </strong>{' '}
          is a shorcut for any type of interaction except mouse:{' '}
          <i>allows to display hidden information to the user in this case.</i>
          <br />
          <br />
          <strong>
            <code className="variable">accuracy</code>
          </strong>{' '}
          is the max size collected of contact geometry of the pointer (by
          interaction type):{' '}
          <i>
            the higher the number, the bigger the button size should be defined.
          </i>
        </p>

        <section id="image">
          <h2>
            w/ <code>canHover</code>
          </h2>
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
          <figure interaction={interaction}>
            <a
              href="https://flic.kr/p/kq58ST"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://farm8.staticflickr.com/7353/12743181443_9dfd24a886_z.jpg"
                alt="Beautiful light"
              />
            </a>
            <figcaption>
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
          </figure>
          <h3>
            It can be used to have different displays depending on whether or
            not the user can hover.
          </h3>
        </section>
        <section id="form">
          <h2>
            w/ <code>interaction</code>
          </h2>
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
            <button onClick={handleClick}>OKAY</button>
          </form>
          <h3>
            It can also help to provide to the user a visual indicator of the
            element that currently has keyboard focus.
            <br />
            <br />
            <i>
              Keyboard strokes has no effect on the interaction type when the
              user is typing in a form element. Only keyboard navigation is
              monitored.
            </i>
          </h3>
        </section>
      </main>
      <footer>
        <code>
          interaction: {interaction || `none`}
          <br />
          history: {`[${history.join(', ')}]`}
          <br />
          can hover: {canHover.toString()}
          <br />
          accuracy: {accuracy || `none`}
        </code>
      </footer>
    </div>
  )
}

export default Demo
