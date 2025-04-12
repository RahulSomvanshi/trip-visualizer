import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-visualizer',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './trip-visualizer.component.html',
  styleUrl: './trip-visualizer.component.css'
})
export class TripVisualizerComponent {
  startPoint: string = '';
  endPoint: string = '';
  trips: any[] = [];

  private currentSegmentStart: string | null = null;
  private segmentIdCounter = 0;

  addTrip() {
    const start = this.startPoint.substring(0, 3).toUpperCase();
    const end = this.endPoint.substring(0, 3).toUpperCase();

    const lastTrip = this.trips[this.trips.length - 1];
    let isNewSegment = false;

    if (lastTrip && lastTrip.level === 2 && lastTrip.end !== start) {
      this.currentSegmentStart = null;
      this.segmentIdCounter++; // increment segment
      isNewSegment = true;
    }

    if (this.currentSegmentStart === null) {
      this.currentSegmentStart = start;
    }
    const isSameCity = start === end;
    const trip = {
      start,
      end,
      isContinued: this.isContinuedTrip(start),
      level: this.isRepeatedTrip(start, end) ? 2 : 1,
      segmentId: this.segmentIdCounter,
      isStartingCurve: isNewSegment,
      isSameCity: isSameCity 
    };

    this.trips.push(trip);
    this.startPoint = '';
    this.endPoint = '';
  }

  isContinuedTrip(currentStart: string) {
    if (this.trips.length === 0) return true;
    const lastTrip = this.trips[this.trips.length - 1];
    return lastTrip.end !== currentStart;
  }

  isRepeatedTrip(currentStart: string, currentEnd: string) {
    if (this.trips.length < 2) return false;

    const firstOfSegment = this.trips.find(trip => trip.start === this.currentSegmentStart);
    const lastTrip = this.trips[this.trips.length - 1];

    return firstOfSegment?.start === currentStart && lastTrip.end === currentEnd;
  }

  getStartX(index: number) {
    return 30 + index * 125;
  }

  getEndX(index: number) {
    return 150 + index * 125;
  }

  getArrowPath(index: number) {
    const endX = this.getEndX(index);
    return `M ${endX} 50 L ${endX - 10} 45 L ${endX - 10} 55 Z`;
  }

  getCurvePath(index: number) {
    const trip = this.trips[index];
    const startX = this.getStartX(index);
    const endX = this.getEndX(index);
  
    const midX = (startX + endX) / 2;
    const curveOffsetY = 40; // Control how deep the curves bend
  
    // First half: upward or downward
    const firstControlY = trip.segmentId % 2 === 0 ? 50 - curveOffsetY : 50 + curveOffsetY;
    // Second half: opposite direction
    const secondControlY = trip.segmentId % 2 === 0 ? 50 + curveOffsetY : 50 - curveOffsetY;
  
    return `
      M ${startX} 50
      C ${startX + 25} ${firstControlY}, ${midX - 25} ${firstControlY}, ${midX} 50
      C ${midX + 25} ${secondControlY}, ${endX - 25} ${secondControlY}, ${endX} 50
    `;
  }
  

  getLineColor(trip: any): string {
    // After a curve trip, we use grey/dark grey
    if (trip.segmentId > 0) {
      return trip.segmentId % 2 === 0 ? 'grey' : 'darkgrey';
    }

    if (trip.level === 2) return 'yellow';
    if (!trip.isContinued) return 'blue';
    if (trip.start === trip.end) return 'grey';
    return 'purple';
  }

  getCircleColor(trip: any): string {
    // If segmentId > 0, return the same color as the line or respective matched color
    if (trip.segmentId > 0) {
      return this.getLineColor(trip); // Use the same color logic as the line
    }
  
    // Otherwise, return specific colors based on the trip properties
    if (trip.level === 2) return 'yellow';
    if (!trip.isContinued) return 'blue';
    if (trip.start === trip.end) return 'grey';
    return 'purple'; // Default color if none of the above
  }
  getcurveColor(trip: any): string {
    return trip.segmentId > 0 ? 'darkgrey' : 'yellow';
  }
  getTriangleColor(trip:any){
    if (trip.segmentId > 0) {
      return this.getLineColor(trip);
    }
  
    // Otherwise, return specific colors based on the trip properties
    if (trip.level === 2) return 'yellow';
    if (!trip.isContinued) return 'blue';
    if (trip.start === trip.end) return 'grey';
    return 'purple';
  }
  

  isTripOver(trips: any[]): boolean {
    const lastTripIndex = trips.length - 1;
    const lastTrip = trips[lastTripIndex];
    
    return trips[0].start === lastTrip.end
  }

  
}
