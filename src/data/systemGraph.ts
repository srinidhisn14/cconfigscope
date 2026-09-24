import type { GraphEdgeDefinition, GraphNodeDefinition } from '../types/analysis'

/** Baseline microservice topology for rule-based blast-radius propagation. */
export const SYSTEM_NODES: GraphNodeDefinition[] = [
  { id: 'config', label: 'Configuration', kind: 'configuration', criticality: 10 },
  { id: 'db', label: 'Database Service', kind: 'database', criticality: 85 },
  { id: 'cache', label: 'Cache Layer', kind: 'cache', criticality: 45 },
  { id: 'order', label: 'Order Service', kind: 'service', criticality: 75 },
  { id: 'payment', label: 'Payment Service', kind: 'service', criticality: 95 },
  { id: 'notification', label: 'Notification Service', kind: 'service', criticality: 55 },
  { id: 'inventory', label: 'Inventory Service', kind: 'service', criticality: 70 },
  { id: 'api-gateway', label: 'API Gateway', kind: 'gateway', criticality: 80 },
  { id: 'events', label: 'Event Queue', kind: 'queue', criticality: 60 },
]

export const SYSTEM_EDGES: GraphEdgeDefinition[] = [
  { id: 'e-config-db', source: 'config', target: 'db', label: 'connection pool' },
  { id: 'e-config-cache', source: 'config', target: 'cache', label: 'TTL / cluster' },
  { id: 'e-config-gateway', source: 'config', target: 'api-gateway', label: 'routes / limits' },
  { id: 'e-db-order', source: 'db', target: 'order', label: 'orders schema' },
  { id: 'e-db-inventory', source: 'db', target: 'inventory', label: 'stock schema' },
  { id: 'e-cache-order', source: 'cache', target: 'order', label: 'session cache' },
  { id: 'e-order-payment', source: 'order', target: 'payment', label: 'checkout' },
  { id: 'e-order-notification', source: 'order', target: 'notification', label: 'status updates' },
  { id: 'e-order-events', source: 'order', target: 'events', label: 'order.created' },
  { id: 'e-payment-notification', source: 'payment', target: 'notification', label: 'receipts' },
  { id: 'e-events-inventory', source: 'events', target: 'inventory', label: 'reserve stock' },
  { id: 'e-gateway-order', source: 'api-gateway', target: 'order', label: 'HTTP' },
  { id: 'e-gateway-payment', source: 'api-gateway', target: 'payment', label: 'HTTP' },
]

/** Config key patterns → direct dependency entry points from Configuration. */
export const CONFIG_ENTRY_POINTS: Record<string, string[]> = {
  'database.url': ['db'],
  'database.pool.max': ['db'],
  'database.pool.min': ['db'],
  'redis.host': ['cache'],
  'redis.ttl': ['cache'],
  'api.rateLimit': ['api-gateway'],
  'api.timeout': ['api-gateway'],
  'payment.provider': ['payment'],
  'payment.webhook.secret': ['payment'],
  'notification.email.enabled': ['notification'],
  'order.fulfillment.mode': ['order'],
}

export const DEMO_ANALYSIS_INPUT = {
  repositoryUrl: 'https://github.com/acme/platform-services',
  branch: 'main',
  environment: 'Production' as const,
  configKey: 'database.pool.max',
  previousValue: '10',
  newValue: '50',
  changeDescription: 'Increase connection pool before Black Friday traffic spike.',
  isDemo: true,
}
