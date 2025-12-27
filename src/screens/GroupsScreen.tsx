import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { getFacultyById, getGroupsByFacultyId } from '../data/scheduleData'
import './GroupsScreen.css'

const GroupsScreen: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>()
  const navigate = useNavigate()

  const faculty = facultyId ? getFacultyById(facultyId) : null
  const groups = facultyId ? getGroupsByFacultyId(facultyId) : []

  if (!faculty) {
    return (
      <div className="groups-screen">
        <p>Факультет не найден</p>
      </div>
    )
  }

  return (
    <div className="groups-screen">
      <Button
        onClick={() => navigate('/')}
        variant="secondary"
        className="back-button"
      >
        ← Назад
      </Button>
      <h1 className="screen-title">Факультет: {faculty.name}</h1>
      <div className="groups-list">
        {groups.map((group) => (
          <Button
            key={group.id}
            onClick={() => navigate(`/group/${group.id}`)}
            fullWidth
          >
            Группа: {group.number}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GroupsScreen


