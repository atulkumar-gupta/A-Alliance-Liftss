import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100vh', fontFamily: 'system-ui, sans-serif',
          background: '#0f172a', color: '#e2e8f0', gap: '16px', padding: '24px', textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Something went wrong</h1>
          <pre style={{
            background: '#1e293b', padding: '16px',
            borderRadius: '8px', maxWidth: '700px', width: '100%',
            overflow: 'auto', fontSize: '14px', textAlign: 'left'
          }}>{this.state.error && this.state.error.toString()}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#3b82f6', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px'
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
