# @nujek/storyblok-schedule

**Component to display weekly schedule**

This compenent could be used with [storyblok opening hours](https://www.notion.so/OpeningHours-Component-41cadbfd790749c29dbe535af1097de0) plugin or with custom data passed as `days` property.

[[toc]]

## Installation

```
npm install @nujek/storyblok-schedule
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import StoryblokSchedule from '@nujek/storyblok-schedule'

Vue.use(StoryblokSchedule)
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="@nujek/storyblok-schedule/dist/storyblok-schedule.js"></script>

<!-- From CDN -->
<script src="https://unpkg.com/@nujek/storyblok-schedule"></script>
```

## Examples

### Default

::: demo
<storyblok-schedule></storyblok-schedule>
:::

### Localization and weekday long

::: demo
<storyblok-schedule locale="ru-RU" weekday="long"></storyblok-schedule>
:::

### Pair by groups

::: demo
<storyblok-schedule pairing="groups"></storyblok-schedule>
:::

### Pair by timerange

::: demo
<storyblok-schedule pairing="timerange" locale="uk-UA"></storyblok-schedule>
:::

### Show empty day

::: demo
<storyblok-schedule :show-empty-day="true"></storyblok-schedule>
:::

### Show current day

::: demo
<storyblok-schedule :show-current-day="true"></storyblok-schedule>
:::

### Disabled

::: demo
<storyblok-schedule :disabled="true"></storyblok-schedule>
:::

<!-- The API section is auto generated, don't touch please -->

## API

### storyblok-schedule

#### slots

- `day` day slot

- `time` time slot

#### props

- `days` **_Array_** (_optional_) `default: [object Object]`

  Array of Objects. See macherjek-opening-hours storyblok plugin [docs](https://www.notion.so/OpeningHours-Component-41cadbfd790749c29dbe535af1097de0)

- `locale` **_String_** (_optional_) `default: 'de-DE'`

  Name of locale, eg. en-GB, default de-DE

- `weekday` **_String_** (_optional_) `default: 'short'`

  Formart of weekday short/long

- `pairing` **_Boolean_** (_optional_) `default: false`

  Mon-Wed: 9:00-18:00, Thu-Sat: 9:00-18:00
  or Mon-Sat: 9:00-18:00 (Sunday is closed)

- `show-empty-day` **_Boolean_** (_optional_) `default: false`

  Sun: — (use `placeholder` property to change time placeholder value)

- `placeholder` **_String_** (_optional_) `default: '—'`

- `show-current-day` **_Boolean_** (_optional_) `default: false`

  Wed: 9:00-18:00

- `disabled` **_Boolean_** (_optional_) `default: false`
