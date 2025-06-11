export abstract class BaseManager {
  constructor() {}

  protected async handleError(error: unknown, context: string): Promise<void> {
    console.error(`Error ${context}:`, error);
  }
} 