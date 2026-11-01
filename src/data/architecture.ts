export type ArchitectureNode = {
  id: string;
  name: string;
  technology: string;
  kind:
    | "interface"
    | "application"
    | "data"
    | "worker"
    | "scheduler"
    | "queue"
    | "integration"
    | "observability";
  column: string;
  text: string;
};
export type ArchitectureView = {
  id: string;
  label: string;
  description: string;
  initialNode: string;
  columns: { id: string; label: string }[];
  nodes: ArchitectureNode[];
  connections: {
    from: string;
    to: string;
    label: string;
    kind: "application" | "telemetry" | "query";
  }[];
};
export type Architecture = { views: ArchitectureView[] };

// Source: cmfinl/rideon docs/architecture/data-and-integrations.md,
// apps/api/docker-compose.yaml, app/core/tasks, and docs/operations/observability.md.
export const rideonArchitecture: Architecture = {
  views: [
    {
      id: "services",
      label: "Applications & backend",
      description:
        "Client applications, task processes, durable data, and external delivery and routing providers. Select a component to trace its dependencies.",
      initialNode: "api",
      columns: [
        {
          id: "experience",
          label: "Experiences",
        },
        {
          id: "platform",
          label: "Backend processes",
        },
        {
          id: "data",
          label: "Data, messaging & providers",
        },
      ],
      nodes: [
        {
          id: "rider",
          name: "Rider app",
          technology: "Flutter",
          kind: "interface",
          column: "experience",
          text: "Registration, ride requests, trip information, and notifications. A generated Dart client connects the rider application to the shared API.",
        },
        {
          id: "driver",
          name: "Driver app",
          technology: "Flutter",
          kind: "interface",
          column: "experience",
          text: "Assignments, navigation, trip status, and location in a dedicated driver application, using the generated Dart API client.",
        },
        {
          id: "admin",
          name: "Organization admin",
          technology: "Next.js",
          kind: "interface",
          column: "experience",
          text: "Organization administration across riders, drivers, vehicles, events, assignments, and routes. Generated TypeScript contracts keep the API integration aligned.",
        },
        {
          id: "public",
          name: "Public website",
          technology: "Astro",
          kind: "interface",
          column: "experience",
          text: "Public product information and guest ride requests, connected to the same platform API.",
        },
        {
          id: "api",
          name: "Platform API",
          technology: "FastAPI \u00b7 OpenAPI",
          kind: "application",
          column: "platform",
          text: "A modular backend owns identity, organization access, transportation rules, and provider adapters. PostgreSQL tenant schemas isolate operational records; database changes and integration facts commit together through a transactional outbox.",
        },
        {
          id: "workers",
          name: "General worker",
          technology: "Taskiq",
          kind: "worker",
          column: "platform",
          text: "Consumes RabbitMQ tasks for background processing and outbox publication. Registered integration handlers execute in the publisher process; RabbitMQ schedules that work rather than broadcasting domain events. PostgreSQL holds durable state, while Redis holds short-lived task results.",
        },
        {
          id: "notifications",
          name: "Notification worker",
          technology: "Taskiq \u00b7 Dedicated queue",
          kind: "worker",
          column: "platform",
          text: "A separate RabbitMQ exchange and queue isolate notification delivery capacity. The worker claims deliveries from PostgreSQL and invokes email and push providers; delivery evidence remains in the database.",
        },
        {
          id: "scheduler",
          name: "Task scheduler",
          technology: "Taskiq Scheduler",
          kind: "scheduler",
          column: "platform",
          text: "Enqueues scheduled tasks through RabbitMQ, including recovery sweeps and background maintenance. Redis can provide dynamic schedules; database outbox rows remain the durable pending-event record.",
        },
        {
          id: "database",
          name: "Operational database",
          technology: "PostgreSQL",
          kind: "data",
          column: "data",
          text: "Shared platform identity and organization records coexist with tenant schemas for operational data. Transactional outbox rows, consumer receipts, and notification evidence preserve durable workflow state.",
        },
        {
          id: "redis",
          name: "Cache & coordination",
          technology: "Redis",
          kind: "data",
          column: "data",
          text: "Short-lived cache, locks, idempotency replay protection, active driver locations, and general-worker task results. Redis is not the durable record of a confirmed business outcome.",
        },
        {
          id: "rabbitmq",
          name: "Task broker",
          technology: "RabbitMQ",
          kind: "queue",
          column: "data",
          text: "Carries Taskiq work for general and dedicated notification queues. Scheduled execution and delivery retries use the broker; durable business events remain in the PostgreSQL outbox.",
        },
        {
          id: "maps",
          name: "Routing & optimization",
          technology: "Google Maps Platform",
          kind: "integration",
          column: "data",
          text: "Backend adapters handle Routes, Places, Geocoding, and fleet-tour optimization. Domain code and client contracts stay provider-neutral.",
        },
        {
          id: "pingram",
          name: "Email delivery",
          technology: "Pingram",
          kind: "integration",
          column: "data",
          text: "The deployed email adapter handles notification delivery and signed delivery callbacks. Local development captures SMTP email through Mailpit.",
        },
        {
          id: "fcm",
          name: "Mobile push",
          technology: "Firebase Cloud Messaging",
          kind: "integration",
          column: "data",
          text: "Delivers mobile push notifications. Recipient policy, device registrations, notification records, and delivery evidence remain owned by the backend.",
        },
      ],
      connections: [
        {
          from: "rider",
          to: "api",
          label: "API requests",
          kind: "application",
        },
        {
          from: "driver",
          to: "api",
          label: "API requests",
          kind: "application",
        },
        {
          from: "admin",
          to: "api",
          label: "API requests",
          kind: "application",
        },
        {
          from: "public",
          to: "api",
          label: "API requests",
          kind: "application",
        },
        {
          from: "api",
          to: "database",
          label: "Domain records & outbox",
          kind: "application",
        },
        {
          from: "api",
          to: "redis",
          label: "Cache & request protection",
          kind: "application",
        },
        {
          from: "api",
          to: "rabbitmq",
          label: "Enqueue delivery work",
          kind: "application",
        },
        {
          from: "api",
          to: "maps",
          label: "Routing & travel estimates",
          kind: "application",
        },
        {
          from: "workers",
          to: "database",
          label: "Outbox & workflow state",
          kind: "application",
        },
        {
          from: "workers",
          to: "redis",
          label: "Task results & coordination",
          kind: "application",
        },
        {
          from: "workers",
          to: "rabbitmq",
          label: "Schedule notification delivery",
          kind: "application",
        },
        {
          from: "workers",
          to: "maps",
          label: "Route optimization",
          kind: "application",
        },
        {
          from: "scheduler",
          to: "rabbitmq",
          label: "Schedule tasks",
          kind: "application",
        },
        {
          from: "scheduler",
          to: "redis",
          label: "Dynamic schedule source",
          kind: "application",
        },
        {
          from: "rabbitmq",
          to: "workers",
          label: "General task consumption",
          kind: "application",
        },
        {
          from: "rabbitmq",
          to: "notifications",
          label: "Delivery task consumption",
          kind: "application",
        },
        {
          from: "notifications",
          to: "database",
          label: "Delivery claims & evidence",
          kind: "application",
        },
        {
          from: "notifications",
          to: "pingram",
          label: "Email notifications",
          kind: "application",
        },
        {
          from: "notifications",
          to: "fcm",
          label: "Push notifications",
          kind: "application",
        },
      ],
    },
    {
      id: "observability",
      label: "Observability",
      description:
        "Private telemetry collection connects backend and web diagnostics to logs, metrics, traces, dashboards, and alerts. Mobile crash reporting uses a separate channel.",
      initialNode: "alloy",
      columns: [
        {
          id: "experience",
          label: "Instrumented services",
        },
        {
          id: "platform",
          label: "Collection & exploration",
        },
        {
          id: "data",
          label: "Signal storage & diagnostics",
        },
      ],
      nodes: [
        {
          id: "api",
          name: "API telemetry",
          technology: "OpenTelemetry \u00b7 Python",
          kind: "application",
          column: "experience",
          text: "Exports allowlisted structured logs, bounded request metrics, and sampled traces. Trace context connects HTTP requests, SQLAlchemy/HTTPX spans, and Taskiq execution without including business arguments.",
        },
        {
          id: "tasks",
          name: "Worker & scheduler telemetry",
          technology: "Taskiq \u00b7 OpenTelemetry",
          kind: "worker",
          column: "experience",
          text: "General workers, notification workers, and the scheduler export operational logs and signals for task outcomes, worker availability, outbox backlog, and optimization queues.",
        },
        {
          id: "admin",
          name: "Admin diagnostics",
          technology: "Next.js \u00b7 Faro",
          kind: "interface",
          column: "experience",
          text: "Server-side API spans and operational logs use the private collector. Optional browser error and Web Vitals signals pass through a same-origin, privacy-filtered telemetry proxy.",
        },
        {
          id: "public",
          name: "Web diagnostics",
          technology: "Astro \u00b7 Faro",
          kind: "interface",
          column: "experience",
          text: "Exports fixed server request outcomes and optional sampled API spans. Configured Faro browser diagnostics pass through the website proxy before reaching Alloy.",
        },
        {
          id: "rider",
          name: "Rider crash reporting",
          technology: "Flutter · Crashlytics",
          kind: "interface",
          column: "experience",
          text: "The rider app sends crash diagnostics to Firebase Crashlytics. Bounded operational diagnostic codes go through the authenticated platform API, separately from crash reporting.",
        },
        {
          id: "driver",
          name: "Driver crash reporting",
          technology: "Flutter · Crashlytics",
          kind: "interface",
          column: "experience",
          text: "The driver app reports crashes through Firebase Crashlytics. Operational connection and outage codes use the authenticated platform API; neither mobile app exports directly to Alloy.",
        },
        {
          id: "alloy",
          name: "Telemetry collector",
          technology: "Grafana Alloy \u00b7 OTLP",
          kind: "observability",
          column: "platform",
          text: "Private OTLP ingestion routes structured logs to Loki, SDK metrics to Prometheus, and sampled traces to Tempo. Alloy also performs fixed-target availability probes. Collection failure does not block business operations.",
        },
        {
          id: "grafana",
          name: "Dashboards & alerts",
          technology: "Grafana",
          kind: "observability",
          column: "platform",
          text: "Queries Loki, Prometheus, and Tempo for logs, metrics, and traces. Built-in alerting covers availability, failures, backlog, and storage pressure; SMTP alert delivery activates when configured.",
        },
        {
          id: "loki",
          name: "Operational logs",
          technology: "Loki",
          kind: "observability",
          column: "data",
          text: "Stores allowlisted application logs with 30-day routine retention. Business audit and delivery evidence remain in PostgreSQL, independently of diagnostic logs.",
        },
        {
          id: "prometheus",
          name: "Service metrics",
          technology: "Prometheus",
          kind: "observability",
          column: "data",
          text: "Receives OTLP metrics forwarded by Alloy and monitors telemetry services. Tracks request rate and latency, dependency readiness, task failures, worker availability, and backlog.",
        },
        {
          id: "tempo",
          name: "Distributed traces",
          technology: "Tempo",
          kind: "observability",
          column: "data",
          text: "Stores sampled traces with seven-day retention. W3C trace context relates API requests and background execution; sensitive attributes and raw exception text are removed before export.",
        },
        {
          id: "crashlytics",
          name: "Mobile crash diagnostics",
          technology: "Firebase Crashlytics",
          kind: "observability",
          column: "data",
          text: "Flutter apps retain Crashlytics as their crash-diagnostics channel. Bounded operational diagnostic codes go through the authenticated API; mobile apps do not export directly to Alloy.",
        },
      ],
      connections: [
        {
          from: "api",
          to: "alloy",
          label: "OTLP logs, metrics & traces",
          kind: "telemetry",
        },
        {
          from: "tasks",
          to: "alloy",
          label: "OTLP logs, metrics & traces",
          kind: "telemetry",
        },
        {
          from: "admin",
          to: "alloy",
          label: "Server telemetry & filtered Faro",
          kind: "telemetry",
        },
        {
          from: "public",
          to: "alloy",
          label: "Server telemetry & filtered Faro",
          kind: "telemetry",
        },
        {
          from: "alloy",
          to: "loki",
          label: "Structured logs",
          kind: "telemetry",
        },
        {
          from: "alloy",
          to: "prometheus",
          label: "OTLP metrics",
          kind: "telemetry",
        },
        {
          from: "alloy",
          to: "tempo",
          label: "Sampled traces",
          kind: "telemetry",
        },
        {
          from: "grafana",
          to: "loki",
          label: "Log queries",
          kind: "query",
        },
        {
          from: "grafana",
          to: "prometheus",
          label: "Metrics & alert queries",
          kind: "query",
        },
        {
          from: "grafana",
          to: "tempo",
          label: "Trace queries",
          kind: "query",
        },
        {
          from: "rider",
          to: "crashlytics",
          label: "Mobile crash reports",
          kind: "telemetry",
        },
        {
          from: "driver",
          to: "crashlytics",
          label: "Mobile crash reports",
          kind: "telemetry",
        },
      ],
    },
  ],
};

// Source: nthpi/transactiq backend/docker-compose.yml, prometheus.yml,
// app/celery.py, app/tasks.py, and app/reports and app/emails integrations.
export const transactiqArchitecture: Architecture = {
  views: [
    {
      id: "services",
      label: "Applications & backend",
      description:
        "The contribution application, asynchronous receipt and email workflows, and their database, broker, and external providers.",
      initialNode: "api",
      columns: [
        {
          id: "experience",
          label: "Experience",
        },
        {
          id: "platform",
          label: "Backend processes",
        },
        {
          id: "data",
          label: "Data, messaging & providers",
        },
      ],
      nodes: [
        {
          id: "web",
          name: "Contribution app",
          technology: "React",
          kind: "interface",
          column: "experience",
          text: "The user-facing application brings contribution management, financial tracking, and receipt workflows into one experience.",
        },
        {
          id: "api",
          name: "Application API",
          technology: "FastAPI",
          kind: "application",
          column: "platform",
          text: "Owns contribution management and financial workflows. Report generation and email retrieval are submitted as Celery tasks rather than completed in the request.",
        },
        {
          id: "worker",
          name: "Background worker",
          technology: "Celery",
          kind: "worker",
          column: "platform",
          text: "Processes queued email retrieval and contributor report generation. Receipt workflows read financial records, generate PDFs, upload them to S3, and send notifications through NotificationAPI.",
        },
        {
          id: "beat",
          name: "Task scheduler",
          technology: "Celery Beat",
          kind: "scheduler",
          column: "platform",
          text: "A separately configured Beat process submits scheduled work through the Celery broker. Task execution belongs to the worker process.",
        },
        {
          id: "database",
          name: "Financial records",
          technology: "PostgreSQL",
          kind: "data",
          column: "data",
          text: "Stores contributors, contributions, organization information, and report records used by financial and receipt workflows.",
        },
        {
          id: "redis",
          name: "Task broker",
          technology: "Redis",
          kind: "queue",
          column: "data",
          text: "The Compose broker used by Celery workers, Beat, and Flower. Task result-backend settings are supplied separately by application configuration.",
        },
        {
          id: "s3",
          name: "Receipt storage",
          technology: "Amazon S3",
          kind: "data",
          column: "data",
          text: "The report generator uploads contributor receipt PDFs to object storage and records the resulting report location.",
        },
        {
          id: "mail",
          name: "Receipt notifications",
          technology: "NotificationAPI",
          kind: "integration",
          column: "data",
          text: "The active report-generation workflow sends contributor receipt notifications through the NotificationAPI mailer integration.",
        },
        {
          id: "gmail",
          name: "Email retrieval",
          technology: "Gmail API \u00b7 OAuth",
          kind: "integration",
          column: "data",
          text: "Background email tasks use stored OAuth credentials to retrieve and process contribution-related email.",
        },
      ],
      connections: [
        {
          from: "web",
          to: "api",
          label: "API requests",
          kind: "application",
        },
        {
          from: "api",
          to: "database",
          label: "Financial records",
          kind: "application",
        },
        {
          from: "api",
          to: "redis",
          label: "Queue reports & email retrieval",
          kind: "application",
        },
        {
          from: "beat",
          to: "redis",
          label: "Schedule tasks",
          kind: "application",
        },
        {
          from: "redis",
          to: "worker",
          label: "Task consumption",
          kind: "application",
        },
        {
          from: "worker",
          to: "database",
          label: "Report & contribution records",
          kind: "application",
        },
        {
          from: "worker",
          to: "s3",
          label: "Upload receipt PDFs",
          kind: "application",
        },
        {
          from: "worker",
          to: "mail",
          label: "Send receipt notifications",
          kind: "application",
        },
        {
          from: "worker",
          to: "gmail",
          label: "Retrieve emails",
          kind: "application",
        },
      ],
    },
    {
      id: "observability",
      label: "Observability",
      description:
        "Host and container metrics are collected by Prometheus, with Grafana as the dashboard layer. Flower monitors Celery task activity separately through Redis.",
      initialNode: "prometheus",
      columns: [
        {
          id: "experience",
          label: "Metric & task sources",
        },
        {
          id: "platform",
          label: "Collection & task monitoring",
        },
        {
          id: "data",
          label: "Dashboards",
        },
      ],
      nodes: [
        {
          id: "cadvisor",
          name: "Container metrics",
          technology: "cAdvisor",
          kind: "observability",
          column: "experience",
          text: "The checked-in Compose monitoring stack exposes container resource metrics, collected by Prometheus.",
        },
        {
          id: "nodeexporter",
          name: "Host metrics",
          technology: "Node Exporter",
          kind: "observability",
          column: "experience",
          text: "Exposes host-level metrics. The committed Prometheus configuration scrapes this exporter alongside cAdvisor.",
        },
        {
          id: "redis",
          name: "Celery broker",
          technology: "Redis",
          kind: "queue",
          column: "experience",
          text: "Flower connects to the Celery Redis broker to inspect background task activity.",
        },
        {
          id: "prometheus",
          name: "Metrics collection",
          technology: "Prometheus",
          kind: "observability",
          column: "platform",
          text: "The committed scrape configuration collects cAdvisor, Node Exporter, and Prometheus self-monitoring metrics. It does not configure scraping of FastAPI request metrics.",
        },
        {
          id: "flower",
          name: "Task monitoring",
          technology: "Flower",
          kind: "observability",
          column: "platform",
          text: "A dedicated Celery monitoring service connects to the configured Redis broker, providing visibility into worker and task activity.",
        },
        {
          id: "grafana",
          name: "Metrics dashboards",
          technology: "Grafana",
          kind: "observability",
          column: "data",
          text: "Visualizes host and container metrics by querying Prometheus. The default datasource is provisioned from Compose at Grafana startup. Flower handles Celery task monitoring separately.",
        },
      ],
      connections: [
        {
          from: "cadvisor",
          to: "prometheus",
          label: "Container metrics scrape",
          kind: "telemetry",
        },
        {
          from: "nodeexporter",
          to: "prometheus",
          label: "Host metrics scrape",
          kind: "telemetry",
        },
        {
          from: "redis",
          to: "flower",
          label: "Celery task monitoring",
          kind: "telemetry",
        },
        {
          from: "grafana",
          to: "prometheus",
          label: "Metrics queries",
          kind: "query",
        },
      ],
    },
  ],
};
