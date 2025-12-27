import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: number
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40 }) => {
  return (
    <div className="loading-spinner-container">
      <div
        className="loading-spinner"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          className="spinner-svg"
          viewBox="0 0 50 50"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <circle
            className="spinner-path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default LoadingSpinner

