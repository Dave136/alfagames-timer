// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::BufReader};
use tauri::Window;

#[tauri::command]
fn download_sound(url: &str, name: &str, app_handle: tauri::AppHandle) {
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let app_dir = app_data_dir.to_str().unwrap();
    let response = reqwest::blocking::get(url).unwrap();
    let bytes = response.bytes().unwrap();

    std::fs::write(format!("{}/sounds/{}", app_dir, name), &bytes).unwrap();
}

#[tauri::command]
fn play_sound(name: &str, window: Window, app_handle: tauri::AppHandle) {
    // let file = File::open(format!("{}{}", PATH, path)).unwrap();
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let app_dir = app_data_dir.to_str().unwrap();
    let file = File::open(format!("{}/sounds/{}", app_dir, name)).unwrap();

    std::thread::spawn(move || {
        let src = rodio::Decoder::new(BufReader::new(file)).unwrap();
        let (_stream, handle) = rodio::OutputStream::try_default().unwrap();
        let sink = rodio::Sink::try_new(&handle).unwrap();
        sink.append(src);

        sink.sleep_until_end();

        window.emit("ended-sound", true).unwrap();
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_sound, download_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
