import React from 'react'
import './Button.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant} ${fullWidth ? 'button-full-width' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button

