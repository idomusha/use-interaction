import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'
import ulog from 'ulog'

const log = ulog('use-interaction')
let setMaxPointerSize = null
const getKey = event => (event.keyCode ? event.keyCode : event.which)

const useInteraction = ({ initial = null } = {}) => {
  const initialPointerType =
    typeof initial === 'string' &&
    ['touch', 'mouse', 'keyboard'].includes(initial)
      ? initial
      : null
  const [pointerType, setPointerType] = useState(initialPointerType)
  const [pointerHistory, setPointerHistory] = useState([])
  const [pointerAccuracy, setPointerAccuracy] = useState(null)
  const [firedEvent, setFiredEvent] = useState({
    touchstart: null,
    mousemove: null,
    wheel: null,
    keydown: null,
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

  const handleInteractionChange = useCallback(event => {
    log.info(event, event.type)

    setFiredEvent(current => ({
      ...current,
      ...(['touchstart', 'keydown'].includes(event.type) && {
        [event.type]: true,
        [['touchstart', 'keydown'].find(e => e !== event.type)]: null,
        mousemove: event.type === 'touchstart' ? false : null,
        wheel: null,
      }),
      ...(event.type === 'mousemove' && {
        mousemove: current.mousemove === false ? null : true,
        touchstart: current.mousemove === false ? true : null,
        keydown: null,
      }),
      ...(event.type === 'wheel' && {
        wheel: true,
        touchstart: null,
        keydown: null,
      }),
    }))
  }, [])

  const setInteraction = useCallback(
    nextPointerType => {
      setPointerHistory(current =>
        [pointerType, ...current].reduce((pointers, pointer) => {
          if (pointer !== null && pointer !== nextPointerType)
            pointers.push(pointer)
          return pointers
        }, [])
      )
      setPointerType(nextPointerType)
    },
    [pointerType]
  )

  const handleInteractionTouch = useCallback(
    event => {
      handleInteractionChange(event)
    },
    [handleInteractionChange]
  )

  const handleInteractionMouse = useCallback(
    event => {
      handleInteractionChange(event)
    },
    [handleInteractionChange]
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
          inputs.indexOf(event.target && event.target.nodeName.toLowerCase()) >=
            0
        ) {
          // ignore navigation keys typing on form elements
          return
        }

        handleInteractionChange(event)
      }
    },
    [keys, inputs, handleInteractionChange]
  )

  setMaxPointerSize = event => {
    log.info(event, event.type, event.pointerType)

    const nextAccuracy = round(event.height, 1)

    if (nextAccuracy > pointerAccuracy) {
      setPointerAccuracy(nextAccuracy)
    }
  }

  const handleInteractionPointer = useCallback(setMaxPointerSize, [
    pointerAccuracy,
  ])

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
    handleInteractionTouch,
    handleInteractionKeyboard,
    handleInteractionPointer,
  ])

  useEffect(() => {
    if (firedEvent.mousemove === true || firedEvent.wheel === true) {
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
  }, [firedEvent, handleInteractionMouse])

  useEffect(() => {
    log.info('firedEvent', { ...firedEvent })

    if (firedEvent.touchstart) setInteraction('touch')
    if (firedEvent.mousemove || firedEvent.wheel) setInteraction('mouse')
    if (firedEvent.keydown) setInteraction('keyboard')
    if (firedEvent.mousemove || firedEvent.wheel || firedEvent.keydown)
      setPointerAccuracy(null)
  }, [firedEvent, setInteraction])

  return [pointerType, pointerHistory, pointerAccuracy]
}

useInteraction.propTypes = {
  initial: PropTypes.boolean,
}

export default useInteraction
export { setMaxPointerSize, log }
