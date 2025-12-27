import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { faculties, getGroupById, Group } from '../data/scheduleData'
import './FacultiesScreen.css'

const FacultiesScreen: React.FC = () => {
  const navigate = useNavigate()
  const [savedGroup, setSavedGroup] = useState<Group | null>(null)

  useEffect(() => {
    const savedGroupId = localStorage.getItem('savedGroupId')
    if (savedGroupId) {
      const group = getGroupById(savedGroupId)
      if (group) {
        setSavedGroup(group)
      }
    }
  }, [])

  return (
    <div className="faculties-screen">
      <h1 className="screen-title">Расписание | Факультеты</h1>
      <div className="faculties-list">
        {/* Секция 1: Моя группа */}
        {savedGroup && (
          <div className="section-group">
            <h2 className="section-title">Перейти к расписанию</h2>
            <Button
              onClick={() => navigate(`/group/${savedGroup.id}`)}
              variant="secondary"
              fullWidth
              className="my-group-button"
            >
              Моя группа
            </Button>
          </div>
        )}

        {/* Секция 2: Институты */}
        <div className="section-group">
          <h2 className="section-title">Выбрать факультет</h2>
          {faculties.map((faculty) => {
            const hasCourses = faculty.courses.length > 0
            return (
              <Button
                key={faculty.id}
                onClick={() => hasCourses && navigate(`/faculty/${faculty.id}`)}
                variant="secondary"
                fullWidth
                className={!hasCourses ? 'faculty-placeholder' : ''}
              >
                {faculty.name}
              </Button>
            )
          })}
        </div>

        {/* Секция 3: Админ Панель */}
        <div className="section-group">
          <Button
            onClick={() => navigate('/admin')}
            variant="secondary"
            fullWidth
          >
            Админ Панель
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FacultiesScreen


