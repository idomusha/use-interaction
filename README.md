# React hook for following user interaction type

[![Build Status](https://travis-ci.org/idomusha/use-interaction.svg?branch=master)](https://travis-ci.org/idomusha/use-interaction)
[![npm version](https://badge.fury.io/js/use-interaction.svg)](https://badge.fury.io/js/use-interaction)
[![Coverage Status](https://coveralls.io/repos/github/idomusha/use-interaction/badge.svg?branch=master&service=github)](https://coveralls.io/github/idomusha/use-interaction?branch=master)

React hook `useInteraction()` allows to get the user interaction type: `touch`, `mouse` or `keyboard`.

### ▶︎ [Demo](https://idomusha.github.io/use-interaction/)

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

If the user interaction changes, the `interaction`, `history`, `canHover` and `accuracy` values will be updated.
Keyboard strokes has no effect on the interaction type when the user is typing in a form element. Only keyboard navigation is monitored.

```javascript
const [interaction, history, canHover, accuracy] = useInteraction()
```

### Full example

```javascript
import React from 'react'
import useInteraction from 'use-interaction'

export const Demo = () => {
  const [interaction, history, canHover, accuracy] = useInteraction()

  return (
    <code>
      interaction: {interaction}
      <br />
      history: {history}
      <br />
      can hover: {canHover}
      <br />
      accuracy: {accuracy}
    </code>
  )
}
```

## Specification

### `useInteraction()` input

`object`

| Property Name    |   Type    | Description                                                                                                                                               | Default Value |
| :--------------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------: |
| **initialHover** | `boolean` | to not wait an action on the part of the user, **canHover** can be defined via this parameter to be effective as soon as the page is loaded (i.e. `true`) |    `false`    |

<code>
  const [interaction, history, canHover, accuracy] = useInteraction({initialHover: true})
</code>

### `useInteraction()` output

`array`

<!-- - **interaction**: `string` - interaction type of the user: `touch`, `mouse` or `keyboard` (i.e. `touch`, default: `null`)
- **history**: `Array.<string>` - all interaction types used from the load (i.e. `['touch', 'mouse']`, default: `[]`),
- **canHover**: `boolean` - if the user can hover (i.e. `true`, default: `null`)
- **accuracy**: `number` - pointer size in pixels (i.e. `23`, default: `null`), -->

| Returned Array            |       Type       | Description                                                                 | Default Value |
| :------------------------ | :--------------: | :-------------------------------------------------------------------------- | :-----------: |
| 1st element (interaction) |     `string`     | interaction type of the user: `touch`, `mouse` or `keyboard` (i.e. `touch`) |    `null`     |
| 2nd element (history)     | `Array.<string>` | all interaction types used from the load (i.e. `['touch', 'mouse']`}        |     `[]`      |
| 3rd element (canHover)    |    `boolean`     | if the user can hover (i.e. `true`)                                         |    `false`    |
| 4th element (accuracy)    |     `number`     | pointer size in pixels (i.e. `23`)                                          |    `null`     |
