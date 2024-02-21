// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs::File, io::BufReader};
use tauri::{window::PlatformWebview, Window};

#[tauri::command]
fn download_sound(url: &str, name: &str, app_handle: tauri::AppHandle) {
    let app_data_dir = app_handle.path_resolver().app_local_data_dir().unwrap();
    let app_dir = app_data_dir.to_str().unwrap();
    let response = reqwest::blocking::get(url).unwrap();
    let bytes = response.bytes().unwrap();

    std::fs::write(format!("{}/sounds/{}", app_dir, name), &bytes).unwrap();
}

#[tauri::command]
fn play_sound(name: &str, window: Window, app_handle: tauri::AppHandle) {
    // let file = File::open(format!("{}{}", PATH, path)).unwrap();
    let app_data_dir = app_handle.path_resolver().app_local_data_dir().unwrap();
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

#[tauri::command]
fn toggle_devtools(window: tauri::Window) {
    if window.is_devtools_open() {
        window.close_devtools();
    } else {
        window.open_devtools();
    }
}

#[tauri::command]
fn reload_app(window: tauri::Window) {
    window
        .with_webview(reload_webview_inner)
        .expect("Error while reloading webview");
}

fn reload_webview_inner(webview: PlatformWebview) {
    #[cfg(target_os = "linux")]
    {
        use webkit2gtk::traits::WebViewExt;

        webview.inner().reload();
    }
    #[cfg(target_os = "windows")]
    unsafe {
        webview
            .controller()
            .CoreWebView2()
            .expect("Unable to get handle on inner webview")
            .Reload()
            .expect("Unable to reload webview");
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            play_sound,
            download_sound,
            toggle_devtools,
            reload_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
