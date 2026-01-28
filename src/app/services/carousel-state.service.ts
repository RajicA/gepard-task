import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BannerSlide } from '../models/banner-slide.model';

@Injectable()
export class CarouselStateService {
  private readonly slidesSignal = signal<BannerSlide[]>([]);
  private readonly renderIndexSignal = signal(0);
  private readonly isAnimatingSignal = signal(true);
  private readonly isDraggingSignal = signal(false);
  private readonly dragOffsetSignal = signal(0);
  private readonly transitionDurationMsSignal = signal(420);
  private readonly isTransitioningSignal = signal(false);

  private readonly renderSlidesSignal = computed(() => {
    const slides = this.slidesSignal();
    if (slides.length === 0) {
      return [] as BannerSlide[];
    }
    return [slides[slides.length - 1], ...slides, slides[0]];
  });

  private readonly activeIndexSignal = computed(() => {
    const slides = this.slidesSignal();
    if (slides.length === 0) {
      return 0;
    }
    const rawIndex = this.renderIndexSignal() - 1;
    if (rawIndex < 0) {
      return slides.length - 1;
    }
    if (rawIndex >= slides.length) {
      return 0;
    }
    return rawIndex;
  });

  private readonly canNavigateSignal = computed(() => {
    const slides = this.slidesSignal();
    return slides.length > 1 && !this.isTransitioningSignal() && !this.isDraggingSignal();
  });

  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  readonly slides = this.slidesSignal.asReadonly();
  readonly renderSlides = this.renderSlidesSignal;
  readonly renderIndex = this.renderIndexSignal.asReadonly();
  readonly activeIndex = this.activeIndexSignal;
  readonly isAnimating = this.isAnimatingSignal.asReadonly();
  readonly isDragging = this.isDraggingSignal.asReadonly();
  readonly dragOffset = this.dragOffsetSignal.asReadonly();
  readonly isTransitioning = this.isTransitioningSignal.asReadonly();
  readonly transitionDurationMs = this.transitionDurationMsSignal.asReadonly();
  readonly slidesCount = computed(() => this.slidesSignal().length);

  setSlides(slides: BannerSlide[]): void {
    this.resetInteractionState();
    this.slidesSignal.set(slides);
    if (slides.length === 0) {
      this.renderIndexSignal.set(0);
      return;
    }
    this.renderIndexSignal.set(1);
  }

  setTransitionDuration(durationMs: number): void {
    if (Number.isFinite(durationMs) && durationMs > 0) {
      this.transitionDurationMsSignal.set(durationMs);
    }
  }

  beginDrag(): void {
    if (this.isTransitioningSignal()) {
      return;
    }
    this.isDraggingSignal.set(true);
    this.dragOffsetSignal.set(0);
  }

  updateDragOffset(deltaX: number): void {
    if (!this.isDraggingSignal()) {
      return;
    }
    this.dragOffsetSignal.set(deltaX);
  }

  endDrag(direction: 'next' | 'prev' | null): void {
    if (!this.isDraggingSignal()) {
      return;
    }
    this.isDraggingSignal.set(false);
    this.dragOffsetSignal.set(0);

    if (!direction || !this.canNavigateSignal()) {
      return;
    }

    if (direction === 'next') {
      this.next();
    } else {
      this.prev();
    }
  }

  cancelDrag(): void {
    if (!this.isDraggingSignal()) {
      return;
    }
    this.isDraggingSignal.set(false);
    this.dragOffsetSignal.set(0);
  }

  next(): void {
    this.navigate('next');
  }

  prev(): void {
    this.navigate('prev');
  }

  goToSlide(index: number): void {
    this.navigate('index', index);
  }

  onTransitionEnd(): void {
    this.commitTransition();
  }

  private navigate(mode: 'next' | 'prev' | 'index', index?: number): void {
    if (!this.canNavigateSignal()) {
      return;
    }
    this.beginTransition();
    if (mode === 'next') {
      this.renderIndexSignal.update((value) => value + 1);
      return;
    }
    if (mode === 'prev') {
      this.renderIndexSignal.update((value) => value - 1);
      return;
    }
    if (typeof index === 'number') {
      this.renderIndexSignal.set(index + 1);
    }
  }

  private beginTransition(): void {
    this.isTransitioningSignal.set(true);
    this.startTransitionFallback();
  }

  private commitTransition(): void {
    if (!this.isTransitioningSignal()) {
      return;
    }
    this.clearTransitionFallback();
    this.isTransitioningSignal.set(false);
    this.handleEdgeJumpIfNeeded();
  }

  private handleEdgeJumpIfNeeded(): void {
    const slides = this.slidesSignal();
    if (slides.length === 0) {
      return;
    }
    if (this.renderIndexSignal() === 0) {
      this.jumpTo(slides.length);
      return;
    }
    if (this.renderIndexSignal() === slides.length + 1) {
      this.jumpTo(1);
    }
  }

  private startTransitionFallback(): void {
    this.clearTransitionFallback();
    this.transitionTimeoutId = setTimeout(
      () => this.commitTransition(),
      this.transitionDurationMsSignal()
    );
  }

  private clearTransitionFallback(): void {
    if (!this.transitionTimeoutId) {
      return;
    }
    clearTimeout(this.transitionTimeoutId);
    this.transitionTimeoutId = null;
  }

  private jumpTo(index: number): void {
    this.isAnimatingSignal.set(false);
    this.renderIndexSignal.set(index);
    requestAnimationFrame(() => {
      this.isAnimatingSignal.set(true);
    });
  }

  private resetInteractionState(): void {
    this.clearTransitionFallback();
    this.isTransitioningSignal.set(false);
    this.isDraggingSignal.set(false);
    this.dragOffsetSignal.set(0);
  }

  private cleanup(): void {
    this.clearTransitionFallback();
  }
}
