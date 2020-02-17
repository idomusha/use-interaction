import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'

const getKey = event => (event.keyCode ? event.keyCode : event.which)

const getTarget = event => event.target || event.srcElement

const useInteraction = ({ initialHover = false } = {}) => {
  const [interaction, setInteraction] = useState(null)
  const [canHover, setCanHover] = useState(initialHover)
  const [firedEvent, setFiredEvent] = useState({
    touchStart: null,
    mouseMove: null,
    wheel: null,
    keyDown: null,
  })
  const [history, setHistory] = useState([])
  const [prevInteraction, setPrevInteraction] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const inputs = ['input', 'select', 'textarea']
  const keys = {
    9: 'tab',
    13: 'enter',
    16: 'shift',
    27: 'esc',
    32: 'space',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left arrow',
    38: 'up arrow',
    39: 'right arrow',
    40: 'down arrow',
  }

  const handleInteractionTouch = useCallback(() => {
    setFiredEvent(current => ({
      ...current,
      touchStart: true,
      mouseMove: false,
    }))

    setHistory([...new Set([...history, 'touch'])])
    setInteraction('touch')
    setCanHover(false)
  }, [history, setHistory])

  const handleInteractionMouse = useCallback(
    event => {
      // prevent false positive on mousemove with touch devices
      if (!firedEvent.touchStart) {
        setFiredEvent(current => ({
          ...current,
          ...(event.type === 'mousemove' && { mouseMove: true }),
          ...(event.type === 'wheel' && { wheel: true }),
        }))
      }

      // prevent false positive on mousemove when navigate with keyboard
      if (firedEvent.keyDown) {
        setFiredEvent(current => ({
          ...current,
          mouseMove: false,
        }))
      }

      setFiredEvent(current => ({
        ...current,
        // prevent false positive on mousemove with touch devices
        touchStart: false,
        // prevent false positive on mousemove when navigate with keyboard
        keyDown: false,
      }))

      if (
        firedEvent.mouseMove === null ||
        firedEvent.mouseMove === true ||
        firedEvent.touchStart === false
      ) {
        setHistory([...new Set([...history, 'mouse'])])
        setInteraction('mouse')
        setCanHover(true)
      }
    },
    [
      firedEvent.touchStart,
      firedEvent.keyDown,
      firedEvent.mouseMove,
      setHistory,
      history,
    ]
  )

  const handleInteractionKeyboard = useCallback(
    event => {
      if (
        // if the key is a accessible key
        Object.prototype.hasOwnProperty.call(keys, getKey(event))
      ) {
        if (
          // if the key is `TAB`
          keys[getKey(event)] !== 'tab' &&
          // only if the target is one of the elements in `inputs` list
          inputs.indexOf(getTarget(event).nodeName.toLowerCase()) >= 0
        ) {
          // ignore navigation keys typing on form elements
          return
        }

        // some pressed keys causes an event mousemove
        setFiredEvent(current => ({
          ...current,
          keyDown: true,
          mouseMove: false,
          wheel: false,
        }))

        if (interaction === 'keyboard') return

        setHistory([...new Set([...history, 'keyboard'])])
        setInteraction('keyboard')
        setCanHover(false)
      }
    },
    [keys, inputs, interaction, setHistory, history]
  )

  const handleInteractionPointer = useCallback(
    event => {
      const nextAccuracy = round(event.height, 1)
      if (nextAccuracy > accuracy || prevInteraction !== event.pointerType) {
        setAccuracy(nextAccuracy)
      }
      setPrevInteraction(event.pointerType)
    },
    [accuracy, prevInteraction, setAccuracy, setPrevInteraction]
  )

  useEffect(() => {
    window.addEventListener('touchstart', handleInteractionTouch, false)
    if (firedEvent.mouseMove || firedEvent.wheel) {
      window.removeEventListener('mousemove', handleInteractionMouse, false)
      window.removeEventListener('wheel', handleInteractionMouse, false)
    } else {
      window.addEventListener('mousemove', handleInteractionMouse, false)
      window.addEventListener('wheel', handleInteractionMouse, false)
    }
    window.addEventListener('keydown', handleInteractionKeyboard, false)
    window.addEventListener('pointerdown', handleInteractionPointer, false)

    return () => {
      window.removeEventListener('touchstart', handleInteractionTouch, false)
      window.removeEventListener('mousemove', handleInteractionMouse, false)
      window.removeEventListener('wheel', handleInteractionMouse, false)
      window.removeEventListener('keydown', handleInteractionKeyboard, false)
      window.removeEventListener('pointerdown', handleInteractionPointer, false)
    }
  }, [
    firedEvent.mouseMove,
    firedEvent.wheel,
    handleInteractionTouch,
    handleInteractionMouse,
    handleInteractionKeyboard,
    handleInteractionPointer,
  ])

  return [interaction, history, canHover, accuracy]
}

useInteraction.propTypes = {
  initialHover: PropTypes.boolean,
}

export default useInteraction
