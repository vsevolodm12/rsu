import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { getFacultyById, getCourseById, getGroupsByCourseId } from '../data/scheduleData'
import './GroupsScreen.css'

const GroupsScreen: React.FC = () => {
  const { facultyId, courseId } = useParams<{ facultyId: string; courseId: string }>()
  const navigate = useNavigate()

  const faculty = facultyId ? getFacultyById(facultyId) : null
  const course = courseId ? getCourseById(courseId) : null
  const groups = courseId ? getGroupsByCourseId(courseId) : []

  if (!faculty || !course) {
    return (
      <div className="groups-screen">
        <p>Институт или курс не найден</p>
      </div>
    )
  }

  return (
    <div className="groups-screen">
      <Button
        onClick={() => navigate(`/faculty/${facultyId}`)}
        variant="secondary"
        className="back-button"
      >
        ← Назад
      </Button>
      <div className="header-section">
        <h1 className="screen-title">{faculty.name}</h1>
        <h2 className="screen-subtitle">Выберите Группу</h2>
      </div>
      <div className="groups-list">
        {groups.map((group) => (
          <Button
            key={group.id}
            onClick={() => {
              // Сохраняем выбранную группу в localStorage
              localStorage.setItem('savedGroupId', group.id)
              navigate(`/group/${group.id}`)
            }}
            variant="secondary"
            fullWidth
          >
            {group.number}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GroupsScreen


