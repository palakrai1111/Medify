import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // ✅ Appwrite stores dates as ISO strings, not JS Date objects
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider?: string; // ✅ insurance may not always be filled
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: string[]; // ✅ stored as file IDs array in Appwrite, not FormData
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
 patient?: Patient | null;
  schedule: string; // ✅ ISO string from Appwrite, not Date
  status: Status;
  primaryPhysician: string;
  reason: string;
  note?: string; // ✅ optional, not always filled
  userId: string;
  cancellationReason?: string | null;
}
