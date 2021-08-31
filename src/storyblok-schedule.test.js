import { shallowMount } from '@vue/test-utils'
import StoryblokSchedule from './storyblok-schedule.vue'

test('Renders', () => {
  const wrapper = shallowMount(StoryblokSchedule)
  expect(wrapper.exists()).toBe(true)
})

// test('Shows placeholders', () => {
//   const dayHtmlPlaceholder = '<div class="day"></div>'
//   const timeHtmlPlaceholder = '<div class="time"></div>'

//   const wrapper = shallowMount(StoryblokSchedule, {
//     slots: {
//       day: dayHtmlPlaceholder,
//       time: timeHtmlPlaceholder
//     }
//   })

//   expect(wrapper.html()).toContain(dayHtmlPlaceholder)
//   expect(wrapper.html()).toContain(timeHtmlPlaceholder)
// })
