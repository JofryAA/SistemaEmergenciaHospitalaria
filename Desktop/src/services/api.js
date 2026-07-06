class DataError extends Error {
  constructor(message, source) {
    super(message)
    this.name = 'DataError'
    this.source = source
  }
}

const DEV_API = import.meta.env.VITE_API_URL || ''

function getBridge() {
  if (window.chrome?.webview?.hostObjects?.backend) {
    return window.chrome.webview.hostObjects.backend
  }
  return null
}

async function invoke(channel, ...args) {
  const bridge = getBridge()

  if (bridge) {
    try {
      const result = await bridge[channel](...args)
      return typeof result === 'string' ? JSON.parse(result) : result
    } catch (err) {
      throw new DataError(err?.message || `Error en ${channel}`, channel)
    }
  }

  // Fallback: modo dev con API HTTP (si VITE_API_URL está definida)
  if (DEV_API) {
    const res = await fetch(`${DEV_API}/api/${channel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args[0]),
    })
    if (!res.ok) throw new DataError(`HTTP ${res.status}`, channel)
    return res.json()
  }

  // Sin bridge ni API — modo offline (datos mock)
  throw new DataError(
    `Backend no disponible (${channel}). Modo offline con datos mock.`,
    channel,
  )
}

const DataService = {
  buscarPaciente(termino) { return invoke('BuscarPaciente', termino) },
  registrarPaciente(data) { return invoke('RegistrarPaciente', JSON.stringify(data)) },
  obtenerPacientes() { return invoke('ObtenerPacientes') },
  registrarConsulta(data) { return invoke('RegistrarConsulta', JSON.stringify(data)) },
  obtenerConsultasDelDia(fecha) {
    return invoke('ObtenerConsultasDelDia', fecha || new Date().toISOString().slice(0, 10))
  },
  actualizarStatusConsulta(id, status) {
    return invoke('ActualizarStatusConsulta', id, status)
  },
  validarLogin(cedula, password) { return invoke('ValidarLogin', cedula, password) },
}

export { DataError, DataService }
export default DataService
