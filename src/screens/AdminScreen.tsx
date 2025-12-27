import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import EditSubjectModal from '../components/EditSubjectModal'
import {
  groups,
  faculties,
  Subject,
  updateSubject,
  deleteSubject,
  getCoursesByFacultyId,
  getGroupsByCourseId,
  getSubjectById,
} from '../data/scheduleData'
import './AdminScreen.css'

const AdminScreen: React.FC = () => {
  const navigate = useNavigate()
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<'numerator' | 'denominator'>(
    'numerator'
  )
  const [editingSubject, setEditingSubject] = useState<{
    subject: Subject
    day: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [history, setHistory] = useState<Array<{
    groupId: string
    week: 'numerator' | 'denominator'
    day: string
    subjectId: string
    previousSubject: Subject
  }>>([])

  const handleEdit = (subject: Subject, day: string) => {
    setEditingSubject({ subject, day })
    setIsModalOpen(true)
  }

  const handleSave = (updatedSubject: Subject) => {
    if (!selectedGroup || !editingSubject) return

    // Сохраняем предыдущее состояние в историю
    setHistory((prev) => [
      ...prev,
      {
        groupId: selectedGroup,
        week: selectedWeek,
        day: editingSubject.day,
        subjectId: editingSubject.subject.id,
        previousSubject: { ...editingSubject.subject },
      },
    ])

    updateSubject(
      selectedGroup,
      selectedWeek,
      editingSubject.day,
      editingSubject.subject.id,
      updatedSubject
    )

    // Принудительно обновляем компонент
    setRefreshKey((prev) => prev + 1)
    
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  const handleDelete = (subjectId: string, day: string) => {
    if (!selectedGroup) return

    if (confirm('Удалить предмет?')) {
      // Получаем текущий предмет перед удалением
      const currentSubject = getSubjectById(selectedGroup, selectedWeek, day, subjectId)
      if (currentSubject) {
        // Сохраняем предыдущее состояние в историю
        setHistory((prev) => [
          ...prev,
          {
            groupId: selectedGroup,
            week: selectedWeek,
            day: day,
            subjectId: subjectId,
            previousSubject: { ...currentSubject },
          },
        ])
      }

      deleteSubject(selectedGroup, selectedWeek, day, subjectId)
      
      // Принудительно обновляем компонент
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleUndo = () => {
    if (history.length === 0 || !selectedGroup) return

    const lastAction = history[history.length - 1]
    
    // Восстанавливаем предыдущее состояние
    updateSubject(
      lastAction.groupId,
      lastAction.week,
      lastAction.day,
      lastAction.subjectId,
      lastAction.previousSubject
    )

    // Удаляем последнее действие из истории
    setHistory((prev) => prev.slice(0, -1))
    
    // Принудительно обновляем компонент
    setRefreshKey((prev) => prev + 1)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  const selectedFacultyData = selectedFaculty
    ? faculties.find((f) => f.id === selectedFaculty)
    : null

  const availableCourses = selectedFaculty
    ? getCoursesByFacultyId(selectedFaculty)
    : []

  const availableGroups = selectedCourse
    ? getGroupsByCourseId(selectedCourse)
    : []

  const selectedGroupData = selectedGroup
    ? groups.find((g) => g.id === selectedGroup)
    : null

  const schedule = selectedGroupData
    ? selectedGroupData.schedule[selectedWeek]
    : []

  const typeLabels = {
    lecture: 'Лекция',
    practical: 'Практика',
    lab: 'Лабораторная',
  }

  const handleFacultySelect = (facultyId: string) => {
    setSelectedFaculty(facultyId)
    setSelectedCourse(null)
    setSelectedGroup(null)
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    setSelectedGroup(null)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
    setHistory([]) // Очищаем историю при смене группы
  }

  const handleBackToFaculties = () => {
    setSelectedFaculty(null)
    setSelectedCourse(null)
    setSelectedGroup(null)
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    setSelectedGroup(null)
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null)
  }

  const handleBack = () => {
    if (selectedGroup) {
      handleBackToGroups()
    } else if (selectedCourse) {
      handleBackToCourses()
    } else if (selectedFaculty) {
      handleBackToFaculties()
    } else {
      navigate('/')
    }
  }

  return (
    <div className="admin-screen">
      <Button
        onClick={handleBack}
        variant="secondary"
        className="back-button"
      >
        ← Назад
      </Button>

      {!selectedFaculty ? (
        <>
          <div className="header-section">
            <h1 className="screen-title">Выберите Институт</h1>
          </div>
          <div className="faculties-list">
            {faculties.map((faculty) => (
              <Button
                key={faculty.id}
                onClick={() => handleFacultySelect(faculty.id)}
                variant="primary"
                fullWidth
              >
                {faculty.name}
              </Button>
            ))}
          </div>
        </>
      ) : !selectedCourse ? (
        <>
          <div className="header-section">
            <h1 className="screen-title">{selectedFacultyData?.name}</h1>
            <h2 className="screen-subtitle">Выберите Курс</h2>
          </div>
          <div className="courses-list">
            {availableCourses.map((course) => {
              const hasGroups = course.groups.length > 0
              return (
                <Button
                  key={course.id}
                  onClick={() => hasGroups && handleCourseSelect(course.id)}
                  variant="secondary"
                  fullWidth
                  className={!hasGroups ? 'course-placeholder' : ''}
                >
                  Курс {course.number}
                </Button>
              )
            })}
          </div>
        </>
      ) : !selectedGroup ? (
        <>
          <div className="header-section">
            <h1 className="screen-title">{selectedFacultyData?.name}</h1>
            <h2 className="screen-subtitle">Выберите Группу</h2>
          </div>
          <div className="groups-list">
            {availableGroups.map((group) => (
              <Button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                variant="secondary"
                fullWidth
              >
                {group.number}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="header-section">
            <h1 className="screen-title">{selectedFacultyData?.name}</h1>
          </div>
          <div className="admin-actions">
            <Button
              onClick={handleUndo}
              variant="secondary"
              disabled={history.length === 0}
            >
              Вернуть
            </Button>
          </div>
          <div className="week-toggle">
            <Button
              onClick={() => {
                setSelectedWeek('numerator')
                setHistory([]) // Очищаем историю при смене недели
              }}
              variant={selectedWeek === 'numerator' ? 'primary' : 'secondary'}
            >
              Числитель
            </Button>
            <Button
              onClick={() => {
                setSelectedWeek('denominator')
                setHistory([]) // Очищаем историю при смене недели
              }}
              variant={selectedWeek === 'denominator' ? 'primary' : 'secondary'}
            >
              Знаменатель
            </Button>
          </div>
        </>
      )}

      {selectedGroupData && (
        <div className="admin-schedule" key={refreshKey}>
          <h2 className="admin-group-title">
            Группа: {selectedGroupData.number}
          </h2>
          <div className="schedule-container">
            {schedule.map((daySchedule) => (
              <div key={daySchedule.day} className="day-block">
                <h3 className="day-title">{daySchedule.day}</h3>
                <div className="subjects-list">
                  {daySchedule.subjects.length > 0 ? (
                    daySchedule.subjects.map((subject) => (
                      <div key={subject.id} className="subject-card-admin">
                        <div className="subject-info">
                          <div className="subject-header">
                            <h4 className="subject-name">{subject.name}</h4>
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
                            <p className="subject-instructor">
                              {subject.instructor}
                            </p>
                          )}
                          {subject.name !== 'Нет пары' && subject.room && (
                            <p className="subject-room">
                              Аудитория: {subject.room}
                            </p>
                          )}
                        </div>
                        <div className="subject-actions">
                          <Button
                            onClick={() => handleEdit(subject, daySchedule.day)}
                            variant="secondary"
                          >
                            Редактировать
                          </Button>
                          {subject.name !== 'Нет пары' && (
                            <Button
                              onClick={() => handleDelete(subject.id, daySchedule.day)}
                              variant="secondary"
                            >
                              Удалить
                            </Button>
                          )}
                        </div>
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
      )}

      <EditSubjectModal
        subject={editingSubject?.subject || null}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
      />
    </div>
  )
}

export default AdminScreen

