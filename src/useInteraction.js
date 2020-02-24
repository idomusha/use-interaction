import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'

const getKey = event => (event.keyCode ? event.keyCode : event.which)

const getTarget = event => event.target || event.srcElement

const useInteraction = ({ initialHover = false, debug = false } = {}) => {
  const [pointerType, setPointerType] = useState(null)
  const [pointerTypes, setPointerTypes] = useState([])
  const [prevPointerType, setPrevPointerType] = useState(null)
  const [pointerAccuracy, setPointerAccuracy] = useState(null)
  const [canHover, setCanHover] = useState(initialHover)
  const [firedEvent, setFiredEvent] = useState({
    touchStart: null,
    mouseMove: null,
    wheel: null,
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

  const handleInteractionChange = nextPointer => {
    setPointerType(nextPointer)
  }

  const handleInteractionTouch = useCallback(
    event => {
      if (debug) console.log(event.type, event, firedEvent)

      setFiredEvent(current => ({
        ...current,
        touchStart: true,
        mouseMove: false,
        wheel: false,
      }))

      if (pointerType === 'touch') return

      handleInteractionChange('touch')
    },
    [pointerType]
  )

  const handleInteractionMouse = useCallback(
    event => {
      if (debug) console.log(event.type, event, firedEvent)

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

      if (pointerType === 'mouse') return

      if (
        firedEvent.mouseMove === null ||
        firedEvent.mouseMove === true ||
        firedEvent.touchStart === false
      ) {
        handleInteractionChange('mouse')
      }
    },
    [
      firedEvent.touchStart,
      firedEvent.keyDown,
      firedEvent.mouseMove,
      pointerType,
    ]
  )

  const handleInteractionKeyboard = useCallback(
    event => {
      if (debug) console.log(event.type, event, firedEvent)

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
          touchStart: false,
          mouseMove: false,
          wheel: false,
        }))

        if (pointerType === 'keyboard') return

        handleInteractionChange('keyboard')
      }
    },
    [keys, inputs, pointerType]
  )

  const handleInteractionPointer = useCallback(
    event => {
      if (debug) console.log(event.type, event, firedEvent)

      const nextAccuracy = round(event.height, 1)
      if (
        nextAccuracy > pointerAccuracy ||
        prevPointerType !== event.pointerType
      ) {
        setPointerAccuracy(nextAccuracy)
      }
    },
    [pointerAccuracy, prevPointerType]
  )

  useEffect(() => {
    window.addEventListener('touchstart', handleInteractionTouch, false)
    window.addEventListener('keydown', handleInteractionKeyboard, false)
    window.addEventListener('pointerdown', handleInteractionPointer, false)

    return () => {
      window.removeEventListener('touchstart', handleInteractionTouch, false)
      window.removeEventListener('keydown', handleInteractionKeyboard, false)
      window.removeEventListener('pointerdown', handleInteractionPointer, false)
    }
  }, [])

  useEffect(() => {
    if (firedEvent.mouseMove === true || firedEvent.wheel === true) {
      window.removeEventListener('mousemove', handleInteractionMouse, false)
      window.removeEventListener('wheel', handleInteractionMouse, false)
    } else {
      window.addEventListener('mousemove', handleInteractionMouse, false)
      window.addEventListener('wheel', handleInteractionMouse, false)
    }

    return () => {
      window.removeEventListener('mousemove', handleInteractionMouse, false)
      window.removeEventListener('wheel', handleInteractionMouse, false)
    }
  }, [firedEvent])

  useEffect(() => {
    if (pointerType) {
      let index = pointerTypes.filter(p => p !== pointerType)
      index.push(pointerType)
      setCanHover(pointerType === 'mouse')
      if (index.length > 1) setPrevPointerType(index[index.length - 2])

      setPointerTypes(index)
    }
  }, [pointerType])

  return [pointerType, prevPointerType, pointerTypes, canHover, pointerAccuracy]
}

useInteraction.propTypes = {
  initialHover: PropTypes.boolean,
  debug: PropTypes.boolean,
}

export default useInteraction
