/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}

/* ✅ FIXED to match createAppointment */
declare type CreateAppointmentParams = {
  userId: string;
  primaryPhysician: string;
  reason: string;
  schedule: string; // ISO string (instead of Date)
  status: Status;
  note?: string;
};

/* ✅ FIXED to match updateAppointment */
declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  type: "schedule" | "cancel";
  appointment: {
    primaryPhysician: string;
    schedule: string | Date;
    status: Status;
    cancellationReason?: string;
  };
};
