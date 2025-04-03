export abstract class HttpResponseMessage {
  static created(entity: string): string {
    return `${entity} Created Successfully`;
  }

  static updated(entity: string, data: object) {
    return {
      message: `${entity} Updated Successfully`,
      data,
    };
  }

  static deleted(entity: string): string {
    return `${entity} Deleted Successfully`;
  }

  static notFound(entity: string): string {
    return `${entity} Not Found`;
  }

  static alreadyExists(entity: string): string {
    return `${entity} Already Exists`;
  }
}
