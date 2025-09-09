import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  // Handle missing appointment case
  if (!appointment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">Appointment not found.</p>
      </div>
    );
  }

  // Find doctor from constants (fallback to plain text if not found)
  const doctor =
    Doctors.find((doc) => doc.name === appointment.primaryPhysician) ?? null;

  // Format date/time once
  const formatted = formatDateTime(appointment.schedule);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-12 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details mt-6">
          <p className="font-semibold mb-2">Requested appointment details:</p>

          {/* Doctor name + photo */}
          <div className="flex items-center gap-3 mb-2">
            {doctor?.image && (
              <Image
                src={doctor.image}
                alt="doctor"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <p className="whitespace-nowrap text-lg font-medium">
              Dr. {doctor?.name || appointment.primaryPhysician}
            </p>
          </div>

          {/* Appointment date & time */}
        <div className="flex items-center gap-2">
     <Image
       src="/assets/icons/calendar.svg"
        height={24}
        width={24}
       alt="calendar"
       />
     <p className="text-base">
     {formatted.dateOnly} at {formatted.timeOnly}
     </p>
     </div>   
        </section>

        {/* Button to book another appointment */}
        <Button variant="outline" className="shad-primary-btn mt-6" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright mt-8 text-sm text-gray-500">© {new Date().getFullYear()} Medify
</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
