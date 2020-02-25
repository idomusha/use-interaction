import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'

import Log from './Log'

const getKey = event => (event.keyCode ? event.keyCode : event.which)

const getTarget = event => event.target || event.srcElement

const useInteraction = ({ initial = null } = {}) => {
  const initialPointerType =
    typeof initial === 'string' &&
    ['touch', 'mouse', 'keyboard'].includes(initial)
      ? initial
      : null
  const [pointerType, setPointerType] = useState(initialPointerType)
  const [prevPointerType, setPrevPointerType] = useState(null)
  const [pointerHistory, setPointerHistory] = useState([])
  const [pointerAccuracy, setPointerAccuracy] = useState(null)
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

  const handleInteractionChange = useCallback(
    nextPointer => {
      setPrevPointerType(pointerType)
      setPointerType(nextPointer)
    },
    [pointerType]
  )

  const handleInteractionTouch = useCallback(
    event => {
      Log.info(event.type, event, firedEvent)

      setFiredEvent(current => ({
        ...current,
        touchStart: true,
        mouseMove: false,
        wheel: false,
      }))

      if (pointerType === 'touch') return

      handleInteractionChange('touch')
    },
    [firedEvent, pointerType, handleInteractionChange]
  )

  const handleInteractionMouse = useCallback(
    event => {
      Log.info(event.type, event, firedEvent)

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

      // reset interaction markers
      setFiredEvent(current => ({
        ...current,
        touchStart: false,
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
    [firedEvent, pointerType, handleInteractionChange]
  )

  const handleInteractionKeyboard = useCallback(
    event => {
      Log.info(event.type, event, firedEvent)

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

        setPointerAccuracy(null)
        handleInteractionChange('keyboard')
      }
    },
    [firedEvent, keys, inputs, pointerType, handleInteractionChange]
  )

  const handleInteractionPointer = useCallback(
    event => {
      Log.info(event.type, event, firedEvent)

      const nextAccuracy = round(event.height, 1)
      if (
        nextAccuracy > pointerAccuracy ||
        pointerHistory[0] !== event.pointerType
      ) {
        setPointerAccuracy(nextAccuracy)
      }
    },
    [firedEvent, pointerAccuracy, pointerHistory]
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
  }, [
    handleInteractionKeyboard,
    handleInteractionPointer,
    handleInteractionTouch,
  ])

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
  }, [firedEvent.mouseMove, firedEvent.wheel, handleInteractionMouse])

  useEffect(() => {
    if (pointerType) {
      setPointerHistory(current => {
        return [...current, prevPointerType].reduce((pointers, pointer) => {
          if (pointer !== null && pointer !== pointerType)
            pointers.unshift(pointer)
          return pointers
        }, [])
      })
    }
  }, [pointerType, prevPointerType])

  return [pointerType, pointerHistory, pointerAccuracy]
}

useInteraction.propTypes = {
  initialHover: PropTypes.boolean,
  debug: PropTypes.boolean,
}

export default useInteraction
