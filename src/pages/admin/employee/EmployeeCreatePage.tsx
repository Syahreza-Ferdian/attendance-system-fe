import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import EmployeeCreateForm from "./EmployeeCreateForm";

export default function EmployeeCreatePage() {
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = !!userId;

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Karyawan" : "Tambah Karyawan"}
        subtitle={
          isEditMode
            ? "Perbarui data dan informasi akun karyawan."
            : "Isi formulir di bawah untuk mendaftarkan karyawan baru."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Karyawan", href: "/hr/master-data/employees" },
          { label: isEditMode ? "Edit Karyawan" : "Tambah Karyawan" },
        ]}
      />

      <EmployeeCreateForm isEditMode={isEditMode} userId={userId} />
    </>
  );
}
