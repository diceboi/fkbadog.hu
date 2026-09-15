import AdminHero from "@/components/admin/AdminHero";
import AdminProductList from "@/components/admin/AdminProductList";

export const metadata = {
  title: "Termékek kezelése – FK Bádog Admin",
};

export default function AdminTermekekPage() {
  return (
    <>
      <AdminHero
        customTitle="Termékek kezelése"
        customSubtitle="Közvetlen kapcsolat a Supabase products táblával: új termék felvitele, árak, bevonat árak és képfeltöltés."
      />
      <AdminProductList />
    </>
  );
}
