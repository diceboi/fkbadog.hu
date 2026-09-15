"use client";

import { createContext, useState } from "react";

export const AdminContext = createContext({
  activeMenu: "termekek",
  setActiveMenu: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  editingProduct: null,
  setEditingProduct: () => {},
});

export default function AdminContextProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState("termekek");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        editingProduct,
        setEditingProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
