import { Component, Input } from '@angular/core';
import { BannerSlide } from '../../models/banner-slide.model';

@Component({
  selector: 'app-banner-slide',
  templateUrl: './banner-slide.component.html',
  styleUrl: './banner-slide.component.scss'
})
export class BannerSlideComponent {
  @Input() slide!: BannerSlide;
  @Input() isActive = false;

  protected get highlightParts(): { before: string; token: string; after: string } {
    const text = this.slide?.text ?? '';
    const token = this.slide?.highlightToken ?? '';
    if (!token) {
      return { before: text, token: '', after: '' };
    }
    const index = text.indexOf(token);
    if (index === -1) {
      return { before: text, token: '', after: '' };
    }
    return {
      before: text.slice(0, index),
      token,
      after: text.slice(index + token.length)
    };
  }
}
