using Microsoft.Extensions.Logging.ApplicationInsights;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationInsightsTelemetry();

builder.Logging.AddApplicationInsights(
    configureTelemetryConfiguration: (config) =>
        config.ConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"],
    configureApplicationInsightsLoggerOptions: (options) => { }
);

builder.Logging.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Trace);

var app = builder.Build();

app.MapPost(
    "/api/GetRoles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /api/GetRoles");
        return new { roles = new[] { "foo", "bar" } };
    }
);

app.MapPost(
    "/GetRoles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /GetRoles");
        return new { roles = new[] { "lala", "googoo" } };
    }
);

app.MapPost(
    "/roles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /roles");
        return new { roles = new[] { "admin", "superpower" } };
    }
);

app.MapPost(
    "/api/roles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /api/roles");
        return new { roles = new[] { "admin2", "superpower2" } };
    }
);

app.Run();
