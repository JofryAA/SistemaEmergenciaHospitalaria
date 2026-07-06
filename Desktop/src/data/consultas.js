let consultasData = []
let nextId = 1

export function getConsultas() {
  return consultasData
}

export function getConsultasByStatus(status) {
  const today = new Date().toISOString().slice(0, 10)
  return consultasData.filter(
    (c) => c.status === status && c.fecha === today,
  )
}

export function getConsultasResumen() {
  const today = new Date().toISOString().slice(0, 10)
  const hoy = consultasData.filter((c) => c.fecha === today)
  return {
    total: hoy.length,
    enEspera: hoy.filter((c) => c.status === 'pendiente').length,
    enAtencion: hoy.filter((c) => c.status === 'en_atencion').length,
    atendidos: hoy.filter((c) => c.status === 'atendido').length,
  }
}

export function addConsulta(consulta) {
  const newConsulta = {
    ...consulta,
    id: nextId++,
    fecha: new Date().toISOString().slice(0, 10),
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  }
  consultasData = [...consultasData, newConsulta]
  return newConsulta
}

export function updateConsultaStatus(id, newStatus) {
  consultasData = consultasData.map((c) =>
    c.id === id ? { ...c, status: newStatus } : c,
  )
  return consultasData.find((c) => c.id === id)
}

export function updateConsultaField(id, field, value) {
  consultasData = consultasData.map((c) =>
    c.id === id ? { ...c, [field]: value } : c,
  )
  return consultasData.find((c) => c.id === id)
}

export function getConsultasByPaciente(cedula) {
  return consultasData
    .filter((c) => c.pacienteCedula === cedula)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getConsultasDelDia() {
  const today = new Date().toISOString().slice(0, 10)
  return consultasData.filter((c) => c.fecha === today).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )
}
