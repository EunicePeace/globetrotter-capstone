import { PhaseDetail } from '../types';

export const PHASE_DETAILS: Record<string, PhaseDetail> = {
  phase1: {
    id: 'phase1',
    number: 1,
    title: 'Phase 1: Monolith Architecture',
    subtitle: 'Centralized Baseline with REST API & JSON Store',
    description: 'A unified single-server application handling user authentication, site search, recommendations, and itineraries using direct JSON disk storage.',
    architectureType: 'Monolithic Single Node',
    techStack: ['Node.js / Express', 'TypeScript', 'JSON Persistence Engine', 'JWT Authentication'],
    keyOutcome: 'Provides immediate baseline functionality and API endpoints while exposing vertical scaling bottlenecks.',
    challenges: ['Vertical scaling limits', 'Single point of failure', 'Concurrent JSON file lock contention', 'Tight code coupling'],
    components: [
      { name: 'GlobeTrotter Monolith API', role: 'All-in-one REST API router', status: 'online' },
      { name: 'JSON Storage File', role: 'Local disk data persistence', status: 'online' }
    ]
  },
  phase2: {
    id: 'phase2',
    number: 2,
    title: 'Phase 2: Microservices Decomposition',
    subtitle: 'Service Decomposition & API Gateway',
    description: 'Decomposes the monolith into three dedicated services: User Service (Auth & Profiles), Itinerary Service (Bookings & Schedules), and Recommendation Service (AI & Matching) routed through an API Gateway.',
    architectureType: 'Decoupled Microservices',
    techStack: ['API Gateway Pattern', 'User Service', 'Itinerary Service', 'Recommendation Service', 'Isolated DB Instances'],
    keyOutcome: 'Enables independent team deployments, tech diversity, and isolated domain boundaries.',
    challenges: ['Network hop latency', 'Cross-service data consistency', 'Distributed tracing complexity'],
    components: [
      { name: 'API Gateway Router', role: 'Unified entry point & request routing', status: 'online' },
      { name: 'User Microservice', role: 'Manages user accounts & preferences', status: 'online' },
      { name: 'Itinerary Microservice', role: 'Manages trip itineraries & sharing', status: 'online' },
      { name: 'Recommendation Microservice', role: 'Generates tailored travel suggestions', status: 'online' }
    ]
  },
  phase3: {
    id: 'phase3',
    number: 3,
    title: 'Phase 3: Cloud Containerization',
    subtitle: 'Docker, Kubernetes & Load Balancing',
    description: 'Packages each microservice into Docker containers, orchestrates multi-pod deployments on Kubernetes clusters, and balances ingress traffic across instances.',
    architectureType: 'Containerized Kubernetes Cluster',
    techStack: ['Docker Containers', 'Kubernetes Pod Orchestration', 'NGINX Ingress Load Balancer', 'Horizontal Pod Autoscaler'],
    keyOutcome: 'High elastic availability, zero-downtime rolling updates, and automated pod recovery.',
    challenges: ['Cluster resource management', 'Container image security', 'Dynamic DNS discovery'],
    components: [
      { name: 'Ingress Load Balancer', role: 'Distributes traffic across pod replicas', status: 'online' },
      { name: 'User Service Pods (x3)', role: 'Replicated container instances', status: 'online' },
      { name: 'Itinerary Service Pods (x3)', role: 'Replicated container instances', status: 'online' },
      { name: 'Recommendation Pods (x3)', role: 'Replicated container instances', status: 'online' }
    ]
  },
  phase4: {
    id: 'phase4',
    number: 4,
    title: 'Phase 4: Resilience & Circuit Breaker',
    subtitle: 'Redis Caching, Message Queues & Fallbacks',
    description: 'Integrates Redis caching for sub-millisecond site recommendations, RabbitMQ for asynchronous itinerary syncing, and Circuit Breaker patterns to prevent cascading failures.',
    architectureType: 'Fault-Tolerant Distributed Cluster',
    techStack: ['Redis In-Memory Cache', 'RabbitMQ Async Queue', 'Resilience4j Circuit Breaker', 'OpenTelemetry Tracing'],
    keyOutcome: 'Resilient system that gracefully survives service degradation with instant cached fallbacks.',
    challenges: ['Cache invalidation sync', 'Dead letter queue handling', 'Exponential backoff tuning'],
    components: [
      { name: 'Circuit Breaker Guard', role: 'Prevents cascading downstream crashes', status: 'online' },
      { name: 'Redis Cache Layer', role: 'In-memory ultra-fast site responses', status: 'cached' },
      { name: 'RabbitMQ Message Queue', role: 'Asynchronous offline event queueing', status: 'online' },
      { name: 'FallBack Recommendation Engine', role: 'Graceful backup when primary fails', status: 'degraded' }
    ]
  }
};
