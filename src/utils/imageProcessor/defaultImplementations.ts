import { CanvasCreator, ImageLoader } from "./types";

// 默认实现
export class DefaultCanvasCreator implements CanvasCreator {
  createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}

export class DefaultImageLoader implements ImageLoader {
  async loadImage(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`图像加载失败: ${src}`);
        resolve(null);
      };
      img.src = src;
    });
  }
}