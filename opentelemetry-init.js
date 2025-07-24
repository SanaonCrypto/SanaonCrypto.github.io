 const { WebTracerProvider } = opentelemetry.sdk.trace.web;
   const { ConsoleSpanExporter, SimpleSpanProcessor } = opentelemetry.sdk.trace.base;
   const { OTLPTraceExporter } = opentelemetry.exporter.trace.otlp.http;
   const { Resource } = opentelemetry.resources;
   const { SEMRESATTRS_SERVICE_NAME } = opentelemetry.semantic.conventions;
   // Create a provider for activating and tracking spans
   const tracerProvider = new WebTracerProvider({
     resource: new Resource({
       [SEMRESATTRS_SERVICE_NAME]: 'quantum-commerce-frontend',
     }),
   });
   // Add a console exporter to see the traces in the browser console
   tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
   // Add OTLP exporter if we have a collector endpoint
   // For production, we would set up an OTLP endpoint
   // const collectorUrl = 'https://your-collector-endpoint/v1/traces';
   // tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({ url: collectorUrl })));
   // Register the tracer provider
   tracerProvider.register();
   // Get a tracer instance
   const tracer = opentelemetry.trace.getTracer('quantum-commerce-tracer');
   // Export the tracer so we can use it in other files
   window.quantumTracer = tracer;
   ```
