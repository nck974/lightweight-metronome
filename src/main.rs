pub mod libs;

use libs::{sound::SoundPlayer, timer::MetronomeTimer};

fn main() {
    // Input
    let bpm = 60;
    let sound_hz = 300.0;
    let sound_time_s = 0.03;
    let use_time_signature = true;
    let time_signature = 3;

    // Start metronome
    let mut timer = MetronomeTimer::new(bpm, time_signature, sound_time_s);
    let sound_player = SoundPlayer::new(sound_time_s);
    loop {
        timer.increase_beat();

        // Make the first beat have an higher pitch
        let sound_frequency = if timer.counter == 1 && use_time_signature {
            sound_hz * 2.0
        } else {
            sound_hz
        };

        sound_player.play_sound(sound_frequency);

        timer.wait_for_the_next_beat();
    }
}
