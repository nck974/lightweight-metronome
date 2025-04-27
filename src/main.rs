pub mod libs;

use libs::{sound::play_sound, timer::MetronomeTimer};
use rodio::OutputStream;

fn main() {
    // Input
    let bpm = 60;
    let sound_hz = 300.0;
    let sound_time_s = 0.03;
    let use_time_signature = true;
    let time_signature = 3;

    // Initialize audio
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();

    // Start metronome
    let mut timer = MetronomeTimer::new(bpm, time_signature, sound_time_s);
    loop {
        timer.increase_beat();

        // Make the first beat have an higher pitch
        let sound_frequency = if timer.counter == 1 && use_time_signature {
            sound_hz * 2.0
        } else {
            sound_hz
        };

        play_sound(&stream_handle, sound_frequency, sound_time_s);
        timer.wait_for_the_next_beat();
    }
}
