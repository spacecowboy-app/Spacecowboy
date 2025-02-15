/*
    Copyright 2021-2025 Rolf Michelsen and Tami Weiss

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

using System;
using System.IO;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

using Spacecowboy.Service;
using Spacecowboy.Service.Controllers.Hubs;
using Spacecowboy.Service.Infrastructure;
using Spacecowboy.Service.Model.Interfaces;


var builder = WebApplication.CreateBuilder(args);

// Make configuration options from ServiceOptions available to all services.
IConfigurationSection configuration = builder.Configuration.GetSection(ServiceOptions.Service);
builder.Services.Configure<ServiceOptions>(configuration);
var serviceOptions = new ServiceOptions();
configuration.Bind(serviceOptions);

// Path prefix for all API methods
var pathBase = new PathString(builder.Configuration["PATH_BASE"]);

builder.Services.AddHealthChecks();
builder.Services.AddControllers();
builder.Services.AddMvc()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddHttpLogging(o => { });

builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v0", new OpenApiInfo {
        Title = "Spacecowboy API",
        Version = "v0",
        Description = "API for agile decision making in distributed teams",
        Contact = new OpenApiContact {
            Name = "The Spacecowboy team",
            Email = "howdy@spacecowboy.app",
        },
        License = new OpenApiLicense {
            Name = "Apache 2.0",
            Url = new Uri("http://www.apache.org/licenses/LICENSE-2.0.html"),
        },
    });
    c.IncludeXmlComments(Path.Combine(System.AppContext.BaseDirectory, "spacecowboy-api.xml"));
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var repositoryType = serviceOptions.RepositoryType?.ToLower();
switch (repositoryType) {
    case "redis":
        builder.Services.AddSingleton<ISessionRepository, RedisSessionRepository>();
        break;
    case "memory":
    case null:
        repositoryType = "memory";
        builder.Services.AddSingleton<ISessionRepository, MemorySessionRepository>();
        break;
    default:
        throw new Exception($"Illegal value [{repositoryType}] for RepositoryType configuration");
}

builder.Services.AddSignalR();

/* Cors policy to facilitate easy local development and testing. */
builder.Services.AddCors(options => {
    options.AddPolicy("DevCorsPolicy",
        builder => {
            builder.WithOrigins("http://localhost:3000", "http://localhost:8000")
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod();
        }
    );
});

var app = builder.Build();

var logger = app.Services.GetService<ILogger<Program>>();

app.UsePathBase(pathBase);
app.UseHttpLogging();

if (app.Environment.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
    app.UseCors("DevCorsPolicy");
}

app.MapHealthChecks("/healthz");
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.MapHub<SessionHub>("/sessionhub", opt => {
    opt.Transports = HttpTransportType.WebSockets | HttpTransportType.LongPolling;
});

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v0/swagger.json", "Spacecowboy API v0");
});

app.Run();


/// <summary>
/// Dummy class to make this visible to the integration tests
/// </summary>
public partial class Program { }
