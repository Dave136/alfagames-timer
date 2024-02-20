// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs::File, io::BufReader};
use tauri::{
    window::PlatformWebview, AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu,
    Window, WindowMenuEvent, Wry,
};

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

fn custom_menu() -> Menu {
    let app_menu = Menu::new()
        .add_native_item(MenuItem::About(
            "App".to_string(),
            AboutMetadata::new()
                .authors(vec!["David Arenas".to_string()])
                .license("MIT")
                .version(env!("CARGO_PKG_VERSION"))
                .website("https://github.com/Dave136/alfagames-timer")
                .website_label("alfagames-timer"),
        ))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit);

    let view_menu = Menu::new().add_native_item(MenuItem::Separator).add_item(
        CustomMenuItem::new("toggle_devtools", "Toggle Developer Tools")
            .accelerator("CmdOrCtrl+Shift+Alt+I"),
    );

    let window_menu = Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom)
        .add_native_item(MenuItem::Separator)
        .add_item(
            CustomMenuItem::new("reload_app", "Reload Webview")
                .accelerator("CmdOrCtrl+Shift+Alt+R"),
        );

    Menu::new()
        .add_submenu(Submenu::new("App", app_menu))
        .add_submenu(Submenu::new("View", view_menu))
        .add_submenu(Submenu::new("Window", window_menu))
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

fn handle_menu_event(event: WindowMenuEvent<Wry>) {
    match event.menu_item_id() {
        "quit" => {
            let app = event.window().app_handle();
            app.exit(0)
        }
        "reload_app" => event
            .window()
            .with_webview(reload_webview_inner)
            .expect("Error while reloading webview"),
        "toggle_devtools" => {
            let window = event.window();

            if window.is_devtools_open() {
                window.close_devtools();
            } else {
                window.open_devtools();
            }
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            play_sound,
            download_sound,
            toggle_devtools
        ])
        // .on_menu_event(handle_menu_event)
        // .menu(custom_menu())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
