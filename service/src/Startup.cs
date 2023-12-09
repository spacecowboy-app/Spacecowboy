/*
    Copyright 2021-2023 Rolf Michelsen and Tami Weiss

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

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Prometheus;
using Serilog;
using Spacecowboy.Service.Controllers.Hubs;
using Spacecowboy.Service.Infrastructure;
using Spacecowboy.Service.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json.Serialization;


namespace Spacecowboy.Service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var serviceOptions = Configuration.GetSection(ServiceOptions.Service);
            services.Configure<ServiceOptions>(serviceOptions);

            services.AddControllers();

            services.AddMvc()
                .AddJsonOptions(options => {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v0", new OpenApiInfo
                {
                    Title = "Spacecowboy API",
                    Version = "v0",
                    Description = "API for agile decision making in distributed teams",
                    Contact = new OpenApiContact
                    {
                        Name = "The Spacecowboy team",
                        Email = "howdy@spacecowboy.app",
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Apache 2.0",
                        Url = new Uri("http://www.apache.org/licenses/LICENSE-2.0.html"),
                    },

                });
                c.IncludeXmlComments(Path.Combine(System.AppContext.BaseDirectory, "spacecowboy-api.xml"));
            });

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            var repositoryType = serviceOptions["RepositoryType"]?.ToLower();
            switch (repositoryType)
            {
                case "redis":
                    services.AddSingleton<ISessionRepository, RedisSessionRepository>();
                    break;
                case "memory":
                case null:
                    repositoryType = "memory";
                    services.AddSingleton<ISessionRepository, MemorySessionRepository>();
                    break;
                default:
                    Log.Fatal("Illegal value for RepositoryType configuration {repositoryType}", repositoryType);
                    throw new Exception("Illegal value for RepositoryType configuration");
            }
            Log.Information("Using {repositoryType} session repository", repositoryType);

            services.AddSignalR();

            /* Cors policy to facilitate easy local development and testing. */
            services.AddCors(options =>
            {
                options.AddPolicy("DevCorsPolicy",
                    builder => {
                        builder.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .AllowAnyMethod();
                    }
                );
            });

            /* Set the service instance name as a label on all metrics published. */
            var instanceName = serviceOptions["InstanceName"];
            if (instanceName != null)
            {
                Metrics.DefaultRegistry.SetStaticLabels(new Dictionary<string, string>
                {
                  { "instance_name", instanceName }
                });
                Log.Information("Metrics will be annotated with instance name {instanceName}", instanceName);
            }
            else
            {
                Log.Information("No instance name configured");
            }
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSerilogRequestLogging();
            app.UseRouting();
            app.UseStaticFiles();
            app.UseHttpMetrics();                   // Export HTTP metrics to Prometheus

            if (env.IsDevelopment())
            {
                app.UseCors("DevCorsPolicy");
            }

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapMetrics();
                endpoints.MapHub<SessionHub>("/sessionhub");
            });

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v0/swagger.json", "Spacecowboy API v0");
            });
        }
    }
}
