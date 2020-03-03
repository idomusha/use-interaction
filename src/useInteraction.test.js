import React from 'react'
import { renderHook, cleanup, act } from '@testing-library/react-hooks'
import { render, fireEvent } from '@testing-library/react'

import useInteraction, { setMaxPointerSize, log } from './useInteraction'

if (process.env.NODE_ENV === 'test') {
  log.level = log.NONE
}

afterEach(cleanup)

test('should init interaction type of the user', () => {
  const { result } = renderHook(() => useInteraction())

  expect(result.current[0]).toBe(null)
  expect(result.current[1]).toMatchObject([])
  expect(result.current[2]).toBe(null)
})

test('should init interaction type of the user with initialPointerType', () => {
  const { result } = renderHook(() => useInteraction({ initial: 'touch' }))

  expect(result.current[0]).toBe('touch')
  expect(result.current[1]).toMatchObject([])
  expect(result.current[2]).toBe(null)
})

test('should set interaction type of the user to touch', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.touchStart(document.body, { type: 'touchstart' })
  })

  expect(result.current[0]).toBe('touch')
})

test('should set interaction type of the user to mouse', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
  })

  expect(result.current[0]).toBe('mouse')
})

test('should set interaction type of the user to keyboard', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.keyDown(document.body, {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
    })
  })

  expect(result.current[0]).toBe('keyboard')
})

test('should not set interaction type of the user to keyboard when user is typing in form elements', () => {
  const { result } = renderHook(() => useInteraction())
  const { getByTestId } = render(
    <>
      <input type="text" data-testid="test-input" />
      <select data-testid="test-select">
        <option value=""></option>
        <option value="0">0</option>
        <option value="1">1</option>
      </select>
      <textarea data-testid="test-textarea" />
    </>
  )

  act(() => {
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
    fireEvent.keyDown(getByTestId('test-input'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
    })
    fireEvent.keyDown(getByTestId('test-select'), {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
    })
    fireEvent.keyDown(getByTestId('test-textarea'), {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: 37,
      which: 37,
    })
    fireEvent.keyDown(getByTestId('test-textarea'), {
      key: 'x',
      code: 'x',
      keyCode: 88,
      which: 88,
    })
  })

  expect(result.current[0]).toBe('mouse')
})

test('should set interaction type of the user to touch and then to mouse', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.touchStart(document.body, {
      type: 'touchstart',
    })
  })

  expect(result.current[0]).toBe('touch')

  act(() => {
    fireEvent.mouseMove(document.body, {
      type: 'mousemove',
    })
    fireEvent.mouseMove(document.body, {
      type: 'mousemove',
    })
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[1]).toMatchObject(['touch'])
})

test('should set interaction type of the user to keyboard and then to mouse', () => {
  const { result } = renderHook(() => useInteraction())
  const { getByTestId } = render(<input type="text" data-testid="test-input" />)

  act(() => {
    fireEvent.keyDown(getByTestId('test-input'), {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: undefined,
      target: document.body,
      srcElement: undefined,
    })
  })

  expect(result.current[0]).toBe('keyboard')

  act(() => {
    fireEvent.wheel(document.body, { type: 'wheel' })
    fireEvent.keyDown(document.body, {
      key: ' ',
      code: 'Space',
      keyCode: undefined,
      which: 32,
      target: undefined,
      srcElement: document.body,
    })
  })

  expect(result.current[0]).toBe('keyboard')

  act(() => {
    fireEvent.wheel(document.body, { type: 'wheel' })
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[1]).toMatchObject(['keyboard'])
})

test('should set accuracy of the pointer', () => {
  const { result } = renderHook(() => useInteraction())
  const { getByTestId } = render(<div data-testid="test-div" />)

  act(() => {
    /* fireEvent.pointerDown(getByTestId('test-div'), {
      height: 3,
      pointerType: 'touch',
      type: 'pointerdown',
    }) */
    const PointerEvent = {
      height: 3,
      pointerType: 'touch',
      type: 'pointerdown',
    }
    setMaxPointerSize(PointerEvent)
    fireEvent.touchStart(getByTestId('test-div'), { type: 'touchstart' })
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
  })

  expect(result.current[0]).toBe('touch')
  expect(result.current[2]).toBe(3)

  act(() => {
    /* fireEvent.pointerDown(getByTestId('test-div'), {
      height: 2,
      pointerType: 'touch',
      type: 'pointerdown',
    }) */
    const PointerEvent = {
      height: 2,
      pointerType: 'touch',
      type: 'pointerdown',
    }
    setMaxPointerSize(PointerEvent)
    fireEvent.touchStart(getByTestId('test-div'), { type: 'touchstart' })
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
  })

  expect(result.current[0]).toBe('touch')
  expect(result.current[2]).toBe(3)

  act(() => {
    /* fireEvent.pointerDown(getByTestId('test-div'), {
      height: 23.666666666,
      pointerType: 'touch',
      type: 'pointerdown',
    }) */
    const PointerEvent = {
      height: 23.666666666,
      pointerType: 'touch',
      type: 'pointerdown',
    }
    setMaxPointerSize(PointerEvent)
    fireEvent.touchStart(getByTestId('test-div'), { type: 'touchstart' })
  })

  expect(result.current[0]).toBe('touch')
  expect(result.current[2]).toBe(23.7)

  act(() => {
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
    fireEvent.mouseMove(document.body, { type: 'mousemove' })
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[2]).toBe(null)

  act(() => {
    /* fireEvent.pointerDown(getByTestId('test-div'), {
      height: 1,
      pointerType: 'mouse',
      type: 'pointerdown',
    }) */
    const PointerEvent = {
      height: 1,
      pointerType: 'mouse',
      type: 'pointerdown',
    }
    setMaxPointerSize(PointerEvent)
    fireEvent.mouseDown(getByTestId('test-div'), { type: 'mousedown' })
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[2]).toBe(1)
})
