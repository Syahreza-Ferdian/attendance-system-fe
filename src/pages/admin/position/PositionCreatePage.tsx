import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import PositionCreateForm from "./PositionCreateForm";

export default function PositionCreatePage() {
  const { positionId } = useParams<{ positionId: string }>();
  const isEditMode = !!positionId;

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Posisi" : "Tambah Posisi"}
        subtitle={
          isEditMode
            ? "Perbarui data dan informasi posisi."
            : "Isi formulir di bawah untuk mendaftarkan posisi baru."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Posisi", href: "/hr/master-data/positions" },
          { label: isEditMode ? "Edit Posisi" : "Tambah Posisi" },
        ]}
      />

      <PositionCreateForm isEditMode={isEditMode} positionId={positionId} />
    </>
  );
}
