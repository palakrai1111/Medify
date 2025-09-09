"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";

import { formatDateTime, parseStringify } from "../utils";
import { getPatient } from "./user.actions";

// CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const { userId, primaryPhysician, schedule, reason, note, status } =
      appointment;

    const patient = await getPatient(userId);

    // 🔥 Ensure schedule is valid
    const dt = typeof schedule === "string" ? new Date(schedule) : schedule;
    if (!(dt instanceof Date) || isNaN(dt.getTime())) {
      throw new Error("Invalid schedule date");
    }
    const formattedSchedule = dt.toISOString();

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        primaryPhysician,
        schedule: formattedSchedule,
        reason,
        note: note || "",
        status,
        patientName: patient?.name || "Unknown",
      }
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
  }
};

// ✅ GET ALL APPOINTMENTS (for Admin Dashboard)
export const getAppointments = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify(appointments.documents as Appointment[]);
  } catch (error) {
    console.error("❌ Error retrieving appointments:", error);
    return [];
  }
};

// GET RECENT APPOINTMENTS (stats)
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        acc[`${appointment.status}Count` as keyof typeof acc]++;
        return acc;
      },
      initialCounts
    );

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    });
  } catch (error) {
    console.error("❌ Error retrieving recent appointments:", error);
  }
};

// SEND SMS NOTIFICATION
export const sendSMSNotification = async (
  userId: string,
  content: string
) => {
  try {
    const message = await messaging.createSms(ID.unique(), content, [], [
      userId,
    ]);
    return parseStringify(message);
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const patient = await getPatient(userId);
    const { primaryPhysician, schedule, cancellationReason, status } =
      appointment;

    let formattedSchedule: string | undefined;

    // ✅ Only validate and format schedule if type is "schedule"
    if (type === "schedule") {
      const dt = typeof schedule === "string" ? new Date(schedule) : schedule;
      if (!dt || isNaN(dt.getTime())) {
        throw new Error("Invalid schedule date");
      }
      formattedSchedule = dt.toISOString();
    }

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      {
        userId,
        primaryPhysician,
        status,
        cancellationReason: type === "cancel" ? cancellationReason : "",
        ...(formattedSchedule && { schedule: formattedSchedule }), // only update schedule if available
        patientName: patient?.name || "Unknown",
      }
    );

    if (!updatedAppointment) throw new Error("Failed to update appointment");

    // ✅ SMS Message Handling
    const smsMessage =
      type === "schedule" && formattedSchedule
        ? `Greetings from Medify. Your appointment is confirmed for ${
            formatDateTime(formattedSchedule, timeZone).dateTime
          } with Dr. ${primaryPhysician}`
        : `We regret to inform that your appointment has been cancelled. Reason: ${cancellationReason || "Not provided"}`;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error(
      "❌ An error occurred while updating the appointment:",
      error
    );
  }
};

// GET APPOINTMENT BY ID
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error("❌ Error retrieving appointment:", error);
  }
};
