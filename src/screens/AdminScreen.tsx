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
  getGroupsByFacultyId,
} from '../data/scheduleData'
import './AdminScreen.css'

const AdminScreen: React.FC = () => {
  const navigate = useNavigate()
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
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

  const handleEdit = (subject: Subject, day: string) => {
    setEditingSubject({ subject, day })
    setIsModalOpen(true)
  }

  const handleSave = (updatedSubject: Subject) => {
    if (!selectedGroup || !editingSubject) return

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
      deleteSubject(selectedGroup, selectedWeek, day, subjectId)
      
      // Принудительно обновляем компонент
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  const selectedFacultyData = selectedFaculty
    ? faculties.find((f) => f.id === selectedFaculty)
    : null

  const availableGroups = selectedFaculty
    ? getGroupsByFacultyId(selectedFaculty)
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
    setSelectedGroup(null)
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
  }

  const handleBackToFaculties = () => {
    setSelectedFaculty(null)
    setSelectedGroup(null)
  }

  const handleBackToGroups = () => {
    setSelectedGroup(null)
  }

  return (
    <div className="admin-screen">
      <Button
        onClick={() => navigate('/')}
        variant="secondary"
        className="back-button"
      >
        ← Назад
      </Button>
      <h1 className="screen-title">Админ Панель</h1>

      {!selectedFaculty ? (
        <div className="admin-controls">
          <div className="control-group">
            <label className="control-label">Выберите Институт</label>
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
          </div>
        </div>
      ) : !selectedGroup ? (
        <div className="admin-controls">
          <button
            onClick={handleBackToFaculties}
            className="back-text-button"
          >
            Назад
          </button>
          <h2 className="faculty-subtitle">{selectedFacultyData?.name}</h2>
          <div className="control-group">
            <label className="control-label">Выберите Группу</label>
            <div className="groups-list">
              {availableGroups.map((group) => (
                <Button
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  variant="primary"
                  fullWidth
                >
                  Группа: {group.number}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-controls">
            <button
              onClick={handleBackToGroups}
              className="back-text-button"
            >
              Назад
            </button>
            <h2 className="faculty-subtitle">{selectedFacultyData?.name}</h2>
            <div className="control-group">
              <label className="control-label">
                Группа: {selectedGroupData?.number}
              </label>
              <div className="control-group">
                <label className="control-label">Неделя</label>
                <div className="week-toggle">
                  <Button
                    onClick={() => setSelectedWeek('numerator')}
                    variant={selectedWeek === 'numerator' ? 'primary' : 'secondary'}
                  >
                    Числитель
                  </Button>
                  <Button
                    onClick={() => setSelectedWeek('denominator')}
                    variant={selectedWeek === 'denominator' ? 'primary' : 'secondary'}
                  >
                    Знаменатель
                  </Button>
                </div>
              </div>
            </div>
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

