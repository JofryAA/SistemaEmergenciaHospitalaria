namespace SistemaEmergenciaHospitalaria.Entidades;

public class Paciente
{
    public int PacienteID { get; set; }
    public string Cedula { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public DateTime? FechaNacimiento { get; set; }
    public string? Sexo { get; set; }
    public string? Telefono { get; set; }
    public string? TipoSangre { get; set; }
    public string? Alergias { get; set; }

    public string? PresionArterial { get; set; }
    public string? FrecuenciaCardiaca { get; set; }
    public string? FrecuenciaRespiratoria { get; set; }
    public string? Temperatura { get; set; }
    public string? SaturacionO2 { get; set; }
    public string? Peso { get; set; }
    public string? Talla { get; set; }

    public string? NivelTriage { get; set; }
    public string? Estado { get; set; } = "En espera";
}
