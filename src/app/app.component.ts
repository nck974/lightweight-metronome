import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SoundService } from './service/sound.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('startMetronomeButton') submitButton!: ElementRef;
  @ViewChild('stopMetronomeButton') stopButton!: ElementRef;
  @ViewChildren('timeSignatureRadioButton') timeSignatureRadioButtons!: QueryList<ElementRef<HTMLInputElement>>;

  private metronomeInterval: any;
  private currentBeat: number = 0;
  private isMetronomeRunning: boolean = false;

  timeSignature = 4;
  selectedTimeSignature = "3";
  bpm = 60;

  constructor(private readonly soundService: SoundService) { }

  ngOnInit(): void {
    console.log(this.beats);
  }

  ngOnDestroy(): void {
    this.stopMetronome();
  }

  get getSelectedRadioButtonIndex(): number {
    return this.timeSignatureRadioButtons.toArray().findIndex(x => x.nativeElement.value == this.selectedTimeSignature);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if space bar was pressed
    if (event.code === 'Space' || event.key === ' ') {
      // Prevent default spacebar behavior (like page scrolling)
      event.preventDefault();
      // Trigger the button click
      if (this.isMetronomeRunning) {
        this.stopButton.nativeElement.click()
      } else {
        this.submitButton.nativeElement.click();
      }
    } else if (event.key === 'ArrowUp') {
      this.bpm += 1;
    } else if (event.key === 'ArrowDown') {
      this.bpm -= 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      this.updateTimeSignatureKeyboardEvent(event);
    }
  }

  updateTimeSignatureKeyboardEvent(event: KeyboardEvent) {
    let currentRadioButtonIndex = this.getSelectedRadioButtonIndex;
    if (event.key === 'ArrowRight') {
      currentRadioButtonIndex += 1;
      if (currentRadioButtonIndex == this.timeSignatureRadioButtons.length) {
        currentRadioButtonIndex = 0;
      }
    } else {
      currentRadioButtonIndex -= 1;
      if (currentRadioButtonIndex < 0) {
        currentRadioButtonIndex = this.timeSignatureRadioButtons.length - 1;
      }
    }
    this.selectedTimeSignature = this.timeSignatureRadioButtons.toArray()[currentRadioButtonIndex].nativeElement.value;

  }

  stopMetronome() {
    // Clear the interval when the component is destroyed
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
    }
    this.isMetronomeRunning = false;
  }

  get beats() {
    return [...Array(this.timeSignature).keys()]
  }

  /// In ms
  calculateWaitingTime(bpm: number): number {
    return 60 / bpm * 1000;
  }

  startMetronome(event: SubmitEvent, bpm: string, timeSignature: string): void {
    console.log("Starting metronome...")
    event.preventDefault()
    this.stopMetronome()
    this.isMetronomeRunning = true;

    // Update metronome size:
    const newTimeSignature = Number.parseInt(timeSignature)
    this.resetMetronome(newTimeSignature);

    // Start already in 0 before waiting for the first interval
    this.playBeat(newTimeSignature);

    // Then start the loop with the calculated bpm
    this.metronomeInterval = setInterval(() => {
      this.playBeat(newTimeSignature);
    }, this.calculateWaitingTime(Number.parseInt(bpm)));
  }

  playBeat(timeSignature: number) {
    this.changeColors();
    let remarkBeat = this.currentBeat == 0;
    if (timeSignature == 6 && this.currentBeat == 3) {
      remarkBeat = true;
    }
    this.soundService.playAudio(remarkBeat);
    this.increaseBeat(timeSignature)

  }

  increaseBeat(timeSignature: number): void {
    this.currentBeat += 1;
    if (this.currentBeat == timeSignature) {
      this.currentBeat = 0;
    }
  }

  resetMetronome(newTimeSignature: number) {
    this.currentBeat = 0;
    this.timeSignature = newTimeSignature;
    this.beats.forEach(beat => {
      this.changeBackgroundColor(`beat-${beat}`, "red");
    });
  }

  changeColors(): void {
    // Change the background color of the element
    let previousBeat = this.currentBeat - 1;
    if (previousBeat < 0) {
      previousBeat = this.timeSignature - 1;
    }
    this.changeBackgroundColor(`beat-${this.currentBeat}`, "blue");
    this.changeBackgroundColor(`beat-${previousBeat}`, "red");
  }

  changeBackgroundColor(elementId: string, color: string) {
    const previousBeatElement = document.getElementById(elementId);
    if (previousBeatElement) {
      previousBeatElement.style.backgroundColor = color;
    }
  }
}
