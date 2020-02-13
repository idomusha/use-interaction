import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'

let history = []

const getKey = event => (event.keyCode ? event.keyCode : event.which)

const getTarget = event => event.target || event.srcElement

const useInteraction = ({ initialHover = false } = {}) => {
  const [interaction, setInteraction] = useState(null)
  const [canHover, setCanHover] = useState(initialHover)
  const [accuracy, setAccuracy] = useState(null)
  const [firedEvent, setFiredEvent] = useState({
    touchStart: null,
    mouseMove: null,
    mouseOver: null,
    keyDown: null,
  })
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

    history = [...new Set([...history, 'touch'])]
    setInteraction('touch')
    setCanHover(false)
  }, [setFiredEvent])

  const handleInteractionMouse = useCallback(() => {
    // prevent false positive on mousemove with touch devices
    if (!firedEvent.touchStart) {
      setFiredEvent(current => ({
        ...current,
        mouseMove: true,
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
      history = [...new Set([...history, 'mouse'])]
      setInteraction('mouse')
      setCanHover(true)
    }
  }, [firedEvent, setFiredEvent, setCanHover])

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

        // this pressed key causes an event mousemove
        setFiredEvent(current => ({
          ...current,
          keyDown: true,
          mouseMove: false,
        }))

        if (interaction === 'keyboard') return

        history = [...new Set([...history, 'keyboard'])]
        setInteraction('keyboard')
        setCanHover(false)
      }
    },
    [inputs, keys, interaction, setFiredEvent]
  )

  const handleInteractionPointer = useCallback(
    event => {
      setAccuracy(round(event.height, 1))
    },
    [setAccuracy]
  )

  useEffect(() => {
    window.addEventListener('touchstart', handleInteractionTouch, false)
    !firedEvent.mouseMove
      ? window.addEventListener('mousemove', handleInteractionMouse, false)
      : window.removeEventListener('mousemove', handleInteractionMouse, false)
    window.addEventListener('keydown', handleInteractionKeyboard, false)
    window.addEventListener('pointerdown', handleInteractionPointer, false)

    return () => {
      window.removeEventListener('touchstart', handleInteractionTouch, false)
      window.removeEventListener('mousemove', handleInteractionMouse, false)
      window.removeEventListener('keydown', handleInteractionKeyboard, false)
      window.removeEventListener('pointerdown', handleInteractionPointer, false)
    }
  }, [
    firedEvent.mouseMove,
    firedEvent.touchStart,
    handleInteractionKeyboard,
    handleInteractionMouse,
    handleInteractionPointer,
    handleInteractionTouch,
    inputs,
    keys,
    interaction,
  ])

  return [interaction, history, canHover, accuracy]
}

useInteraction.propTypes = {
  initialHover: PropTypes.boolean,
}

export default useInteraction
