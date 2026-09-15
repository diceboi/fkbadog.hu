import AdminContextProvider from "./AdminContext";
import AdminNav from "@/components/admin/AdminNav";
import AdminSideMenu from "@/components/admin/AdminSideMenu";

export const metadata = {
  title: "Adminisztrációs Felület – FK Bádog",
  description: "FK Bádog termék- és tartalomkezelő rendszer",
};

export default function AdminLayout({ children }) {
  return (
    <AdminContextProvider>
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans text-gray-900">
        <AdminNav />
        <div className="flex-1 flex flex-col md:flex-row">
          <AdminSideMenu />
          <main className="flex-1 flex flex-col overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AdminContextProvider>
  );
}
