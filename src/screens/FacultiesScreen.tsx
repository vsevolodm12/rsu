import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { faculties, getGroupById, Group } from '../data/scheduleData'
import './FacultiesScreen.css'

const FacultiesScreen: React.FC = () => {
  const navigate = useNavigate()
  const [savedGroup, setSavedGroup] = useState<Group | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const isPulling = useRef<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedGroupId = localStorage.getItem('savedGroupId')
    if (savedGroupId) {
      const group = getGroupById(savedGroupId)
      if (group) {
        setSavedGroup(group)
      }
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        isPulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return
      
      currentY.current = e.touches[0].clientY
      const distance = currentY.current - startY.current
      
      if (distance > 0 && window.scrollY === 0) {
        const pullAmount = Math.min(distance * 0.5, 100)
        setPullDistance(pullAmount)
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      if (isPulling.current && pullDistance > 50) {
        setIsRefreshing(true)
        // Симуляция обновления данных
        setTimeout(() => {
          const savedGroupId = localStorage.getItem('savedGroupId')
          if (savedGroupId) {
            const group = getGroupById(savedGroupId)
            if (group) {
              setSavedGroup(group)
            }
          }
          setIsRefreshing(false)
          setPullDistance(0)
        }, 1000)
      } else {
        setPullDistance(0)
      }
      isPulling.current = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance])

  return (
    <div className="faculties-screen" ref={containerRef}>
      <div
        className="pull-to-refresh-indicator"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 50)}px)`,
          opacity: pullDistance > 20 ? Math.min(1, (pullDistance - 20) / 30) : 0,
        }}
      >
        {isRefreshing || pullDistance > 50 ? (
          <LoadingSpinner size={32} />
        ) : (
          <div className="pull-hint">Потяните для обновления</div>
        )}
      </div>
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


