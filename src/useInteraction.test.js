import React from 'react'
import { renderHook, cleanup, act } from '@testing-library/react-hooks'
import { fireEvent, createEvent, render, wait } from '@testing-library/react'

import useInteraction from './useInteraction'
import Demo from './Demo'

afterEach(cleanup)

test('should init interaction type of the user', () => {
  const { result } = renderHook(() => useInteraction())

  expect(result.current[0]).toBe(null)
  expect(result.current[1]).toMatchObject([])
  expect(result.current[2]).toBeFalsy()
  expect(result.current[3]).toBe(null)
})

test('should init interaction type of the user with initialHover', () => {
  const { result } = renderHook(() => useInteraction({ initialHover: true }))

  expect(result.current[0]).toBe(null)
  expect(result.current[1]).toMatchObject([])
  expect(result.current[2]).toBeTruthy()
  expect(result.current[3]).toBe(null)
})

test('should set interaction type of the user to touch', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.touchStart(document.body, {})
  })

  expect(result.current[0]).toBe('touch')
  expect(result.current[2]).toBeFalsy()
})

test('should set interaction type of the user to mouse', () => {
  const { result } = renderHook(() => useInteraction())

  act(() => {
    fireEvent.mouseMove(document.body, {})
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[2]).toBeTruthy()
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
  expect(result.current[2]).toBeFalsy()
  unmount()
})

test('should not set interaction type of the user to keyboard', () => {
  const { result } = renderHook(() => useInteraction())
  const { getByTestId } = render(<input type="text" data-testid="test-input" />)

  act(() => {
    fireEvent.mouseMove(document.body, {})
    fireEvent.keyDown(getByTestId('test-input'), {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
    })
  })

  expect(result.current[0]).toBe('mouse')
  expect(result.current[2]).toBeTruthy()
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
    expect(result.current[2]).toBeTruthy()
  })
})

test('should set accuracy of the pointer', () => {
  const { result } = renderHook(() => useInteraction())

  const pointerDown = createEvent.pointerDown(document.body, {
    height: 23.666666666,
  })

  act(() => {
    fireEvent(document.body, pointerDown)
  })

  wait(() => {
    expect(result.current[3]).toBe(23.7)
  })
})
