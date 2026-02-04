use mongodb::{options::ClientOptions, Client};
use serde::Serialize;
use tauri::State;
use tokio::sync::Mutex;
use futures::stream::StreamExt;

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

//get the data from a collection and return as json
#[tauri::command]
async fn get_collection_data(
    db_name: String,
    collection_name: String,
    state: State<'_, DbState>,
) -> Result<serde_json::Value, String> {
    let client_guard = state.client.lock().await;
    let client = client_guard.as_ref().ok_or("Not connected")?;

    let db = client.database(&db_name);
    let collection = db.collection::<mongodb::bson::Document>(&collection_name);

    // Add a default limit of 50 documents to keep it responsive
    let find_options = mongodb::options::FindOptions::builder()
        .limit(50)
        .build();

    let mut cursor = collection
        .find(None, find_options)
        .await
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    while let Some(doc) = cursor.next().await {
        let doc = doc.map_err(|e| e.to_string())?;
        // Convert BSON document to JSON Value
        let json_value = serde_json::to_value(doc).map_err(|e| e.to_string())?;
        results.push(json_value);
    }

    Ok(serde_json::Value::Array(results))
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
            list_collections,
            get_collection_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
