import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  NgZone,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceMeshService } from '../../services/face-mesh.service';
import { FaceRegistrationService } from '../../services/face-registration.service';

type StepDirection = 'front' | 'right' | 'left';

interface StepConfig {
  direction: StepDirection;
  text: string;
  fileName: string;
}

@Component({
  selector: 'app-face-registration-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './face-registration-dialog.component.html',
  styleUrls: ['./face-registration-dialog.component.scss'],
})
export class FaceRegistrationDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() userName = '';
  @Output() closed = new EventEmitter<void>();
  @Output() registered = new EventEmitter<void>();

  step = signal(0);
  isStepComplete = signal(false);
  isSubmitting = signal(false);
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  errorMessage = signal('');

  capturedImages: File[] = [];

  private autoCaptureTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly AUTO_CAPTURE_DELAY = 1500;
  autoCountdown = signal(0);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  readonly totalSteps = 9;

  /** 9 bước: 2 chính diện, 3 phải, 3 trái, 1 chính diện cuối */
  readonly stepConfigs: StepConfig[] = [
    { direction: 'front', text: 'Chụp chính diện — Lần 1/2 — Nhìn thẳng vào camera', fileName: 'face_front_1.jpg' },
    { direction: 'front', text: 'Chụp chính diện — Lần 2/2 — Nhìn thẳng vào camera', fileName: 'face_front_2.jpg' },
    { direction: 'right', text: 'Nghiêng phải — Lần 1/3 — Quay mặt sang phải', fileName: 'face_right_1.jpg' },
    { direction: 'right', text: 'Nghiêng phải — Lần 2/3 — Quay mặt sang phải', fileName: 'face_right_2.jpg' },
    { direction: 'right', text: 'Nghiêng phải — Lần 3/3 — Quay mặt sang phải', fileName: 'face_right_3.jpg' },
    { direction: 'left', text: 'Nghiêng trái — Lần 1/3 — Quay mặt sang trái', fileName: 'face_left_1.jpg' },
    { direction: 'left', text: 'Nghiêng trái — Lần 2/3 — Quay mặt sang trái', fileName: 'face_left_2.jpg' },
    { direction: 'left', text: 'Nghiêng trái — Lần 3/3 — Quay mặt sang trái', fileName: 'face_left_3.jpg' },
    { direction: 'front', text: 'Xác nhận chính diện — Nhìn thẳng vào camera', fileName: 'face_front_3.jpg' },
  ];

  currentStepText = computed(() => {
    if (this.isStepComplete() && !this.isSubmitting()) {
      return 'Đã phát hiện khuôn mặt — Đang tự động chụp...';
    }
    return this.stepConfigs[this.step()]?.text ?? '';
  });

  private animationFrameId: number | null = null;

  constructor(
    private faceMeshService: FaceMeshService,
    private faceRegistrationService: FaceRegistrationService,
    private ngZone: NgZone,
  ) {}

  async ngAfterViewInit() {
    await this.setupCamera();
    await this.faceMeshService.init();
    this.startDetection();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.clearAutoCapture();
    const stream = this.videoElement?.nativeElement?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  }

  async setupCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      this.videoElement.nativeElement.srcObject = stream;
      return new Promise((resolve) => {
        this.videoElement.nativeElement.onloadedmetadata = () => resolve(true);
      });
    } catch (e) {
      console.error('Camera access denied:', e);
      return false;
    }
  }

  startDetection() {
    const video = this.videoElement.nativeElement;
    const detect = () => {
      if (video.readyState >= 2) {
        const results = this.faceMeshService.detect(video, performance.now());
        if (results && results.faceLandmarks.length > 0) {
          this.processLandmarks(results.faceLandmarks[0]);
        } else {
          this.isStepComplete.set(false);
        }
      }
      this.animationFrameId = requestAnimationFrame(detect);
    };
    detect();
  }

  processLandmarks(landmarks: any[]) {
    const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    const noseToLeft = nose.x - leftEye.x;
    const noseToRight = rightEye.x - nose.x;
    const ratio = noseToLeft / noseToRight;

    const currentDirection = this.stepConfigs[this.step()]?.direction ?? 'front';
    let isCorrectPose = false;

    switch (currentDirection) {
      case 'front':
        isCorrectPose = ratio > 0.8 && ratio < 1.4;
        break;
      case 'right':
        isCorrectPose = ratio < 0.55;
        break;
      case 'left':
        isCorrectPose = ratio > 1.8;
        break;
    }

    const wasComplete = this.isStepComplete();
    this.isStepComplete.set(isCorrectPose);

    if (isCorrectPose && !wasComplete && !this.isSubmitting()) {
      this.startAutoCapture();
    } else if (!isCorrectPose && wasComplete) {
      this.clearAutoCapture();
    }
  }

  private startAutoCapture() {
    this.clearAutoCapture();
    this.autoCountdown.set(0);

    const startTime = Date.now();
    const intervalMs = 50;

    this.countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / this.AUTO_CAPTURE_DELAY) * 100, 100);
      this.autoCountdown.set(progress);
    }, intervalMs);

    this.autoCaptureTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.clearAutoCapture();
        if (this.isStepComplete() && !this.isSubmitting()) {
          this.nextStep();
        }
      });
    }, this.AUTO_CAPTURE_DELAY);
  }

  private clearAutoCapture() {
    if (this.autoCaptureTimer) {
      clearTimeout(this.autoCaptureTimer);
      this.autoCaptureTimer = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.autoCountdown.set(0);
  }

  private captureFrame(fileName: string): File {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], fileName, { type: mimeString });
  }

  nextStep() {
    this.clearAutoCapture();

    const config = this.stepConfigs[this.step()];
    const imageFile = this.captureFrame(config.fileName);
    this.capturedImages.push(imageFile);

    if (this.step() < this.totalSteps - 1) {
      this.step.update((s) => s + 1);
      this.isStepComplete.set(false);
    } else {
      this.submitFaceRegistration();
    }
  }

  private submitFaceRegistration() {
    this.isSubmitting.set(true);
    this.submitStatus.set('idle');
    this.errorMessage.set('');

    this.faceRegistrationService.registerFace(this.userName, this.capturedImages).subscribe({
      next: (response: any) => {
        this.isSubmitting.set(false);

        const responseStr = JSON.stringify(response);
        if (responseStr.includes('Đăng ký khuôn mặt thành công')) {
          this.submitStatus.set('success');
          const stream = this.videoElement.nativeElement.srcObject as MediaStream;
          stream?.getTracks().forEach((track) => track.stop());
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          this.registered.emit();
        } else {
          this.submitStatus.set('error');
          this.errorMessage.set(response?.data || 'Đăng ký thất bại. Vui lòng thử lại.');
          this.resetCapture();
        }
      },
      error: (err: any) => {
        console.error('Registration failed:', err);
        this.isSubmitting.set(false);
        this.submitStatus.set('error');
        this.errorMessage.set(err?.error?.data || err?.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        this.resetCapture();
      },
    });
  }

  private resetCapture() {
    this.capturedImages = [];
    this.step.set(0);
    this.isStepComplete.set(false);
  }

  close() {
    this.closed.emit();
  }

  /** Phần trăm tiến độ tổng thể */
  get progressPercent(): number {
    return Math.round((this.step() / this.totalSteps) * 100);
  }
}
