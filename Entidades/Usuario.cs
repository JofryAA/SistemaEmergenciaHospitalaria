namespace SistemaEmergenciaHospitalaria.Entidades;

public class Usuario
{
    public string Cedula { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Rol { get; set; }
    public string? Avatar { get; set; }
    public string? Terminal { get; set; }
    public string? PasswordHash { get; set; }
}
