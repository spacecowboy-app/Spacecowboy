namespace Spacecowboy.Service.Controllers.DTO.Errors
{
    public class ConflictErrorDetails : ErrorDetails
    {
        public static readonly string ConflictType = "https://www.rfc-editor.org/rfc/rfc7231.html#section-6.5.8";

        public static readonly string ConflictTitle = "Conflict";

        public ConflictErrorDetails(string detail) : base(409, ConflictType, ConflictTitle, detail ) { }
    }
}
