namespace SistemaEmergenciaHospitalaria.Entidades;

public class Consulta
{
    public int Id { get; set; }
    public int? NumeroConsulta { get; set; }
    public string PacienteCedula { get; set; } = string.Empty;
    public string? PacienteNombre { get; set; }
    public DateTime? Fecha { get; set; }
    public string? HoraLlegada { get; set; }
    public string? ModoLlegada { get; set; }
    public string? Triage { get; set; }
    public string? MotivoConsulta { get; set; }
    public string? Alergias { get; set; }

    public string? PresionArterial { get; set; }
    public string? FrecuenciaCardiaca { get; set; }
    public string? FrecuenciaRespiratoria { get; set; }
    public string? Temperatura { get; set; }
    public string? SaturacionO2 { get; set; }
    public string? Peso { get; set; }
    public string? Talla { get; set; }
    public bool SignosVitalesBypass { get; set; }

    public string? Observaciones { get; set; }
    public string? CreadoPor { get; set; }
    public string? Status { get; set; } = "pendiente";
}
