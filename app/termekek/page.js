import { notFound, redirect } from "next/navigation";
import { categories } from "@/data/categories";

export default function TermekekPage() {
  const first = categories[0];
  redirect(`/termekek/${first.slug}`);
}
