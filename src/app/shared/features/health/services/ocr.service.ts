import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { createWorker, PSM } from 'tesseract.js';

export interface GlucoseOcrResult {
  rawText: string;
  extractedValue: number | null;
  extractedUnit: 'mg/dL' | 'mmol/L' | null;
  confidence: number;
  imageFile: File;
  imageName: string;
}

@Injectable({ providedIn: 'root' })
export class OcrService {

  async captureAndScan(): Promise<GlucoseOcrResult> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      quality: 90,
      correctOrientation: true,
    });

    const base64 = photo.base64String!;
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const worker = await createWorker('eng', 1, {
      workerPath: '/assets/tesseract/worker.min.js',
    });
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      tessedit_char_whitelist: '0123456789.,mgdLmol/ ',
    });

    const { data: { text, confidence } } = await worker.recognize(dataUrl);
    await worker.terminate();

    const { value, unit } = this.extractGlucose(text);

    const blob = this.base64ToBlob(base64, 'image/jpeg');
    const imageName = `glucometer_${Date.now()}.jpg`;
    const imageFile = new File([blob], imageName, { type: 'image/jpeg' });

    return {
      rawText: text.trim(),
      extractedValue: value,
      extractedUnit: unit,
      confidence: Math.round(confidence),
      imageFile,
      imageName,
    };
  }

  private extractGlucose(text: string): { value: number | null; unit: 'mg/dL' | 'mmol/L' | null } {
    // mmol/L: e.g. "10.1", "5.4 mmol/L"
    const mmolMatch = text.match(/\b(\d{1,2}[.,]\d)\b/);
    if (mmolMatch) {
      const v = parseFloat(mmolMatch[1].replace(',', '.'));
      if (v >= 1.1 && v <= 33.3) return { value: v, unit: 'mmol/L' };
    }

    // mg/dL: e.g. "182", "350 mg/dL"
    for (const m of [...text.matchAll(/\b(\d{2,3})\b/g)]) {
      const v = parseInt(m[1], 10);
      if (v >= 20 && v <= 600) return { value: v, unit: 'mg/dL' };
    }

    return { value: null, unit: null };
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type });
  }
}
