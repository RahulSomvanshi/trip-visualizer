import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TripVisualizerComponent } from './components/trip-visualizer/trip-visualizer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TripVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'trip-visualizer';
}
