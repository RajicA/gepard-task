import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  imports: [RouterLink]
})
export class AppButtonComponent {
  @Input() link = '';
  @Input() label = '';
  @Input() target = '_blank';
  @Input() rel = 'noopener noreferrer';

  protected get isInternalLink(): boolean {
    return this.link.startsWith('/');
  }
}
