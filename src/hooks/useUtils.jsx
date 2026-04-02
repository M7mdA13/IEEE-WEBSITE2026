import { useState, useCallback } from 'react'

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      )
    }
    return this.props.children
  }
}

// Loading State Hook
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const withLoading = useCallback(async (asyncFunction) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, withLoading, setError }
}

// Form Validation Hook
export function useFormValidation(initialValues, validators) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validators).forEach(field => {
      const error = validators[field](values[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validators])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setValues(prev => ({ ...prev, [name]: newValue }))
    
    // Validate on change if field was touched
    if (touched[name] && validators[name]) {
      const error = validators[name](newValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validators])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    if (validators[name]) {
      const error = validators[name](values[name])
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [values, validators])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return { values, errors, touched, handleChange, handleBlur, validate, reset, setValues }
}

// Network Status Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useState(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Common Validators
export const validators = {
  required: (value) => !value || value.trim() === '' ? 'This field is required' : null,
  email: (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value) ? 'Please enter a valid email' : null
  },
  minLength: (min) => (value) => 
    value && value.length < min ? `Must be at least ${min} characters` : null,
  password: (value) => {
    if (!value) return null
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter'
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain a number'
    return null
  },
  match: (field) => (value, allValues) => 
    value !== allValues[field] ? `Does not match ${field}` : null
}
