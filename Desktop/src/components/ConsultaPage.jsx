import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Stethoscope,
  History,
  X,
  Heart,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import { pacientesData } from '../data/pacientes'
import { addConsulta, getConsultasByPaciente, updateConsultaField } from '../data/consultas'
import { triageColors, signosVitalesFields, consultaStatus } from '../data/constants'
import { useForm } from '../hooks/useForm'
import ClinicalEntryForm from './ClinicalEntryForm'

const bypassTriage = (id) => id === 'I' || id === 'II'

export default function ConsultaPage() {
  const navigate = useNavigate()
  const {
    formData,
    errors,
    updateField,
    validateConsulta,
    resetForm,
    loadPatient,
  } = useForm()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [saved, setSaved] = useState(false)
  const [detalleConsulta, setDetalleConsulta] = useState(null)

  const termino = searchTerm.toLowerCase().trim()
  const resultados = pacientesData.filter(
    (p) =>
      !termino ||
      p.nombre.toLowerCase().includes(termino) ||
      p.cedula.includes(termino),
  )

  const consultasPrevias = selectedPaciente
    ? getConsultasByPaciente(selectedPaciente.cedula)
    : []

  const bypass = bypassTriage(formData.triage)

  function handleSelectPatient(p) {
    setSelectedPaciente(p)
    setSaved(false)
    loadPatient(p, formData)
  }

  function handleSave() {
    if (!selectedPaciente) return
    if (!validateConsulta()) return

    addConsulta({
      pacienteCedula: selectedPaciente.cedula,
      pacienteNombre: selectedPaciente.nombre,
      ...formData,
      signosVitalesBypass: bypass,
    })

    setSaved(true)
    setSelectedPaciente(null)
    resetForm()
  }

  function handleCancel() {
    setSelectedPaciente(null)
    resetForm()
  }

  function getTriageBg(triageId) {
    return triageColors[parseInt(triageId)]?.bg || '#6b7280'
  }

  return (
    <div className="app__layout">
      <aside className="pl">
        <div className="pl-header">
          <h3 className="pl-title">SELECCIONAR PACIENTE</h3>
        </div>
        <div style={{ padding: '0.75rem 1rem' }}>
          <div className="subbar-search" style={{ width: '100%' }}>
            <Search size={15} className="subbar-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              className="subbar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        {!selectedPaciente && (
          <p style={{ padding: '0 1rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>
            Seleccione un paciente para iniciar la consulta
          </p>
        )}
        <div className="pl-list">
          {resultados.length > 0 ? (
            resultados.map((p) => (
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
                </div>
              </div>
            ))
          ) : (
            <div className="pl-empty">
              <Search size={36} className="pl-empty-icon" />
              <p>No se encontraron pacientes</p>
            </div>
          )}
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
              ✅ Consulta registrada exitosamente
            </p>
          </div>
        )}

        {selectedPaciente ? (
          <><div className="app__grid--single">
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600, marginBottom: '4px' }}>
                Consulta para: {selectedPaciente.nombre}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {selectedPaciente.cedula} · {selectedPaciente.edad || 'Edad desconocida'}
                {selectedPaciente.sangre ? ` · ${selectedPaciente.sangre}` : ''}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ClinicalEntryForm
                formData={formData}
                errors={errors}
                onFieldChange={updateField}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="footer-btn footer-btn--cancel" onClick={handleCancel}>
                  Cancelar
                </button>
                <button className="footer-btn footer-btn--save" onClick={handleSave}>
                  <Stethoscope size={16} />
                  {bypass ? 'Registrar Emergencia' : 'Registrar Consulta'}
                </button>
              </div>
            </div>

            {consultasPrevias.length > 0 && (
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h2 className="card__header">
                  <History size={18} className="card__header-icon" />
                  HISTORIAL DE CONSULTAS ({consultasPrevias.length})
                </h2>
                <div className="card__body" style={{ padding: '0.5rem 1rem 1rem' }}>
                  {consultasPrevias.map((c, i) => {
                    const triageBg = getTriageBg(c.triage)
                    return (
                      <div
                        key={c.id}
                        onClick={() => setDetalleConsulta(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '0.75rem 0',
                          borderBottom: i < consultasPrevias.length - 1 ? '1px solid #f1f5f9' : 'none',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: triageBg,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {c.triage}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                            {c.motivoConsulta?.slice(0, 80)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                            {c.fecha} · {c.horaLlegada}
                            {c.status === 'atendido' ? ' · Atendido' : c.status === 'en_atencion' ? ' · En atención' : ' · Pendiente'}
                          </div>
                        </div>
                        {c.signosVitalesBypass && (
                          <span style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            color: '#dc2626',
                            background: '#fef2f2',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                          }}>
                            BYPASS
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {detalleConsulta && (
            <div className="modal-overlay" onClick={() => setDetalleConsulta(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                  <h3 className="modal__title">
                    <History size={16} />
                    Detalle de Consulta
                  </h3>
                  <button className="modal__close" onClick={() => setDetalleConsulta(null)}>
                    <X size={18} />
                  </button>
                </div>
                <div className="modal__body">
                  <div className="modal__section">
                    <span className="modal__label">Paciente</span>
                    <span className="modal__value">{detalleConsulta.pacienteNombre}</span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Cédula</span>
                    <span className="modal__value">{detalleConsulta.pacienteCedula}</span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Fecha / Hora</span>
                    <span className="modal__value">{detalleConsulta.fecha} · {detalleConsulta.horaLlegada}</span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Modo de Llegada</span>
                    <span className="modal__value">{detalleConsulta.modoLlegada}</span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Triage</span>
                    <span className="modal__value">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: getTriageBg(detalleConsulta.triage),
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                        }}>
                          {detalleConsulta.triage}
                        </span>
                        {detalleConsulta.triage === 'I' ? 'Resucitación (Rojo)' :
                         detalleConsulta.triage === 'II' ? 'Emergencia (Naranja)' :
                         detalleConsulta.triage === 'III' ? 'Urgente (Amarillo)' :
                         detalleConsulta.triage === 'IV' ? 'Semi-urgente (Verde)' :
                         'No urgente (Azul)'}
                      </span>
                    </span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Motivo de Consulta</span>
                    <span className="modal__value" style={{ whiteSpace: 'pre-wrap' }}>{detalleConsulta.motivoConsulta}</span>
                  </div>
                  <div className="modal__section">
                    <span className="modal__label">Alergias</span>
                    <span className="modal__value">{detalleConsulta.alergias || 'Ninguna reportada'}</span>
                  </div>

                  {detalleConsulta.signosVitalesBypass ? (
                    <div className="modal__bypass-banner">
                      <Activity size={18} />
                      <div>
                        <strong>BYPASS DE SIGNOS VITALES ACTIVADO</strong>
                        <p>Paciente clasificado como Triage {detalleConsulta.triage} — atención prioritaria sin registro de signos vitales.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="modal__section">
                      <span className="modal__label">
                        <Heart size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Signos Vitales
                      </span>
                      <div className="modal__vitals-grid">
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">PA</span>
                          <span className="modal__vital-value">{detalleConsulta.presionArterial || '—'}</span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">FC</span>
                          <span className="modal__vital-value">{detalleConsulta.frecuenciaCardiaca || '—'} <small>lpm</small></span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">FR</span>
                          <span className="modal__vital-value">{detalleConsulta.frecuenciaRespiratoria || '—'} <small>rpm</small></span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">Temp</span>
                          <span className="modal__vital-value">{detalleConsulta.temperatura || '—'} <small>°C</small></span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">SpO2</span>
                          <span className="modal__vital-value">{detalleConsulta.saturacionO2 || '—'} <small>%</small></span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">Peso</span>
                          <span className="modal__vital-value">{detalleConsulta.peso || '—'} <small>kg</small></span>
                        </div>
                        <div className="modal__vital-item">
                          <span className="modal__vital-label">Talla</span>
                          <span className="modal__vital-value">{detalleConsulta.talla || '—'} <small>m</small></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detalleConsulta.observaciones && (
                    <div className="modal__section">
                      <span className="modal__label">Observaciones</span>
                      <span className="modal__value" style={{ whiteSpace: 'pre-wrap' }}>{detalleConsulta.observaciones}</span>
                    </div>
                  )}

                  <div className="modal__section">
                    <span className="modal__label">Estado</span>
                    <span className="modal__value">
                      {detalleConsulta.status === 'pendiente' ? 'Pendiente' :
                       detalleConsulta.status === 'en_atencion' ? 'En Atención' :
                       'Atendido'}
                    </span>
                  </div>

                  <div className="modal__actions">
                    <button
                      className="footer-btn footer-btn--cancel"
                      onClick={() => {
                        updateConsultaField(detalleConsulta.id, 'signosVitalesBypass', !detalleConsulta.signosVitalesBypass)
                        setDetalleConsulta({ ...detalleConsulta, signosVitalesBypass: !detalleConsulta.signosVitalesBypass })
                      }}
                    >
                      <AlertTriangle size={14} />
                      {detalleConsulta.signosVitalesBypass ? 'Desactivar Bypass' : 'Activar Bypass'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </>
        ) : (
          <div className="app__grid--single">
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <Search size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
                Seleccione un paciente
              </h3>
              <p style={{ fontSize: '0.85rem' }}>
                Busque un paciente en el panel lateral para iniciar una consulta
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
