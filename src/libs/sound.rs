use rodio::{source::SineWave, Sink};
use rodio::{OutputStreamHandle, Source};
use std::time::Duration;

pub fn play_sound(handle: &OutputStreamHandle, sound_hz: f32, sound_time_s: f64) {
    let sink = Sink::try_new(handle).unwrap();

    let beep = SineWave::new(sound_hz).take_duration(Duration::from_secs_f64(sound_time_s));
    sink.append(beep);

    sink.sleep_until_end();
}
