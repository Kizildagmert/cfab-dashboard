import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { PROFESSIONS } from "../services/data";
import { useDebounce } from "../hooks/useDebounce";
import { useUserStore } from "../store/userStore";
import type { User, UserRole } from "../types";
import {
  Search,
  Filter,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Shield,
} from "lucide-react";

export default function Dashboard() {
  const {
    users,
    page,
    size,
    total,
    sort,
    filters,
    loading,
    setPage,
    setSort,
    setFilters,
    fetchUsers,
    createUser,
  } = useUserStore();

  // Admin bilgisi localStorage'dan okunuyor
  const isAdmin = (() => {
    const userString = localStorage.getItem("user");
    if (!userString) return false;

    try {
      const user = JSON.parse(userString) as { role?: string };
      return user.role === "admin";
    } catch (error) {
      console.error("Kullanıcı verisi okuma/parse hatası:", error);
      localStorage.clear();
      return false;
    }
  })();

  // Arama inputu için local state + debounce
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Debounce sonrası store filtrelerini güncelle
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Meslek filtresi: store'da array olarak tutuluyor, UI tek seçim
  const selectedProfession = filters.professions[0] ?? "";

  const handleProfessionChange = (value: string) => {
    setFilters({
      professions: value ? [value] : [],
    });
  };

  // Listeyi her state değişiminde tekrar çek
  useEffect(() => {
    void fetchUsers();
  }, [page, size, sort, filters, fetchUsers]);

  const totalPages = useMemo(
    () => (total > 0 ? Math.ceil(total / size) : 1),
    [total, size]
  );

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const startIndex = total === 0 ? 0 : (page - 1) * size + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * size, total);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //localStorage.clear();
    window.location.href = "/login";
  };

  // Yeni kullanıcı form tipi + state
  type NewUserForm = {
    firstName: string;
    lastName: string;
    tckn: string;
    email: string;
    profession: string;
    role: UserRole;
    status: User["status"];
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    tckn: "",
    email: "",
    profession: "",
    role: "user",
    status: "active",
  });

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setNewUserForm({
      firstName: "",
      lastName: "",
      tckn: "",
      email: "",
      profession: "",
      role: "user",
      status: "active",
    });
  };

  const handleCreateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (field: keyof User) => {
    const isSame = sort.field === field;

    setSort({
      field,
      direction: isSame && sort.direction === "asc" ? "desc" : "asc",
    });

    setPage(1);
  };

  const handleCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !newUserForm.firstName.trim() ||
      !newUserForm.lastName.trim() ||
      !newUserForm.tckn.trim() ||
      !newUserForm.email.trim()
    ) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    await createUser(newUserForm);
    closeCreateModal();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      {/* ÜST MENÜ (Navbar) */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Shield size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            Crudfab<span className="text-blue-600">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@crudfab.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* BAŞLIK ALANI */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Kullanıcı Yönetimi
            </h2>
            <p className="text-gray-500 mt-1">
              Sistemdeki tüm kullanıcılar İsim, E-Posta ve TC ile filtrelenebilir.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <UserPlus size={18} />
              <span>Yeni Kullanıcı</span>
            </button>
          )}
        </div>

        {/* FİLTRE KARTI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Arama */}
          <div className="md:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="İsim, E-posta veya TC ile ara..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Meslek Seçimi */}
          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={selectedProfession}
              onChange={(e) => {
                handleProfessionChange(e.target.value);
                setPage(1);
              }}
              className="pl-10 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="">Tüm Meslek Grupları</option>
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLO ALANI */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            // LOADING DURUMU (Skeleton)
            <div className="p-8 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                      {/* Kullanıcı Bilgisi */}
                      <th className="p-4 pl-6">
                        <button
                          type="button"
                          onClick={() => handleSort("firstName")}
                          className="inline-flex items-center gap-1 hover:text-blue-600 transition"
                        >
                          <span>Kullanıcı Bilgisi</span>
                          {sort.field === "firstName" && (
                            <span className="text-[10px]">
                              {sort.direction === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>

                      {/* TC Kimlik / İletişim */}
                      <th className="p-4">
                        <button
                          type="button"
                          onClick={() => handleSort("tckn")}
                          className="inline-flex items-center gap-1 hover:text-blue-600 transition"
                        >
                          <span>TC Kimlik / İletişim</span>
                          {sort.field === "tckn" && (
                            <span className="text-[10px]">
                              {sort.direction === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>

                      {/* Meslek & Rol */}
                      <th className="p-4">
                        <button
                          type="button"
                          onClick={() => handleSort("profession")}
                          className="inline-flex items-center gap-1 hover:text-blue-600 transition"
                        >
                          <span>Meslek & Rol</span>
                          {sort.field === "profession" && (
                            <span className="text-[10px]">
                              {sort.direction === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>

                      {/* Durum ve İşlemler sabit */}
                      <th className="p-4">Durum</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {users.map((user: User) => (
                      <tr
                        key={user.id}
                        className="hover:bg-blue-50/30 group transition-colors duration-200"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold 
                              ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Kayıt: {user.createdAt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm text-gray-700">
                              {user.tckn}
                            </span>
                            <span className="text-xs text-gray-400">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {user.profession}
                            </span>
                            {user.role === "admin" && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                                <Shield size={12} /> Yönetici
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${
                              user.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.status === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            {user.status === "active" ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition">
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BOŞ VERİ DURUMU */}
              {users.length === 0 && (
                <div className="p-12 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-medium">
                    Sonuç Bulunamadı
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Aradığınız kişiye şu anda ulaşılamıyor lütfen daha sonra tekrar deneyiniz.
                  </p>
                </div>
              )}

              {/* PAGINATION */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500 hidden sm:block">
                  Toplam <b>{total}</b> kayıttan <b>{startIndex}</b> -{" "}
                  <b>{endIndex}</b> arası gösteriliyor
                </div>

                <div className="flex gap-2 mx-auto sm:mx-0">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} /> Önceki
                  </button>

                  <div className="flex items-center px-2">
                    <span className="text-sm font-medium text-gray-900">
                      {page}
                    </span>
                    <span className="text-sm text-gray-400 mx-1">/</span>
                    <span className="text-sm text-gray-500">{totalPages}</span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Sonraki <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* YENİ KULLANICI MODALI (Sadece admin) */}
      {isAdmin && isCreateOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Yeni Kullanıcı Ekle
              </h3>
              <button
                type="button"
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  name="firstName"
                  value={newUserForm.firstName}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  name="lastName"
                  value={newUserForm.lastName}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TC Kimlik
                </label>
                <input
                  name="tckn"
                  value={newUserForm.tckn}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  name="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meslek
                </label>
                <select
                  name="profession"
                  value={newUserForm.profession}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz</option>
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  value={newUserForm.role}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  name="status"
                  value={newUserForm.status}
                  onChange={handleCreateChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="active">Aktif</option>
                  <option value="passive">Pasif</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
