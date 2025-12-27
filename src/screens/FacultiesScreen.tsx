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
      <h1 className="screen-title">Факультеты</h1>
      <div className="faculties-list">
        {/* Секция 1: Моя группа */}
        {savedGroup && (
          <div className="section-group">
            <Button
              onClick={() => navigate(`/group/${savedGroup.id}`)}
              variant="secondary"
              fullWidth
            >
              Моя группа: {savedGroup.number}
            </Button>
          </div>
        )}

        {/* Секция 2: Институты */}
        <div className="section-group">
          {faculties.map((faculty) => (
            <Button
              key={faculty.id}
              onClick={() => navigate(`/faculty/${faculty.id}`)}
              variant="secondary"
              fullWidth
            >
              {faculty.name}
            </Button>
          ))}
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


