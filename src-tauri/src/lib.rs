use mongodb::{options::ClientOptions, Client};
use serde::Serialize;
use tauri::State;
use tokio::sync::Mutex;

#[derive(Serialize)]
pub struct ClientInfo {
    hosts: Vec<String>,
    app_name: Option<String>,
}

struct DbState {
    client: Mutex<Option<Client>>,
}

#[tauri::command]
async fn connect_to_db(
    connection_string: String,
    state: State<'_, DbState>,
) -> Result<ClientInfo, String> {
    let client_options = ClientOptions::parse(&connection_string)
        .await
        .map_err(|e| e.to_string())?;

    let info = ClientInfo {
        hosts: client_options.hosts.iter().map(|h| h.to_string()).collect(),
        app_name: client_options.app_name.clone(),
    };

    let client = Client::with_options(client_options).map_err(|e| e.to_string())?;

    let mut client_guard = state.client.lock().await;
    *client_guard = Some(client);

    println!("Database connected to: {:?}", info.hosts);
    Ok(info)
}

#[tauri::command]
async fn list_databases(state: State<'_, DbState>) -> Result<Vec<String>, String> {
    let client_guard = state.client.lock().await;
    let client = client_guard.as_ref().ok_or("Not connected")?;

    let db_names = client
        .list_database_names(None, None)
        .await
        .map_err(|e| e.to_string())?;

    Ok(db_names)
}

#[tauri::command]
async fn list_collections(
    db_name: String,
    state: State<'_, DbState>,
) -> Result<Vec<String>, String> {
    let client_guard = state.client.lock().await;
    let client = client_guard.as_ref().ok_or("Not connected")?;

    let db = client.database(&db_name);
    let collection_names = db
        .list_collection_names(None)
        .await
        .map_err(|e| e.to_string())?;

    Ok(collection_names)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DbState {
            client: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            connect_to_db,
            list_databases,
            list_collections
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
