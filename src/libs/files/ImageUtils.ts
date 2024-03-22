export default class ImageUtils {
  private constructor() {
    /* */
  }

  static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = URL.createObjectURL(file);

      image.onload = () => {
        resolve(image);
      };

      image.onerror = reject;

      image.src = URL.createObjectURL(file);
    });
  }

  static getBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject('Blob is null');
        } else {
          resolve(blob);
        }
      }, type);
    });
  }

  static async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    const image = await this.loadImage(file);

    const width = image.width;
    const height = image.height;

    if (width <= maxWidth && height <= maxHeight) {
      return file;
    }

    let newWidth;
    let newHeight;

    if (width > height) {
      newHeight = height * (maxWidth / width);
      newWidth = maxWidth;
    } else {
      newWidth = width * (maxHeight / height);
      newHeight = maxHeight;
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Cannot create context');
    }

    context.drawImage(image, 0, 0, newWidth, newHeight);

    return await this.getBlob(canvas, file.type);
  }
}
