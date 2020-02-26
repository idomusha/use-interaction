# React hook for following user interaction type

[![Build Status](https://travis-ci.org/idomusha/use-interaction.svg?branch=master&service=github)](https://travis-ci.org/idomusha/use-interaction)
[![npm version](https://badge.fury.io/js/use-interaction.svg?service=github)](https://badge.fury.io/js/use-interaction)
[![Coverage Status](https://coveralls.io/repos/github/idomusha/use-interaction/badge.svg?branch=master&service=github)](https://coveralls.io/github/idomusha/use-interaction?branch=master)

React hook `useInteraction()` allows to get the user interaction type: `touch`, `mouse` or `keyboard`.

### ▶︎ [Demo](https://idomusha.github.io/use-interaction/?log=debug)

## Installation

Using `yarn`:

```bash
yarn add use-interaction
```

Using `npm`:

```bash
npm i use-interaction --save
```

## Usage

Import the hook:

```javascript
import useInteraction from 'use-interaction'
```

### Following user interaction type

If the user interaction changes, the `pointerType`, `pointerHistory`, and `pointerAccuracy` values will be updated.
Keyboard strokes has no effect on the interaction type when the user is typing in a form element (input, select, and textarea). Only keyboard navigation is monitored.

```javascript
const [pointerType, pointerHistory, pointerAccuracy] = useInteraction()
```

### Full example

```javascript
import React from 'react'
import useInteraction from 'use-interaction'

export const Demo = () => {
  const [pointerType, pointerHistory, pointerAccuracy] = useInteraction()

  return (
    <code>
      pointer: {pointerType || `none`} (can
      {pointerType !== 'mouse' && 'not'} hover)
      <br />
      history: {`[${pointerHistory.join(', ')}]`}
      <br />
      accuracy: {pointerAccuracy || `none`}
      <br />
    </code>
  )
}
```

## Specification

### `useInteraction()` input

`object`

| Property Name |   Type    | Description                                                                                                                                             | Default Value |
| :------------ | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-----------: |
| **initial**   | `boolean` | to not wait an action on the part of the user, the initial interaction type can be defined to be effective as soon as the page is loaded (i.e. `touch`) |    `null`     |

```javascript
import { isMobile } from 'react-device-detect'

const [pointerType, pointerHistory, pointerAccuracy] = useInteraction({
  initial: isMobile ? 'touch' : 'mouse',
})
```

### `useInteraction()` output

`array`

| Returned Array                |       Type       | Description                                                                                                  | Default Value |
| :---------------------------- | :--------------: | :----------------------------------------------------------------------------------------------------------- | :-----------: |
| 1st element (pointerType)     |     `string`     | current input of the user interaction: `touch`, `mouse` or `keyboard` (i.e. `touch`)                         |    `null`     |
| 2nd element (pointerHistory)  | `Array.<string>` | previous inputs of the user interaction listed in reverse chronological order (i.e. `['mouse', 'keyboard']`} |     `[]`      |
| 3rd element (pointerAccuracy) |     `number`     | [Experimental] max size of contact geometry collected from the current pointer (i.e. `23`)                   |    `null`     |
