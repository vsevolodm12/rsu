import React from 'react'
import './Button.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className = '',
}) => {
  return (
    <button
      className={`button button-${variant} ${fullWidth ? 'button-full-width' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button

