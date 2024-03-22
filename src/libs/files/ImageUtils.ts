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

  static getNewSize(image: HTMLImageElement, maxWidth: number, maxHeight: number): { width: number; height: number } {
    const width = image.width;
    const height = image.height;

    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
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

    return { width: newWidth, height: newHeight };
  }

  static async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    const image = await this.loadImage(file);

    const size = this.getNewSize(image, maxWidth, maxHeight);

    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Cannot create context');
    }

    const x = (maxWidth - size.width) / 2;
    const y = (maxHeight - size.height) / 2;

    console.log('oW:', image.width, ', oH:', image.height);
    console.log('nW:', size.width, ', nH:', size.height);
    console.log('mW:', maxWidth, ', mH:', maxHeight);
    console.log('x:', x, ', y:', y);

    context.drawImage(image, x, y, size.width, size.height);

    return await this.getBlob(canvas, 'image/png');
  }
}
