import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'

const ease = [0.22, 1, 0.36, 1]

export default function Schedule() {
  const { content } = useContent()
  const { schedule, classDays, startTime } = content
  const [today] = useState(() => new Date().getDay())

  return (
    <section className="section schedule" id="schedule">
      <div className="container">
        <SectionHead label={schedule.label} title={schedule.title} lead={schedule.lead} />

        <motion.ul
          className="schedule-rows"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {schedule.days.map((day, i) => {
            const isToday = classDays[i] === today
            return (
              <motion.li
                key={day.full}
                className={`schedule-row ${isToday ? 'is-today' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
                }}
              >
                <span className="schedule-day">{day.full}</span>
                <span className="schedule-time">
                  {schedule.from} <time dateTime={startTime}>{startTime}</time>
                  {schedule.timeSuffix && ` ${schedule.timeSuffix}`}
                </span>
                {isToday && <span className="schedule-today">{schedule.today}</span>}
              </motion.li>
            )
          })}
          <motion.li
            className="schedule-row schedule-row--private"
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
            }}
          >
            <span className="schedule-day">{schedule.privateTitle}</span>
            <span className="schedule-time">{schedule.privateNote}</span>
          </motion.li>
        </motion.ul>
      </div>
    </section>
  )
}
