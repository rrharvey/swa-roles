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

app.MapGet(
    "/api/GetRoles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /api/GetRoles");
        return new[] { "foo", "bar" };
    }
);

app.MapGet(
    "/GetRoles",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("running /GetRoles");
        return new[] { "lalala", "loopsie" };
    }
);

app.Run();
