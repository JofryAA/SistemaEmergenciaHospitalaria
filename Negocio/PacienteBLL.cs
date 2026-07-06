using System.Data;
using Microsoft.Data.SqlClient;
using SistemaEmergenciaHospitalaria.Datos;
using SistemaEmergenciaHospitalaria.Entidades;

namespace SistemaEmergenciaHospitalaria.Negocio;

public class PacienteBLL
{
    private readonly Conexion _conexion = new();

    // ──────────────────────────────────────────────
    //  PACIENTES
    // ──────────────────────────────────────────────

    public DataTable BuscarPaciente(string termino)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_BuscarPaciente", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Termino", termino);
        return FillTable(cmd);
    }

    public bool RegistrarPaciente(Paciente p)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_RegistrarPaciente", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Cedula", p.Cedula);
        cmd.Parameters.AddWithValue("@NombreCompleto", p.NombreCompleto);
        cmd.Parameters.AddWithValue("@FechaNacimiento", OrNull(p.FechaNacimiento));
        cmd.Parameters.AddWithValue("@Sexo", OrNull(p.Sexo));
        cmd.Parameters.AddWithValue("@Telefono", OrNull(p.Telefono));
        cmd.Parameters.AddWithValue("@TipoSangre", OrNull(p.TipoSangre));
        cmd.Parameters.AddWithValue("@Alergias", OrNull(p.Alergias));
        cmd.Parameters.AddWithValue("@PresionArterial", OrNull(p.PresionArterial));
        cmd.Parameters.AddWithValue("@FrecuenciaCardiaca", OrNull(p.FrecuenciaCardiaca));
        cmd.Parameters.AddWithValue("@FrecuenciaRespiratoria", OrNull(p.FrecuenciaRespiratoria));
        cmd.Parameters.AddWithValue("@Temperatura", OrNull(p.Temperatura));
        cmd.Parameters.AddWithValue("@SaturacionO2", OrNull(p.SaturacionO2));
        cmd.Parameters.AddWithValue("@Peso", OrNull(p.Peso));
        cmd.Parameters.AddWithValue("@Talla", OrNull(p.Talla));
        cmd.Parameters.AddWithValue("@NivelTriage", OrNull(p.NivelTriage));
        cmd.Parameters.AddWithValue("@Estado", p.Estado);
        return cmd.ExecuteNonQuery() > 0;
    }

    public DataTable ObtenerPacientes()
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_ObtenerPacientes", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        return FillTable(cmd);
    }

    public bool ActualizarPaciente(Paciente p)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_ActualizarPaciente", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@PacienteID", p.PacienteID);
        cmd.Parameters.AddWithValue("@NombreCompleto", p.NombreCompleto);
        cmd.Parameters.AddWithValue("@FechaNacimiento", OrNull(p.FechaNacimiento));
        cmd.Parameters.AddWithValue("@Alergias", OrNull(p.Alergias));
        cmd.Parameters.AddWithValue("@PresionArterial", OrNull(p.PresionArterial));
        cmd.Parameters.AddWithValue("@FrecuenciaCardiaca", OrNull(p.FrecuenciaCardiaca));
        cmd.Parameters.AddWithValue("@SaturacionO2", OrNull(p.SaturacionO2));
        cmd.Parameters.AddWithValue("@Temperatura", OrNull(p.Temperatura));
        cmd.Parameters.AddWithValue("@FrecuenciaRespiratoria", OrNull(p.FrecuenciaRespiratoria));
        cmd.Parameters.AddWithValue("@NivelTriage", OrNull(p.NivelTriage));
        cmd.Parameters.AddWithValue("@Estado", p.Estado);
        return cmd.ExecuteNonQuery() > 0;
    }

    public bool EliminarPaciente(int id)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_EliminarPaciente", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@PacienteID", id);
        return cmd.ExecuteNonQuery() > 0;
    }

    // ──────────────────────────────────────────────
    //  CONSULTAS
    // ──────────────────────────────────────────────

    public bool RegistrarConsulta(Consulta c)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_RegistrarConsulta", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@PacienteCedula", c.PacienteCedula);
        cmd.Parameters.AddWithValue("@HoraLlegada", OrNull(c.HoraLlegada));
        cmd.Parameters.AddWithValue("@ModoLlegada", OrNull(c.ModoLlegada));
        cmd.Parameters.AddWithValue("@Triage", OrNull(c.Triage));
        cmd.Parameters.AddWithValue("@MotivoConsulta", c.MotivoConsulta);
        cmd.Parameters.AddWithValue("@Alergias", OrNull(c.Alergias));
        cmd.Parameters.AddWithValue("@PresionArterial", OrNull(c.PresionArterial));
        cmd.Parameters.AddWithValue("@FrecuenciaCardiaca", OrNull(c.FrecuenciaCardiaca));
        cmd.Parameters.AddWithValue("@FrecuenciaRespiratoria", OrNull(c.FrecuenciaRespiratoria));
        cmd.Parameters.AddWithValue("@Temperatura", OrNull(c.Temperatura));
        cmd.Parameters.AddWithValue("@SaturacionO2", OrNull(c.SaturacionO2));
        cmd.Parameters.AddWithValue("@Peso", OrNull(c.Peso));
        cmd.Parameters.AddWithValue("@Talla", OrNull(c.Talla));
        cmd.Parameters.AddWithValue("@SignosVitalesBypass", c.SignosVitalesBypass);
        cmd.Parameters.AddWithValue("@Observaciones", OrNull(c.Observaciones));
        cmd.Parameters.AddWithValue("@CreadoPor", OrNull(c.CreadoPor));
        cmd.Parameters.AddWithValue("@Status", c.Status);
        return cmd.ExecuteNonQuery() > 0;
    }

    public DataTable ObtenerConsultasDelDia(string fecha)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_ObtenerConsultasDelDia", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Fecha", fecha);
        return FillTable(cmd);
    }

    public bool ActualizarStatusConsulta(int id, string status)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_ActualizarStatusConsulta", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@Status", status);
        return cmd.ExecuteNonQuery() > 0;
    }

    // ──────────────────────────────────────────────
    //  AUTH
    // ──────────────────────────────────────────────

    public Usuario? ValidarLogin(string cedula, string password)
    {
        using var conn = _conexion.AbrirConexion();
        using var cmd = new SqlCommand("sp_ValidarLogin", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@Cedula", cedula);
        cmd.Parameters.AddWithValue("@Password", password);

        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new Usuario
            {
                Cedula = reader["Cedula"]?.ToString() ?? "",
                Nombre = reader["Nombre"]?.ToString() ?? "",
                Rol = reader["Rol"]?.ToString(),
                Avatar = reader["Avatar"]?.ToString(),
                Terminal = reader["Terminal"]?.ToString()
            };
        }
        return null;
    }

    // ──────────────────────────────────────────────
    //  HELPERS
    // ──────────────────────────────────────────────

    private static object OrNull(string? value) =>
        value ?? (object)DBNull.Value;

    private static object OrNull(DateTime? value) =>
        value.HasValue ? (object)value.Value : DBNull.Value;

    private static object OrNull(bool value) => value;

    private static DataTable FillTable(SqlCommand cmd)
    {
        var dt = new DataTable();
        using var da = new SqlDataAdapter(cmd);
        da.Fill(dt);
        return dt;
    }
}
