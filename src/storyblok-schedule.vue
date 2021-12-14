<template>
  <div v-if="disabled" class="schedule">
    <!-- disabled slot -->
    <slot name="disabled">
      Schedule is disabled
    </slot>
  </div>

  <div v-else class="schedule">
    <template v-if="source === 'text'">
      {{ text }}
    </template>

    <ul v-if="['daysAndText', 'days'].includes(source)" class="calendar">
      <li v-for="(day, index) in formattedDays" :key="index">
        <!-- day slot -->
        <slot name="day" v-bind="{ name: day.name }">
          <strong>
            <template v-if="pairing">
              {{
                day.name.length === 2
                  ? day.name.join('-')
                  : day.name.join(', ')
              }}:
            </template>
            <template v-else>{{ day.name }}: </template>
          </strong>
        </slot>

        <template v-if="day.times || showEmptyDay">
          <!-- time slot -->
          <slot name="time" v-bind="{ time: day.times, placeholder }">
            <span v-if="day.times" class="time">
              <template v-if="Array.isArray(day.times)">
                {{ day.times.join(', ') }}
              </template>
              <template v-else>
                {{ day.times }}
              </template>
            </span>
            <span v-else class="time">
              {{ placeholder }}
            </span>
          </slot>

          <!-- Trailing text placeholder is used to display custom text after time -->
          <slot name="trailing-text" v-bind="{ time: day.times }" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getWeekDaysForLocale,
  groupBy,
  today,
  daysValidator,
  sequentialDays,
  toAmPmTime
} from './helpers'
import seeder from './seeder'

const findTimeSlot = (arr, item, key, index) =>
  arr.find((group) => {
    const hasKey = group.some((field) => field[key] === item[key])
    // Check if current group items are sequent
    const indexSeqence = group
      .map((field) => field[index])
      .concat(item[index])
      .join('')
    const isSequent = sequentialDays(indexSeqence)
    return hasKey && isSequent
  })

const toAmPm = (time, locale) => {
  time.start = toAmPmTime(time.start, locale)
  time.end = toAmPmTime(time.end, locale)
  return time
}

const SEEDING_DATA = seeder.days

export default {
  name: 'StoryblokSchedule',
  props: {
    /**
     * Source type.
     * Array of Objects. See macherjek-opening-hours storyblok plugin [docs](https://www.notion.so/OpeningHours-Component-41cadbfd790749c29dbe535af1097de0)
     */
    days: {
      type: Array,
      // required: true,
      validator: daysValidator,
      default: () => SEEDING_DATA
    },
    /**
     * Source type.
     * Custom text
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * Data source types
     */
    source: {
      type: String,
      validator: (value) => ['days', 'text', 'daysAndText'].includes(value),
      default: 'days'
    },
    /**
     * Name of locale, eg. en-GB, default de-DE
     */
    locale: {
      type: String,
      default: 'de-DE'
    },
    /**
     * Formart of weekday short/long
     */
    weekday: {
      type: String,
      validator: (value) => ['short', 'long'].includes(value),
      default: 'short'
    },
    /**
     * Mon-Wed: 9:00-18:00, Thu-Sat: 9:00-18:00
     * or Mon-Sat: 9:00-18:00 (Sunday is closed)
     */
    pairing: {
      type: String,
      validator: (value) =>
        ['groups', 'timerange', 'weekcycle'].includes(value) || value === null,
      default: null
    },
    /**
     * Sun: — (use `placeholder` property to change time placeholder value)
     */
    showEmptyDay: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '—'
    },
    timeDivider: {
      type: String,
      default: ' - '
    },
    /**
     * Wed: 9:00-18:00
     */
    showCurrentDay: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Time format 12 (AM, PM) or 24-hour
     */
    amPm: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedDays() {
      // Map day names with defined locale
      let days = this.days.map((day, index) => {
        const name = this.getDayName(index) || day.name
        let data = day[day.source]
        const hasData = data && data.length > 0

        if (Array.isArray(data) && hasData) {
          if (this.amPm) {
            data = data.map((time) => toAmPm(time, this.locale))
          }

          data = data.map((time) => time.start + this.timeDivider + time.end)
        }

        return {
          name,
          index,
          times: hasData ? data : null
        }
      })

      // Show only current day
      if (this.showCurrentDay) {
        days = days.filter((_, index) => index === today)
      }

      // Hide empty days
      if (!this.showEmptyDay) {
        days = this.hideEmpty(days)
      }

      // Days pairing
      if (this.pairing === 'groups') {
        days = this.pairDays(days)
      }

      // Timerange pairing
      if (this.pairing === 'timerange') {
        days = this.pairByTimerange(days)
      }

      return days
    },
    getDayName() {
      return (number) => getWeekDaysForLocale(this.locale, this.weekday)[number]
    }
  },
  methods: {
    hideEmpty(days) {
      return days.filter((day) => day.times)
    },
    pairDays(days) {
      const groupByTime = groupBy('times')
      const groups = groupByTime(days)

      return Object.keys(groups).map((key) => {
        key = key === 'null' ? null : key

        const daySequence = groups[key].map((item) => item.index).join('')
        const dayNames = groups[key].map((item) => item.name)
        const times = key && key.split(',')
        let name = dayNames

        if (sequentialDays(daySequence)) {
          const firstDayName = dayNames[0]
          const lastDayName = dayNames[dayNames.length - 1]
          name = [firstDayName, lastDayName]
        }

        return {
          name,
          times
        }
      })
    },
    pairByTimerange(days) {
      const daysAndTimes = days.map((item) => {
        let { times } = item

        if (Array.isArray(times) && times.length) {
          if (this.amPm) {
            times = times.map((time) => toAmPm(time, this.locale))
          }

          times = times.join(', ')
        }

        return Object.assign(item, {
          times: times || this.placeholder
        })
      })

      const key = 'times'
      const index = 'index'

      const groups = daysAndTimes.reduce((result, day) => {
        // Check if array with day is already exists
        const hasSlot = result.some((group) =>
          group.some((item) => item[key] === day[key])
        )

        if (hasSlot) {
          // Find group which includes day
          const matchedSlot = findTimeSlot(result, day, key, index)
          if (matchedSlot) {
            matchedSlot.push(day)
          } else {
            result.push([day])
          }
        }

        if (!hasSlot) {
          result.push([day])
        }

        return result
      }, [])

      return groups.map((group) => this.pairDays(group)).flat()
    }
  }
}
</script>
