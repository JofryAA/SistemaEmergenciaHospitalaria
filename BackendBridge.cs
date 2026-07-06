using System.Runtime.InteropServices;
using System.Text.Json;
using SistemaEmergenciaHospitalaria.Entidades;
using SistemaEmergenciaHospitalaria.Negocio;

namespace SistemaEmergenciaHospitalaria;

[ClassInterface(ClassInterfaceType.AutoDispatch)]
public class BackendBridge
{
    private readonly PacienteBLL _pacienteBll = new();
    private readonly JsonSerializerOptions _jsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    // ──────────────────────────────────────────────
    //  PACIENTES
    // ──────────────────────────────────────────────

    public string BuscarPaciente(string termino)
    {
        try
        {
            var dt = _pacienteBll.BuscarPaciente(termino);
            return Json(dt);
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    public string RegistrarPaciente(string json)
    {
        try
        {
            var data = JsonDocument.Parse(json).RootElement;
            var p = new Paciente
            {
                Cedula = GetString(data, "cedula") ?? "",
                NombreCompleto = GetString(data, "nombre") ?? "",
                FechaNacimiento = ParseDate(GetString(data, "fechaNacimiento")),
                Sexo = GetString(data, "sexo"),
                Telefono = GetString(data, "telefono"),
                TipoSangre = GetString(data, "tipoSangre"),
                Alergias = GetString(data, "alergias"),
                PresionArterial = GetString(data, "presionArterial"),
                FrecuenciaCardiaca = GetString(data, "frecuenciaCardiaca"),
                FrecuenciaRespiratoria = GetString(data, "frecuenciaRespiratoria"),
                Temperatura = GetString(data, "temperatura"),
                SaturacionO2 = GetString(data, "saturacionO2"),
                Peso = GetString(data, "peso"),
                Talla = GetString(data, "talla"),
                NivelTriage = GetString(data, "nivelTriage"),
                Estado = "En espera"
            };

            var ok = _pacienteBll.RegistrarPaciente(p);
            return Ok(new { success = ok });
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    public string ObtenerPacientes()
    {
        try
        {
            var dt = _pacienteBll.BuscarPaciente("");
            return Json(dt);
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    // ──────────────────────────────────────────────
    //  CONSULTAS
    // ──────────────────────────────────────────────

    public string RegistrarConsulta(string json)
    {
        try
        {
            var data = JsonDocument.Parse(json).RootElement;
            var c = new Consulta
            {
                PacienteCedula = GetString(data, "pacienteCedula") ?? "",
                HoraLlegada = GetString(data, "horaLlegada"),
                ModoLlegada = GetString(data, "modoLlegada"),
                Triage = GetString(data, "triage"),
                MotivoConsulta = GetString(data, "motivoConsulta") ?? "",
                Alergias = GetString(data, "alergias"),
                PresionArterial = GetString(data, "presionArterial"),
                FrecuenciaCardiaca = GetString(data, "frecuenciaCardiaca"),
                FrecuenciaRespiratoria = GetString(data, "frecuenciaRespiratoria"),
                Temperatura = GetString(data, "temperatura"),
                SaturacionO2 = GetString(data, "saturacionO2"),
                Peso = GetString(data, "peso"),
                Talla = GetString(data, "talla"),
                SignosVitalesBypass = GetBool(data, "signosVitalesBypass"),
                Observaciones = GetString(data, "observaciones"),
                CreadoPor = GetString(data, "creadoPor"),
                Status = "pendiente"
            };

            var ok = _pacienteBll.RegistrarConsulta(c);
            return Ok(new { success = ok });
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    public string ObtenerConsultasDelDia(string fecha)
    {
        try
        {
            var dt = _pacienteBll.ObtenerSalaEspera();
            return Json(dt);
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    public string ActualizarStatusConsulta(int id, string status)
    {
        try
        {
            var c = new Consulta { ConsultaID = id, Estado = status ?? "En espera" };
            var ok = _pacienteBll.ActualizarConsulta(c);
            return Ok(new { success = ok });
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    // ──────────────────────────────────────────────
    //  AUTH
    // ──────────────────────────────────────────────

    public string ValidarLogin(string cedula, string password)
    {
        try
        {
            var dt = _pacienteBll.ValidarLogin(cedula, password);
            if (dt.Rows.Count > 0)
            {
                var row = dt.Rows[0];
                return Json(new
                {
                    success = true,
                    usuario = new
                    {
                        cedula = row["Cedula"]?.ToString(),
                        nombre = row["NombreCompleto"]?.ToString(),
                        rol = row["Rol"]?.ToString()
                    }
                });
            }
            return Json(new { success = false, error = "Credenciales inválidas" });
        }
        catch (Exception ex)
        {
            return Error(ex);
        }
    }

    // ──────────────────────────────────────────────
    //  HELPERS
    // ──────────────────────────────────────────────

    private static string? GetString(JsonElement data, string key)
    {
        if (data.TryGetProperty(key, out var prop) && prop.ValueKind == JsonValueKind.String)
            return prop.GetString();
        return null;
    }

    private static bool GetBool(JsonElement data, string key)
    {
        if (data.TryGetProperty(key, out var prop) && prop.ValueKind == JsonValueKind.True)
            return true;
        return false;
    }

    private static DateTime? ParseDate(string? value)
    {
        if (string.IsNullOrEmpty(value)) return null;
        if (DateTime.TryParse(value, out var dt)) return dt;
        return null;
    }

    private string Json(object obj)
    {
        return JsonSerializer.Serialize(obj, _jsonOpts);
    }

    private string Ok(object? extra = null)
    {
        return extra != null
            ? Json(new { success = true, data = extra })
            : Json(new { success = true });
    }

    private string Error(Exception ex)
    {
        return Json(new { success = false, error = ex.Message });
    }
}
