namespace Spacecowboy.Service.Controllers.DTO.Errors
{
    /// <summary>
    /// Base class for HTTP error details for Bad Request errors (HTTP status code 400)
    /// </summary>
    public class BadRequestErrorDetails : ErrorDetails
    {
        public static readonly string BadRequestType = "https://www.rfc-editor.org/rfc/rfc7231.html#section-6.5.1";

        public static readonly string BadRequestTitle = "Bad Request";

        public BadRequestErrorDetails(string detail) : base(400, BadRequestType, BadRequestTitle, detail) 
        { }

    }
}
