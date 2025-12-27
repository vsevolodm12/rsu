import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { getGroupById } from '../data/scheduleData'
import './ScheduleScreen.css'

const ScheduleScreen: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [weekType, setWeekType] = useState<'numerator' | 'denominator'>(
    'numerator'
  )

  const group = groupId ? getGroupById(groupId) : null

  if (!group) {
    return (
      <div className="schedule-screen">
        <p>Группа не найдена</p>
      </div>
    )
  }

  const schedule = group.schedule[weekType]
  const typeLabels = {
    lecture: 'Лекция',
    practical: 'Практика',
    lab: 'Лабораторная',
  }

  const handleChangeGroup = () => {
    localStorage.removeItem('savedGroupId')
    navigate('/')
  }

  return (
    <div className="schedule-screen">
      <div className="schedule-header-actions">
        <Button
          onClick={() => navigate(-1)}
          variant="secondary"
          className="back-button"
        >
          ← Назад
        </Button>
        <Button
          onClick={handleChangeGroup}
          variant="secondary"
          className="change-group-button"
        >
          Сменить группу
        </Button>
      </div>
      <h1 className="screen-title">Группа: {group.number}</h1>
      <div className="group-info">
        <p className="group-field">{group.field}</p>
        <p className="group-profile">{group.profile}</p>
      </div>
      <div className="week-toggle">
        <Button
          onClick={() => setWeekType('numerator')}
          variant={weekType === 'numerator' ? 'primary' : 'secondary'}
        >
          Числитель
        </Button>
        <Button
          onClick={() => setWeekType('denominator')}
          variant={weekType === 'denominator' ? 'primary' : 'secondary'}
        >
          Знаменатель
        </Button>
      </div>
      <div className="schedule-container">
        {schedule.map((daySchedule) => (
          <div key={daySchedule.day} className="day-block">
            <h2 className="day-title">{daySchedule.day}</h2>
            <div className="subjects-list">
              {daySchedule.subjects.length > 0 ? (
                daySchedule.subjects.map((subject) => (
                  <div key={subject.id} className={`subject-card ${subject.name === 'Нет пары' ? 'subject-card-empty' : ''}`}>
                    <div className="subject-header">
                      <h3 className="subject-name">{subject.name}</h3>
                      <div className="subject-header-right">
                        {subject.timeStart && subject.timeEnd && (
                          <span className="subject-time">
                            {subject.timeStart} - {subject.timeEnd}
                          </span>
                        )}
                        {subject.name !== 'Нет пары' && (
                          <span className="subject-type">
                            {typeLabels[subject.type]}
                          </span>
                        )}
                      </div>
                    </div>
                    {subject.name !== 'Нет пары' && subject.instructor && (
                      <p className="subject-instructor">{subject.instructor}</p>
                    )}
                    {subject.name !== 'Нет пары' && subject.room && (
                      <p className="subject-room">Аудитория: {subject.room}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-subjects">День самостоятельной работы</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleScreen

