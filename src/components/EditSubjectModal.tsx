import React, { useState, useEffect } from 'react'
import { Subject } from '../data/scheduleData'
import Button from './Button'
import CustomSelect from './CustomSelect'
import './EditSubjectModal.css'

interface EditSubjectModalProps {
  subject: Subject | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedSubject: Subject) => void
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({
  subject,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    type: 'lecture',
    instructor: '',
    room: '',
    timeStart: '',
    timeEnd: '',
  })

  useEffect(() => {
    if (subject) {
      // Конвертируем время из формата "7:45" в "07:45" для input type="time"
      const formatTimeForInput = (time: string): string => {
        if (!time) return ''
        const parts = time.split(':')
        if (parts.length === 2) {
          const hours = parts[0].padStart(2, '0')
          const minutes = parts[1]
          return `${hours}:${minutes}`
        }
        return time
      }

      setFormData({
        name: subject.name,
        type: subject.type,
        instructor: subject.instructor,
        room: subject.room,
        timeStart: formatTimeForInput(subject.timeStart),
        timeEnd: formatTimeForInput(subject.timeEnd),
      })
    }
  }, [subject])

  if (!isOpen || !subject) return null

  const handleSave = () => {
    // Конвертируем время обратно из формата "07:45" в "7:45"
    const formatTimeFromInput = (time: string): string => {
      if (!time) return ''
      const parts = time.split(':')
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10).toString()
        const minutes = parts[1]
        return `${hours}:${minutes}`
      }
      return time
    }

    const updatedSubject: Subject = {
      ...subject,
      ...formData,
      name: formData.name || subject.name,
      type: formData.type || subject.type,
      instructor: formData.instructor || '',
      room: formData.room || '',
      timeStart: formatTimeFromInput(formData.timeStart || subject.timeStart),
      timeEnd: formatTimeFromInput(formData.timeEnd || subject.timeEnd),
    }
    onSave(updatedSubject)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Редактировать предмет</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">Название предмета</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Тип занятия</label>
            <CustomSelect
              value={formData.type || 'lecture'}
              options={[
                { value: 'lecture', label: 'Лекция' },
                { value: 'practical', label: 'Практика' },
                { value: 'lab', label: 'Лабораторная' },
              ]}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as 'lecture' | 'practical' | 'lab',
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Преподаватель</label>
            <input
              type="text"
              className="form-input"
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Аудитория</label>
            <input
              type="text"
              className="form-input"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Время начала</label>
              <input
                type="time"
                className="form-input"
                value={formData.timeStart}
                onChange={(e) =>
                  setFormData({ ...formData, timeStart: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Время окончания</label>
              <input
                type="time"
                className="form-input"
                value={formData.timeEnd}
                onChange={(e) =>
                  setFormData({ ...formData, timeEnd: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-actions">
            <Button onClick={handleCancel} variant="secondary">
              Отмена
            </Button>
            <Button onClick={handleSave} variant="primary">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSubjectModal

