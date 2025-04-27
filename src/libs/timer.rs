use std::{thread::sleep, time::Duration};

pub struct MetronomeTimer {
    beat_time: f64,
    pub counter: i32,
    time_signature: i32,
    sound_time: f64,
}

impl MetronomeTimer {
    pub fn new(bpm: i32, time_signature: i32, sound_time: f64) -> Self {
        let beat_time = 60.0 / bpm as f64;
        return MetronomeTimer {
            beat_time: beat_time,
            counter: 0,
            time_signature: time_signature,
            sound_time: sound_time,
        };
    }

    pub fn increase_beat(&mut self) {
        self.counter += 1;

        if self.counter % self.time_signature == 0 {
            self.counter = 0;
        }
    }

    pub fn wait_for_the_next_beat(&self) {
        sleep(Duration::from_secs_f64(self.beat_time - self.sound_time));
    }
}
