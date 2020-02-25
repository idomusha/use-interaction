import React from 'react'
import { renderHook, cleanup, act } from '@testing-library/react-hooks'
import { fireEvent, createEvent, render, wait } from '@testing-library/react'

import useInteraction from './useInteraction'

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
    fireEvent.touchStart(document.body, {})
  })

  expect(result.current[0]).toBe('touch')
})

test('should set interaction type of the user to mouse', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.mouseMove(document.body, {})
  })

  expect(result.current[0]).toBe('mouse')
})

test('should set interaction type of the user to keyboard', () => {
  const { result, unmount } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.keyDown(document.body, {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
    })
  })

  expect(result.current[0]).toBe('keyboard')
  unmount()
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
    fireEvent.mouseMove(document.body, {})
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
  })

  expect(result.current[0]).toBe('mouse')
})

test('should set interaction type of the user to touch and then to mouse', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.touchStart(document.body, {})
    fireEvent.mouseMove(document.body, {})
  })

  wait(() => {
    expect(result.current[0]).toBe('mouse')
    expect(result.current[1]).toMatchObject(['touch', 'mouse'])
  })
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

  wait(() => {
    expect(result.current[0]).toBe('keyboard')
  })

  act(() => {
    fireEvent.wheel(document.body, {})
    fireEvent.keyDown(getByTestId('test-input'), {
      key: 'Tab',
      code: 'Tab',
      keyCode: undefined,
      which: 9,
      target: undefined,
      srcElement: document.body,
    })
  })

  wait(() => {
    expect(result.current[0]).toBe('keyboard')
  })

  act(() => {
    fireEvent.wheel(document.body, {})
  })

  wait(() => {
    expect(result.current[0]).toBe('mouse')
    expect(result.current[1]).toMatchObject(['keyboard', 'mouse'])
  })
})

test('should set accuracy of the pointer', () => {
  const { result } = renderHook(() => useInteraction())

  const pointerDown1 = createEvent.pointerDown(document.body, {
    height: 5,
  })
  const pointerDown2 = createEvent.pointerDown(document.body, {
    height: 23.666666666,
  })
  const pointerDown3 = createEvent.pointerDown(document.body, {
    height: 1,
  })

  act(() => {
    fireEvent(document.body, pointerDown1)
    fireEvent(document.body, pointerDown2)
  })

  wait(() => {
    expect(result.current[2]).toBe(23.7)
  })

  act(() => {
    fireEvent.mouseMove(document.body, {})
    fireEvent(document.body, pointerDown3)
  })

  wait(() => {
    expect(result.current[2]).toBe(1)
  })
})
