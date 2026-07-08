import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

function renderAt(path, authed = false, token = false) {
  localStorage.clear()
  sessionStorage.clear()
  if (authed) localStorage.setItem('satohash_authed', 'true')
  if (token) localStorage.setItem('satohash_token', 'test-jwt-token')

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/access" element={<div>Access Page</div>} />
        <Route
          path="/stamp"
          element={
            <ProtectedRoute>
              <div>Stamp Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('allows /stamp without auth in MVP mode', () => {
    renderAt('/stamp')
    expect(screen.getByText('Stamp Page')).toBeInTheDocument()
  })

  it('redirects protected routes to /access when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/access" element={<div>Access Page</div>} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div>Settings Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Access Page')).toBeInTheDocument()
  })

  it('renders children when satohash_authed is set', () => {
    renderAt('/stamp', true)
    expect(screen.getByText('Stamp Page')).toBeInTheDocument()
  })

  it('renders children when satohash_token is set', () => {
    renderAt('/stamp', false, true)
    expect(screen.getByText('Stamp Page')).toBeInTheDocument()
  })

  it('accepts sessionStorage auth flag', () => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('satohash_authed', 'true')

    render(
      <MemoryRouter initialEntries={['/stamp']}>
        <Routes>
          <Route path="/access" element={<div>Access Page</div>} />
          <Route
            path="/stamp"
            element={
              <ProtectedRoute>
                <div>Stamp Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Stamp Page')).toBeInTheDocument()
  })
})
