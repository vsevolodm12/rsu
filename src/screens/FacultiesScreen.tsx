import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { faculties } from '../data/scheduleData'
import './FacultiesScreen.css'

const FacultiesScreen: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="faculties-screen">
      <h1 className="screen-title">Факультеты</h1>
      <div className="faculties-list">
        {faculties.map((faculty) => (
          <Button
            key={faculty.id}
            onClick={() => navigate(`/faculty/${faculty.id}`)}
            fullWidth
          >
            {faculty.name}
          </Button>
        ))}
        <Button
          onClick={() => navigate('/admin')}
          variant="secondary"
          fullWidth
        >
          Админ Панель
        </Button>
      </div>
    </div>
  )
}

export default FacultiesScreen


