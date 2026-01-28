import { Component } from '@angular/core';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BannerCarouselComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
