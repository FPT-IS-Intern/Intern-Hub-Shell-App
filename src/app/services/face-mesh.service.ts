import { Injectable } from '@angular/core';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root',
})
export class FaceMeshService {
  private faceLandmarker: FaceLandmarker | null = null;

  async init() {
    if (this.faceLandmarker) return;

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode: 'VIDEO',
      numFaces: 1,
    });
  }

  detect(video: HTMLVideoElement, timestamp: number) {
    if (!this.faceLandmarker) return null;
    return this.faceLandmarker.detectForVideo(video, timestamp);
  }
}
