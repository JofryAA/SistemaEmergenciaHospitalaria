import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, CheckCircle } from 'lucide-react'
import { pacientesData } from '../data/pacientes'
import { useForm } from '../hooks/useForm'
import PersonalDataForm from './PersonalDataForm'

export default function RegistroPage() {
  const navigate = useNavigate()
  const {
    formData,
    errors,
    updateField,
    validate,
    resetForm,
    loadPatient,
  } = useForm()

  const [search, setSearch] = useState('')
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [saved, setSaved] = useState(false)

  const termino = search.toLowerCase().trim()
  const filtrados = pacientesData.filter(
    (p) =>
      p.nombre.toLowerCase().includes(termino) || p.cedula.includes(termino),
  )

  function handleSelectPatient(p) {
    setSelectedPaciente(p)
    setSaved(false)
    loadPatient(p, formData)
  }

  function handleNewPatient() {
    setSelectedPaciente(null)
    setSaved(false)
    resetForm()
  }

  function handleSave() {
    if (!validate()) return
    setSaved(true)
  }

  function handleCancel() {
    if (formData.nombre || formData.cedula || formData.fechaNacimiento || formData.motivoConsulta) {
      if (!window.confirm('¿Está seguro de cancelar? Los datos ingresados se perderán.'))
        return
    }
    handleNewPatient()
  }

  return (
    <div className="app__layout">
      <aside className="pl">
        <div className="pl-header">
          <div>
            <h3 className="pl-title">PACIENTES</h3>
            <p className="pl-subtitle">{filtrados.length} en sistema</p>
          </div>
          <span className="pl-badge">
            Hoy:{' '}
            {new Date().toLocaleDateString('es-DO', {
              day: '2-digit',
              month: 'short',
            }).replace('.', '')}
          </span>
        </div>
        <div style={{ padding: '0.5rem 1rem' }}>
          <div className="subbar-search" style={{ width: '100%' }}>
            <Search size={15} className="subbar-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              className="subbar-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="pl-list">
          {filtrados.length > 0 ? (
            filtrados.map((p) => (
              <div
                key={p.cedula}
                className={`pl-item${selectedPaciente?.cedula === p.cedula ? ' pl-item--active' : ''}`}
                onClick={() => handleSelectPatient(p)}
              >
                <div
                  className="pl-avatar"
                  style={{ backgroundColor: p.bgAvatar, color: p.colorAvatar }}
                >
                  {p.iniciales}
                </div>
                <div className="pl-info">
                  <p className="pl-name">{p.nombre}</p>
                  <p className="pl-id">{p.cedula}</p>
                  {p.sangre && (
                    <div className="pl-meta">
                      <span
                        className="pl-blood"
                        style={{ backgroundColor: p.bgSangre, color: p.colorSangre }}
                      >
                        {p.sangre}
                      </span>
                      <span className="pl-age">{p.edad}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="pl-empty">
              <Search size={36} className="pl-empty-icon" />
              <p>No se encontraron pacientes</p>
              <p className="pl-empty-hint">Intente con otro término de búsqueda</p>
            </div>
          )}
        </div>
        <div className="pl-footer">
          <button className="pl-new-btn" onClick={handleNewPatient}>
            <UserPlus size={16} />
            Nuevo paciente sin registro
          </button>
        </div>
      </aside>

      <main className="app__main">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <button className="btn-back" onClick={() => navigate('/inicio')}>
            ← Volver al inicio
          </button>
        </div>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Paciente registrado exitosamente
            </p>
          </div>
        )}

        <div className="app__grid--single">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <PersonalDataForm
              formData={formData}
              errors={errors}
              onFieldChange={updateField}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '0 0 1rem' }}>
              <button className="footer-btn footer-btn--cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="footer-btn footer-btn--save" onClick={handleSave}>
                <UserPlus size={16} />
                Registrar Paciente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
