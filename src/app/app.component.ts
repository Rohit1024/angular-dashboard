import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  static readonly darkStyleName = 'darkMode';

  toggleTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.remove(AppComponent.darkStyleName);
    } else {
      document.body.classList.add(AppComponent.darkStyleName);
    }
  }
}
