import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import './App.css'

type Employee = { id: string; name: string; email: string; role: string; created_at: string }
type Toast = { message: string; type: 'success' | 'error' }
type EmployeePage = { employees: Employee[]; total: number; page: number; totalPages: number }
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', timeout: 10000 })
const emptyForm = { name: '', email: '', role: '' }

function errorMessage(error: unknown) {
  return axios.isAxiosError(error)
    ? error.response?.data?.message || 'Cannot reach the server. Please check that the backend is running.'
    : 'Something went wrong. Please try again.'
}

function App() {
  const [data, setData] = useState<EmployeePage>({ employees: [], total: 0, page: 1, totalPages: 1 })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)

  function showToast(message: string, type: Toast['type'] = 'error') {
    setToast({ message, type })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setLoadError('')
      try {
        const response = await api.get<EmployeePage>('/employees', {
          params: { search, page, limit: 5 }, signal: controller.signal,
        })
        setData(response.data)
      } catch (error) {
        if (!controller.signal.aborted) {
          const message = errorMessage(error)
          setLoadError(message)
          showToast(message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => { clearTimeout(timer); controller.abort() }
  }, [search, page, refresh])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const role = form.role.trim()
    if (!name || name.length > 100) {
      showToast('Enter a full name of up to 100 characters.')
      return
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Enter a valid email address, such as name@company.com.')
      return
    }
    if (!role || role.length > 32) {
      showToast('Enter a job role of up to 32 characters.')
      return
    }
    const input = { name, email, role }
    setSaving(true)
    setToast(null)
    try {
      if (editingId) await api.put(`/employees/${editingId}`, input)
      else await api.post('/employees', input)
      showToast(editingId ? 'Employee updated.' : 'Employee added.', 'success')
      resetForm()
      setPage(1)
      setRefresh(value => value + 1)
    } catch (error) { showToast(errorMessage(error)) }
    finally { setSaving(false) }
  }

  async function deleteEmployee(employee: Employee) {
    if (!window.confirm(`Delete ${employee.name} from the directory?`)) return
    setDeletingId(employee.id)
    setToast(null)
    try {
      await api.delete(`/employees/${employee.id}`)
      if (editingId === employee.id) resetForm()
      showToast('Employee deleted.', 'success')
      setPage(data.page)
      setRefresh(value => value + 1)
    } catch (error) { showToast(errorMessage(error)) }
    finally { setDeletingId(null) }
  }

  return (
    <main className="container">
      <header>
        <span className="eyebrow">TEAM MANAGEMENT</span>
        <h1>Employee Directory</h1>
        <p>Keep your team's details in one place.</p>
      </header>
      {toast && (
        <div className={`toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">×</button>
        </div>
      )}
      {loadError && <div className="message error" role="alert">{loadError} <button onClick={() => setRefresh(value => value + 1)}>Retry</button></div>}
      <div className="layout">
        <section className="card form-card">
          <h2>{editingId ? 'Edit employee' : 'Add employee'}</h2>
          <p className="muted">Enter the employee's contact details.</p>
          <form onSubmit={saveEmployee}>
            <label htmlFor="name">Full name</label>
            <input id="name" aria-describedby="name-hint" autoComplete="name" placeholder="e.g. Anupam Yadav" required maxLength={100} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} disabled={saving} />
            <small id="name-hint" className="field-hint">Enter your full name, up to 100 characters.</small>
            <label htmlFor="email">Email address</label>
            <input id="email" aria-describedby="email-hint" type="email" autoComplete="email" placeholder="name@company.com" required maxLength={254} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} disabled={saving} />
            <small id="email-hint" className="field-hint">Use a valid email, such as name@company.com.</small>
            <label htmlFor="role">Job role</label>
            <input id="role" aria-describedby="role-hint" placeholder="e.g. Software Developer" required maxLength={32} value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} disabled={saving} />
            <small id="role-hint" className="field-hint">Enter a job title, up to 32 characters.</small>
            <button className="primary" disabled={saving || deletingId !== null} type="submit">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add employee'}</button>
            {editingId && <button className="cancel" type="button" onClick={resetForm} disabled={saving}>Cancel editing</button>}
          </form>
        </section>
        <section className="card directory" aria-busy={loading}>
          <div className="list-header"><div><h2>Employees <span className="count">{data.total}</span></h2><p className="muted">Browse and manage your team.</p></div></div>
          <label className="search-label" htmlFor="search">Search by name</label>
          <input id="search" type="search" placeholder="Search employees..." value={search} onChange={event => { setSearch(event.target.value); setPage(1); setLoading(true) }} />
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={4} className="empty">Loading employees...</td></tr> : loadError ? <tr><td colSpan={4} className="empty">Unable to load employees. Please retry.</td></tr> : data.employees.length === 0 ? <tr><td colSpan={4} className="empty">{search ? 'No employees match your search.' : 'No employees yet. Add your first team member.'}</td></tr> : data.employees.map(employee => (
                  <tr key={employee.id}>
                    <td className="employee-name">{employee.name}</td><td>{employee.email}</td><td><span className="role">{employee.role}</span></td>
                    <td><div className="actions"><button disabled={saving || deletingId !== null} onClick={() => { setEditingId(employee.id); setForm({ name: employee.name, email: employee.email, role: employee.role }); setToast(null); document.getElementById('name')?.focus() }} aria-label={`Edit ${employee.name}`}>Edit</button><button className="delete" disabled={saving || deletingId !== null} onClick={() => deleteEmployee(employee)} aria-label={`Delete ${employee.name}`}>{deletingId === employee.id ? 'Deleting...' : 'Delete'}</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination"><span>Page {data.page} of {data.totalPages}</span><div className="actions"><button disabled={loading || data.page <= 1} onClick={() => { setPage(data.page - 1); setLoading(true) }}>Previous</button><button disabled={loading || data.page >= data.totalPages} onClick={() => { setPage(data.page + 1); setLoading(true) }}>Next</button></div></div>
        </section>
      </div>
    </main>
  )
}

export default App
