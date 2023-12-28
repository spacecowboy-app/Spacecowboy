namespace Spacecowboy.Service.Controllers.DTO.Errors
{
    /// <summary>
    /// Base class for HTTP error details for Not found errors (HTTP status code 404)
    /// </summary>
    public class NotFoundErrorDetails : ErrorDetails
    {
        public static readonly string NotFoundType = "https://www.rfc-editor.org/rfc/rfc7231.html#section-6.5.4";

        public static readonly string NotFoundTitle = "Not Found";

        public NotFoundErrorDetails(string detail) : base(404, NotFoundType, NotFoundTitle, detail) { }
    }
}
