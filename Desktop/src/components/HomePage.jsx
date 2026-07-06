import { useNavigate } from 'react-router-dom'
import {
  Users,
  Clock,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Stethoscope,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getConsultasDelDia,
  getConsultasResumen,
} from '../data/consultas'
import { triageColors } from '../data/constants'
import './HomePage.css'

const statusConfig = {
  pendiente: { label: 'En Espera', color: '#eab308', bg: '#fefce8', icon: Clock },
  en_atencion: { label: 'En Atención', color: '#ea580c', bg: '#fff7ed', icon: ClipboardList },
  atendido: { label: 'Atendido', color: '#16a34a', bg: '#f0fdf4', icon: TrendingUp },
}

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const resumen = getConsultasResumen()
  const consultasHoy = getConsultasDelDia()

  const stats = [
    { label: 'Pacientes hoy', value: resumen.total, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'En espera', value: resumen.enEspera, icon: Clock, color: '#eab308', bg: '#fefce8' },
    { label: 'En atención', value: resumen.enAtencion, icon: ClipboardList, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Atendidos hoy', value: resumen.atendidos, icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
  ]

  const actions = [
    {
      label: 'Registrar Paciente',
      desc: 'Ingrese un nuevo paciente al sistema',
      icon: UserPlus,
      path: '/registro',
      color: '#3b82f6',
    },
    {
      label: 'Nueva Consulta',
      desc: 'Registre una entrada clínica con triage',
      icon: Stethoscope,
      path: '/consulta',
      color: '#8b5cf6',
    },
  ]

  function getTriageColor(triageId) {
    const level = triageColors[parseInt(triageId) || 5]
    return level?.bg || '#6b7280'
  }

  return (
    <div className="home">
      <div className="home__welcome">
        <div>
          <h1 className="home__greeting">
            Bienvenido, <span className="home__greeting-name">{user?.nombre}</span>
          </h1>
          <p className="home__greeting-role">{user?.rol}</p>
        </div>
        <p className="home__date">
          {new Date().toLocaleDateString('es-DO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="home__stats">
        {stats.map((s) => (
          <div key={s.label} className="home__stat-card" style={{ background: s.bg, borderLeft: `4px solid ${s.color}` }}>
            <div className="home__stat-icon" style={{ color: s.color }}>
              <s.icon size={24} />
            </div>
            <div className="home__stat-info">
              <span className="home__stat-value">{s.value}</span>
              <span className="home__stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="home__actions">
        <h2 className="home__section-title">Acciones rápidas</h2>
        <div className="home__action-cards">
          {actions.map((a) => (
            <div
              key={a.label}
              className="home__action-card"
              onClick={() => navigate(a.path)}
            >
              <div className="home__action-icon" style={{ color: a.color, background: `${a.color}15` }}>
                <a.icon size={28} />
              </div>
              <div className="home__action-info">
                <h3>{a.label}</h3>
                <p>{a.desc}</p>
              </div>
              <ChevronRight size={20} className="home__action-arrow" />
            </div>
          ))}
        </div>
      </div>

      <div className="home__consultas">
        <div className="home__consultas-header">
          <h2 className="home__section-title">Pacientes de Hoy</h2>
          {consultasHoy.length > 0 && (
            <span className="pl-badge">{consultasHoy.length} en total</span>
          )}
        </div>

        {consultasHoy.length === 0 ? (
          <div className="home__empty-consultas">
            <ClipboardList size={36} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              No hay consultas registradas hoy
            </p>
            <button
              className="home__empty-action"
              onClick={() => navigate('/consulta')}
            >
              Registrar primera consulta <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="home__consultas-list">
            <div className="home__consultas-columns">
              {['pendiente', 'en_atencion', 'atendido'].map((status) => {
                const cfg = statusConfig[status]
                const items = consultasHoy.filter((c) => c.status === status)
                const Icon = cfg.icon
                return (
                  <div key={status} className="home__consultas-column" style={{ borderTopColor: cfg.color }}>
                    <div className="home__column-header" style={{ color: cfg.color }}>
                      <Icon size={16} />
                      <span>{cfg.label}</span>
                      <span className="home__column-count">{items.length}</span>
                    </div>
                    <div className="home__column-list">
                      {items.length === 0 ? (
                        <div className="home__column-empty">
                          <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>—</p>
                        </div>
                      ) : (
                        items.map((c) => {
                          const triageColor = getTriageColor(c.triage)
                          return (
                            <div key={c.id} className="home__consulta-card">
                              <div className="home__consulta-top">
                                <span
                                  className="home__triage-dot"
                                  style={{ backgroundColor: triageColor }}
                                >
                                  {c.triage}
                                </span>
                                <span className="home__consulta-name">{c.pacienteNombre}</span>
                              </div>
                              <div className="home__consulta-meta">
                                <span>{c.motivoConsulta?.slice(0, 60)}</span>
                              </div>
                              <div className="home__consulta-bottom">
                                <span className="home__consulta-time">
                                  {c.horaLlegada}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
