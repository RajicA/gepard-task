# Gepard Task – Mobile Carousel

## Tech stack
- Angular (standalone components + signals)
- RxJS (timers, async data)
- SCSS (component styles + global theme variables)

## Live demo
https://gepard-task.onrender.com/

## Architecture decisions
- **Component-scoped state**: `CarouselStateService` is provided at the carousel component level so each carousel instance has isolated state and lifecycle cleanup.
- **State machine only**: `CarouselStateService` owns only carousel state (slides, render index, drag/transition flags, offsets) and navigation actions. It contains no timers or DOM event wiring.
- **Timer separated**: `CarouselAutoAdvanceService` owns auto-advance scheduling and pause/resume rules, calling `carousel.next()` when allowed. This keeps timing concerns isolated and easier to change without touching carousel logic.
- **Gesture logic in a directive**: `CarouselGestureDirective` handles pointer capture, intent detection, and swipe thresholds, then calls semantic actions on the state service. This keeps templates clean and makes gestures reusable/testable.
- **Layout computed in component**: The carousel component builds a view-model (transform string, track width) so CSS/layout stays in the view layer while the state service remains purely numeric.
- **Clone strategy for infinite loop**: Rendered slides are `[last, ...slides, first]`. The service keeps a `renderIndex` (0..length+1) and maps to `activeIndex` for dot indicators.
- **Mock data layer**: `BannerSlidesApiService` simulates API loading, keeping demo data out of the component and ready for replacement with real endpoints.

## Structure (key files)
- `src/app/components/` – UI components (carousel, slide, dots, desktop message, state overlay, app button)
- `src/app/directives/carousel-gesture.directive.ts` – pointer/swipe handling
- `src/app/services/carousel-state.service.ts` – carousel state machine
- `src/app/services/carousel-auto-advance.service.ts` – timer/auto-advance driver
- `src/app/services/banner-slides-api.service.ts` – mock data source
- `src/app/models/` – typed models
- `src/styles/theme.scss` – theme variables shared across components

## Run
```bash
npm install
ng serve
```
