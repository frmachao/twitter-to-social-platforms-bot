export class ServiceError extends Error {
    constructor(
        message: string,
        public readonly service: string,
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = 'ServiceError';
    }
} 