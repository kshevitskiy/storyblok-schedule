<template>
  <ul v-if="!disabled" class="schedule">
    <li v-for="(day, index) in formattedDays" :key="index">
      <!-- day slot -->
      <slot name="day" v-bind="{ name: day.name }">
        <strong>
          <template v-if="pairing">
            {{
              day.name.length === 2 ? day.name.join('-') : day.name.join(', ')
            }}:
          </template>
          <template v-else>{{ day.name }}: </template>
        </strong>
      </slot>

      <template v-if="day.times || showEmptyDay">
        <!-- time slot -->
        <slot name="time" v-bind="{ time: day.times, placeholder }">
          <span v-if="day.times">
            {{ day.times.join(', ') }}
          </span>
          <span v-else>
            {{ placeholder }}
          </span>
        </slot>
      </template>
    </li>
  </ul>
</template>

<script>
import {
  getWeekDaysForLocale,
  groupBy,
  today,
  daysValidator,
  sequentialDays
} from './helpers'

const dataPlaceholder = [
  {
    name: 'Monday',
    times: [
      {
        end: '12:00',
        start: '09:00'
      }
    ]
  },
  {
    name: 'Tuesday',
    times: [
      {
        end: '12:00',
        start: '09:00'
      }
    ]
  },
  {
    name: 'Wednesday',
    times: [
      {
        end: '18:00',
        start: '09:00'
      }
    ]
  },
  {
    name: 'Thursday',
    times: []
  },
  {
    name: 'Friday',
    times: [
      {
        end: '18:00',
        start: '09:00'
      }
    ]
  },
  {
    name: 'Saturday',
    times: [
      {
        end: '18:00',
        start: '09:00'
      }
    ]
  },
  {
    name: 'Sunday',
    times: [
      {
        end: '12:00',
        start: '09:00'
      },
      {
        end: '18:00',
        start: '14:00'
      }
    ]
  }
]

export default {
  name: 'StoryblokSchedule',
  props: {
    /**
     * Array of Objects. See macherjek-opening-hours storyblok plugin [docs](https://www.notion.so/OpeningHours-Component-41cadbfd790749c29dbe535af1097de0)
     */
    days: {
      type: Array,
      // required: true,
      validator: daysValidator,
      default: () => dataPlaceholder
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
      type: Boolean,
      default: false
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
    }
  },
  computed: {
    formattedDays() {
      // Map day names with defined locale
      let days = this.days.map((day, index) => {
        const name = this.getDayName(index) || day.name
        const times = day.times
        const hasTimes = times && times.length > 0

        return {
          name,
          index,
          times: hasTimes
            ? times.map((time) => `${time.start} — ${time.end}`)
            : null
        }
      })

      // Hide current day
      if (!this.showCurrentDay) {
        days = days.filter((_, index) => index !== today)
      }

      // Hide empty days
      if (!this.showEmptyDay) {
        days = this.hideEmpty(days)
      }

      // Days pairing
      if (this.pairing) {
        days = this.pairDays(days)
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
        const daySequence = groups[key].map((item) => item.index).join('')
        const dayNames = groups[key].map((item) => item.name)
        const times = key.split(',')
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
    }
  }
}
</script>
