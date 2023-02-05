using System;
using System.ComponentModel.DataAnnotations;


namespace Spacecowboy.Service.Controllers.DTO.Errors
{
    /// <summary>
    /// HTTP error details conforming to RFC7807
    /// </summary>
    public class ErrorDetails
    {
        /// <summary>
        /// A URI that identifies the problem type
        /// </summary>
        [Required]
        public string Type { get; init; }

        /// <summary>
        /// A short human-readable description of the problem type
        /// </summary>
        [Required]
        public string Title { get; init; }

        /// <summary>
        /// The HTTP status code corresponding to the problem type
        /// </summary>
        [Required]
        public int Status { get; init; }

        /// <summary>
        /// A human-readable description specific to this occurrence of the problem
        /// </summary>
        [Required]
        public string Detail { get; init; }

        /// <summary>
        /// The session identifier related to this problem, or <code>null</code>
        /// </summary>
        public string SessionId { get; init; }

        /// <summary>
        /// The participant identifier related to this problem, or <code>null</code>
        /// </summary>
        public Guid? ParticipantId { get; init; }

        /// <summary>
        /// The card identifier related to this problem, or <code>null</code>
        /// </summary>
        public Guid? CardId { get; init; }


        public ErrorDetails(int status, string type, string title, string detail)
        {
            if (string.IsNullOrWhiteSpace(type)) throw new ArgumentException("Argument must have a value", nameof(type));
            if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Argument must have a value", nameof(title));
            if (string.IsNullOrWhiteSpace(detail)) throw new ArgumentException("Argument must have a value", nameof(detail));
            Status = status;
            Type = type;
            Title = title;
            Detail = detail;
        }
    }
}
