import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  sound1 = '../../../assets/audio/clap.mp3';
  sound2 = '../../../assets/audio/clap_4.mp3';

  audio_1 = new Audio();
  audio_2 = new Audio();

  constructor() {
    this.audio_1.src = this.sound1;
    this.audio_2.src = this.sound2;
  }

  playAudio(alternativeAudio: boolean): void {
    let audio;
    if (alternativeAudio) {
      audio = this.audio_1;
    } else {
      audio = this.audio_2;
    }
    audio.load();
    audio.play();
  }
}
