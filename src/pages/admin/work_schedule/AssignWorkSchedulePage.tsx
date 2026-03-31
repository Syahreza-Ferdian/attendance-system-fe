import PageHeader from "@/components/PageHeader";
import AssignWorkScheduleForm from "./AssignWorkScheduleForm";

export default function AssignWorkSchedulePage() {
  return (
    <>
      <PageHeader
        title="Assign Jadwal Kerja"
        subtitle="Pilih jadwal kerja dan assign ke satu atau lebih karyawan sekaligus."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Jadwal Kerja", href: "/hr/master-data/work-schedules" },
          { label: "Assign ke Karyawan" },
        ]}
      />
      <AssignWorkScheduleForm />
    </>
  );
}
