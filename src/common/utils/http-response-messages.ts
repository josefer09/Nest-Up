export abstract class HttpResponseMessage {
  static created(entity: string, data: object) {
    return {
      message: `${entity} Created Successfully`,
      data,
    }
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
}
