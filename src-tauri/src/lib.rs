use mongodb::{Client, options::ClientOptions};
use tauri::State;
use tokio::sync::Mutex;


struct DbState {
    client: Mutex<Option<Client>>,
}


#[tauri::command]
async fn connect_to_db(
    connection_string: String,
    state: State<'_, DbState>,
) -> Result<String, String> {
    let client_options = ClientOptions::parse(&connection_string)
        .await
        .map_err(|e| e.to_string())?;
    let client = Client::with_options(client_options).map_err(|e| e.to_string())?;

    let mut client_guard = state.client.lock().await;
    *client_guard = Some(client);

    println!("Database connected");
    Ok("Connected successfully".into())
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DbState {
            client: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![connect_to_db, list_databases])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
