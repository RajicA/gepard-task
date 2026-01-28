import { BannerSlide } from '../models/banner-slide.model';

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'winzup',
    title: 'WinzUp Loyalty Program',
    text: 'Get up to 35% in rewards: daily rakeback, weekly cashback and level-up bonuses',
    highlightToken: '35% in rewards',
    backgroundImage: '/assets/winzup-bg-mob.webp',
    mainImage: '/assets/winzup_mob.png',
    buttonText: 'Join now',
    buttonLink: 'https://www.google.com'
  },
  {
    id: 'valentines',
    title: "Valentine's Fortune Drops",
    text: 'Trigger random prizes and win a share of €30,000!',
    highlightToken: '€30,000',
    backgroundImage: '/assets/ValentinesFortuneDrops_mob-bg.png',
    mainImage: '/assets/ValentinesFortuneDrops_mob-pic.png',
    buttonText: 'Learn more',
    buttonLink: 'https://www.google.com'
  },
  {
    id: 'wheel',
    title: 'Wheel of Winz',
    text: 'Spin the wheel to win up to €15,000 weekly',
    highlightToken: '€15,000',
    backgroundImage: '/assets/wheel-mob-bg.webp',
    mainImage: '/assets/wheel-mob.png',
    buttonText: 'Spin now',
    buttonLink: 'https://www.google.com'
  }
];
