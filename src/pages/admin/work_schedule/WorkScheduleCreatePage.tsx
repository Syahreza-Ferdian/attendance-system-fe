import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import WorkScheduleForm from "./WorkScheduleForm";

export default function WorkScheduleCreatePage() {
  const { workScheduleId } = useParams<{ workScheduleId: string }>();
  const isEditMode = !!workScheduleId;

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Jadwal Kerja" : "Tambah Jadwal Kerja"}
        subtitle={
          isEditMode
            ? "Perbarui informasi jadwal kerja."
            : "Buat jadwal kerja baru beserta hari dan jam kerjanya."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Jadwal Kerja", href: "/hr/master-data/work-schedules" },
          { label: isEditMode ? "Edit Jadwal" : "Jadwal Baru" },
        ]}
      />
      <WorkScheduleForm
        isEditMode={isEditMode}
        workScheduleId={workScheduleId}
      />
    </>
  );
}
