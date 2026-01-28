import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BannerSlide } from '../../models/banner-slide.model';

@Component({
  selector: 'app-carousel-dots',
  templateUrl: './carousel-dots.component.html',
  styleUrl: './carousel-dots.component.scss'
})
export class CarouselDotsComponent {
  @Input() slides: BannerSlide[] = [];
  @Input() activeIndex = 0;
  @Output() navigate = new EventEmitter<number>();

  protected onNavigate(index: number): void {
    this.navigate.emit(index);
  }
}
