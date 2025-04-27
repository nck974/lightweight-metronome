use rodio::{source::SineWave, Sink};
use rodio::{OutputStream, OutputStreamHandle, Source};
use std::time::Duration;
pub struct SoundPlayer {
    sound_time: f64,
    stream_handle: OutputStreamHandle,
}

impl SoundPlayer {
    pub fn new(sound_time: f64) -> Self {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        SoundPlayer {
            sound_time,
            stream_handle,
        }
    }

    pub fn play_sound(&self, sound_frequency: f32) {
        let sink = Sink::try_new(&self.stream_handle).unwrap();

        let beep = SineWave::new(sound_frequency)
            .take_duration(Duration::from_secs_f64(self.sound_time));
        sink.append(beep);

        sink.sleep_until_end();
    }
}
