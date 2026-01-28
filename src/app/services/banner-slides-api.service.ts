import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { BANNER_SLIDES } from '../constants/banner-slides';
import { BannerSlide } from '../models/banner-slide.model';

@Injectable({ providedIn: 'root' })
export class BannerSlidesApiService {
  getSlides(): Observable<BannerSlide[]> {
    return of(BANNER_SLIDES).pipe(delay(650));
  }
}
