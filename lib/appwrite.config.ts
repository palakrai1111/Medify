import * as sdk from "node-appwrite";

// ✅ Load environment variables
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_API_KEY: API_KEY,
  NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID: PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_DOCTOR_COLLECTION_ID: DOCTOR_COLLECTION_ID,
  NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID: APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// ✅ Debug logs (to confirm values are loaded correctly)
console.log("🧪 ENV CHECK:");
console.log("ENDPOINT =", ENDPOINT);
console.log("PROJECT_ID =", PROJECT_ID);
console.log("API_KEY =", API_KEY?.slice(0, 10) + "..."); 
console.log("DATABASE_ID =", DATABASE_ID);
console.log("PATIENT_COLLECTION_ID =", PATIENT_COLLECTION_ID);
console.log("DOCTOR_COLLECTION_ID =", DOCTOR_COLLECTION_ID);
console.log("APPOINTMENT_COLLECTION_ID =", APPOINTMENT_COLLECTION_ID);
console.log("BUCKET_ID =", BUCKET_ID);

// ✅ Initialize Appwrite Client
const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT!) // API Endpoint
  .setProject(PROJECT_ID!) // Project ID
  .setKey(API_KEY!); // API Key (server-side only!)

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

