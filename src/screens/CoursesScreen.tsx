import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { getFacultyById, getCoursesByFacultyId } from '../data/scheduleData'
import './CoursesScreen.css'

const CoursesScreen: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>()
  const navigate = useNavigate()

  const faculty = facultyId ? getFacultyById(facultyId) : null
  const coursesList = facultyId ? getCoursesByFacultyId(facultyId) : []

  if (!faculty) {
    return (
      <div className="courses-screen">
        <p>Институт не найден</p>
      </div>
    )
  }

  return (
    <div className="courses-screen">
      <Button
        onClick={() => navigate('/')}
        variant="secondary"
        className="back-button"
      >
        ← Назад
      </Button>
      <div className="header-section">
        <h1 className="screen-title">{faculty.name}</h1>
        <h2 className="screen-subtitle">Выберите Курс</h2>
      </div>
      <div className="courses-list">
        {coursesList.map((course) => {
          const hasGroups = course.groups.length > 0
          return (
            <Button
              key={course.id}
              onClick={() => hasGroups && navigate(`/faculty/${facultyId}/course/${course.id}`)}
              variant="secondary"
              fullWidth
              className={!hasGroups ? 'course-placeholder' : ''}
            >
              Курс {course.number}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default CoursesScreen

