// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::BufReader};

use rodio::Source;

const PATH: &'static str = "../public/sounds/";

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn play_sound(path: &str) {
    let file = File::open(format!("{}{}", PATH, path)).unwrap();

    std::thread::spawn(|| {
        let src = rodio::Decoder::new(BufReader::new(file)).unwrap();
        let (_stream, handle) = rodio::OutputStream::try_default().unwrap();
        let sink = rodio::Sink::try_new(&handle).unwrap();
        sink.append(src);

        sink.sleep_until_end();
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, play_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
