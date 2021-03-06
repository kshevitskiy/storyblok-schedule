const TODAY = new Date()
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

/**
 * Returns list of localized days
 * locale: name of locale, eg. en-GB, default de-DE
 * weekday: formart of weekday short/long default short
 */
export const getWeekDaysForLocale = (locale = 'de-DE', weekday = 'short') => {
  const baseDate = new Date('1973-01-01')
  const weekDays = []

  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday }))
    baseDate.setDate(baseDate.getDate() + 1)
  }

  return weekDays
}

/**
 * Current week-day number
 * Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6
 */
export const today = (TODAY.getDay() + 6) % 7

/**
 * Group Array of JavaScript Objects by Key or Property Value
 */
export const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})

/**
 * Validate days sequence
 */
export const sequentialDays = (input) => {
  const rule = /(?:(?=01|12|23|34|45|56)\d)+\d/g
  const match = input.match(rule)
  return match !== null && input === match[0]
}

/**
 * Days property validation method
 * Array length and object properties validation
 */
export const daysValidator = (value) => {
  if (value.length !== 7) {
    console.warn('[storyblok-schedule]: Days property should contain 7 days')
    return false
  }

  if (value.some((item) => !item.name)) {
    console.warn(
      '[storyblok-schedule]: <Days>[day] `name` property value is required'
    )
    return false
  }

  if (value.some((item) => !item.times)) {
    console.warn(
      '[storyblok-schedule]: <Days>[day] `times` property is required'
    )
    return false
  }

  return true
}

/**
 * Convert 24hr time string into 12 hrs time format
 * @param {string} timeString
 * @param {string} locale
 */
export const toAmPmTime = (timeString, locale = 'en-US') => {
  const isTime = TIME_REGEX.test(timeString)

  if (isTime) {
    const dateTime = `1970-01-01T${timeString}Z`
    const date = new Date(dateTime)
    const settings = {
      timeZone: 'UTC',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    }
    return date.toLocaleTimeString(locale, settings)
  }

  return timeString
}
