export class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} non trouvé.`);
    this.name = 'NotFoundError';
  }
}