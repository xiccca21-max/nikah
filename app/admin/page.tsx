"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { menuCourses } from "@/lib/invitation-data";

type GuestResponse = {
  id: string;
  name: string;
  course_1: string | null;
  course_2: string | null;
  course_3: string | null;
  responded_at: string | null;
  updated_at: string;
};

type GuestDraft = {
  course1: string;
  course2: string;
  course3: string;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [responses, setResponses] = useState<GuestResponse[]>([]);
  const [drafts, setDrafts] = useState<Record<string, GuestDraft>>({});
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    return url && key ? createClient(url, key) : null;
  }, []);

  const syncDrafts = (data: GuestResponse[]) => {
    const nextDrafts: Record<string, GuestDraft> = {};
    for (const guest of data) {
      nextDrafts[guest.id] = {
        course1: guest.course_1 ?? "",
        course2: guest.course_2 ?? "",
        course3: guest.course_3 ?? ""
      };
    }
    setDrafts(nextDrafts);
  };

  const loadResponses = async (accessToken: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/responses", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        cache: "no-store"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось загрузить ответы");
      }

      setResponses(data);
      syncDrafts(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadResponses(data.session.access_token);
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setError("");
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError || !data.session) {
      setError("Неверная почта или пароль");
      setIsLoading(false);
      return;
    }

    setSession(data.session);
    setPassword("");
    await loadResponses(data.session.access_token);
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setResponses([]);
    setDrafts({});
  };

  const filteredResponses = responses.filter((guest) =>
    guest.name.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))
  );
  const answeredCount = responses.filter((guest) => guest.responded_at).length;

  const updateDraft = (
    guestId: string,
    field: keyof GuestDraft,
    value: string
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [guestId]: {
        course1: prev[guestId]?.course1 ?? "",
        course2: prev[guestId]?.course2 ?? "",
        course3: prev[guestId]?.course3 ?? "",
        [field]: value
      }
    }));
    setSuccess("");
  };

  const exportCsv = () => {
    const escape = (value: string | null) =>
      `"${(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Имя", "Салат", "Суп", "Горячее", "Дата ответа"],
      ...responses.map((guest) => [
        guest.name,
        guest.responded_at ? guest.course_1 ?? "" : "",
        guest.responded_at ? guest.course_2 ?? "" : "",
        guest.responded_at ? guest.course_3 ?? "" : "",
        guest.responded_at
          ? new Date(guest.responded_at).toLocaleString("ru-RU")
          : ""
      ])
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escape).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `invitedi-answers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const saveGuestMenu = async (guestId: string) => {
    if (!session) return;

    const draft = drafts[guestId];
    if (!draft?.course1 || !draft?.course2 || !draft?.course3) {
      setError("Выберите салат, суп и горячее");
      return;
    }

    setSavingId(guestId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          guestId,
          course1: draft.course1,
          course2: draft.course2,
          course3: draft.course3
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось сохранить меню");
      }

      setSuccess("Меню сохранено");
      await loadResponses(session.access_token);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить меню");
    } finally {
      setSavingId(null);
    }
  };

  const annulGuest = async (guestId: string) => {
    if (!session) return;

    const ok = window.confirm("Аннулировать заказ для тестов? Статус снова станет 'Не отвечал'.");
    if (!ok) return;

    setSavingId(guestId);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ guestId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось аннулировать заказ");
      }

      setSuccess("Заказ аннулирован");
      await loadResponses(session.access_token);
    } catch (annulError) {
      setError(annulError instanceof Error ? annulError.message : "Не удалось аннулировать заказ");
    } finally {
      setSavingId(null);
    }
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-5 text-espresso">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[2rem] border border-champagne/30 bg-cream p-8 shadow-luxury"
        >
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-champagne">
            invitedi.ru
          </p>
          <h1 className="mb-8 text-center font-display text-3xl">Вход в админ-панель</h1>
          <label className="mb-5 block text-sm">
            <span className="mb-2 block text-espresso/60">Электронная почта</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-champagne/25 bg-white/70 px-4 py-3 outline-none focus:border-champagne"
            />
          </label>
          <label className="mb-6 block text-sm">
            <span className="mb-2 block text-espresso/60">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-champagne/25 bg-white/70 px-4 py-3 outline-none focus:border-champagne"
            />
          </label>
          {(error || !supabase) && (
            <p className="mb-4 text-center text-sm text-red-700">
              {error || "Supabase не подключён"}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading || !supabase}
            className="w-full rounded-full bg-espresso px-6 py-4 text-xs font-bold uppercase tracking-[0.25em] text-ivory disabled:opacity-60"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-8 text-espresso md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-champagne">
              invitedi.ru
            </p>
            <h1 className="font-display text-4xl">Ответы гостей</h1>
            <p className="mt-2 text-sm text-espresso/60">
              Ответили {answeredCount} из {responses.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => loadResponses(session.access_token)}
              className="rounded-full border border-champagne/40 px-5 py-3 text-xs font-bold uppercase tracking-wider"
            >
              Обновить
            </button>
            <button
              onClick={exportCsv}
              className="rounded-full bg-champagne px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Скачать CSV
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-espresso px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Выйти
            </button>
          </div>
        </header>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по имени"
          className="mb-5 w-full max-w-md rounded-xl border border-champagne/25 bg-white/70 px-4 py-3 outline-none focus:border-champagne"
        />

        {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{success}</p>}

        <div className="overflow-x-auto rounded-2xl border border-champagne/20 bg-white/65 shadow-soft">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-espresso text-ivory">
              <tr>
                <th className="px-5 py-4">Имя</th>
                <th className="px-5 py-4">Салат</th>
                <th className="px-5 py-4">Суп</th>
                <th className="px-5 py-4">Горячее</th>
                <th className="px-5 py-4">Ответ</th>
                <th className="px-5 py-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-espresso/50">
                    Загрузка...
                  </td>
                </tr>
              ) : (
                filteredResponses.map((guest) => {
                  const draft = drafts[guest.id] ?? {
                    course1: "",
                    course2: "",
                    course3: ""
                  };
                  const isBusy = savingId === guest.id;
                  const canSave = Boolean(draft.course1 && draft.course2 && draft.course3);

                  return (
                    <tr key={guest.id} className="border-t border-champagne/15 align-top">
                      <td className="px-5 py-4 font-semibold">{guest.name}</td>
                      <td className="px-5 py-4">
                        <select
                          value={draft.course1}
                          onChange={(event) => updateDraft(guest.id, "course1", event.target.value)}
                          className="w-full min-w-[180px] rounded-xl border border-champagne/25 bg-white px-3 py-2 outline-none focus:border-champagne"
                        >
                          <option value="">Не выбрано</option>
                          {menuCourses.course1.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={draft.course2}
                          onChange={(event) => updateDraft(guest.id, "course2", event.target.value)}
                          className="w-full min-w-[180px] rounded-xl border border-champagne/25 bg-white px-3 py-2 outline-none focus:border-champagne"
                        >
                          <option value="">Не выбрано</option>
                          {menuCourses.course2.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={draft.course3}
                          onChange={(event) => updateDraft(guest.id, "course3", event.target.value)}
                          className="w-full min-w-[180px] rounded-xl border border-champagne/25 bg-white px-3 py-2 outline-none focus:border-champagne"
                        >
                          <option value="">Не выбрано</option>
                          {menuCourses.course3.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        {guest.responded_at ? (
                          <span className="text-green-700">
                            {new Date(guest.responded_at).toLocaleString("ru-RU")}
                          </span>
                        ) : (
                          <span className="text-espresso/35">Не отвечал</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => saveGuestMenu(guest.id)}
                            disabled={!canSave || isBusy}
                            className="rounded-full bg-espresso px-4 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-40"
                          >
                            {isBusy ? "Сохранение..." : guest.responded_at ? "Изменить" : "Добавить"}
                          </button>
                          {guest.responded_at && (
                            <button
                              type="button"
                              onClick={() => annulGuest(guest.id)}
                              disabled={isBusy}
                              className="rounded-full border border-champagne/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-espresso transition-colors hover:bg-champagne/10 disabled:opacity-40"
                            >
                              Аннулировать
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
