import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import DivisionCreateForm from "./DivisionCreateForm";

export default function DivisionCreatePage() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const isEditMode = !!divisionId;

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Divisi" : "Tambah Divisi"}
        subtitle={
          isEditMode
            ? "Perbarui data dan informasi divisi."
            : "Isi formulir di bawah untuk mendaftarkan divisi baru."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Divisi", href: "/hr/master-data/divisions" },
          { label: isEditMode ? "Edit Divisi" : "Tambah Divisi" },
        ]}
      />

      <DivisionCreateForm isEditMode={isEditMode} divisionId={divisionId} />
    </>
  );
}
