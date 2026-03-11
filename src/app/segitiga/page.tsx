"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Segitiga() {
  const router = useRouter();
  const [alas, setAlas] = useState<number>();

  const [tinggi, setTinggi] = useState<number>();

  const onSubmitHandle = async () => {
    if (alas == undefined || tinggi == undefined) {
      alert("Terdapat inputan yang kosong, mohon periksa kembali");
      return;
    }
    try {
      const res = await fetch("/api/segitiga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alas, tinggi }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data && typeof data.message === "string"
            ? data.message
            : "Gagal menyimpan data ke CSV.";
        alert(message);
        return;
      }

      alert("Berhasil menyimpan data luas segitiga.");
    } catch (error) {
      console.error("Gagal menyimpan ke CSV", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14 sm:px-10">
        <header>
          <h1 className="text-4xl font-medium sm:text-5xl">
            Hitung Luas Segitiga
          </h1>
          <p className="mt-3 text-base text-zinc-700">
            Luas segitiga = 1/2 x alas x tinggi
          </p>
        </header>

        <section className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16">
            <fieldset className="rounded-lg border border-zinc-300 px-3 pb-2">
              <legend className="px-2 text-sm text-zinc-600">Alas</legend>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Silahkan masukkan alas"
                value={alas?.toString()}
                className="h-10 w-full bg-transparent px-2 text-base outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAlas(Number(e.target.value));
                }}
              />
            </fieldset>

            <fieldset className="rounded-lg border border-zinc-300 px-3 pb-2">
              <legend className="px-2 text-sm text-zinc-600">Tinggi</legend>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Silahkan masukkan tinggi"
                value={tinggi?.toString()}
                className="h-10 w-full bg-transparent px-2 text-base outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTinggi(Number(e.target.value));
                }}
              />
            </fieldset>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
            <button
              type="button"
              className="h-10 w-40 rounded-md bg-red-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              onClick={() => router.back()}
            >
              Kembali
            </button>
            <button
              type="button"
              className="h-10 w-40 rounded-md bg-zinc-800 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
              onClick={onSubmitHandle}
            >
              Kirim
            </button>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold">Daftar Luas Segitiga</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-500">
                  <th className="py-3 text-left text-base font-semibold">
                    Alas
                  </th>
                  <th className="py-3 text-left text-base font-semibold">
                    Tinggi
                  </th>
                  <th className="py-3 text-center text-base font-semibold">
                    Hasil
                  </th>
                  <th className="py-3 text-right text-base font-semibold">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="text-base text-zinc-800">
                <tr>
                  <td className="py-4">10</td>
                  <td className="py-4">10</td>
                  <td className="py-4 text-center">100</td>
                  <td className="py-4 text-right">11-03-2026 09:56</td>
                </tr>
                <tr>
                  <td className="py-4">10</td>
                  <td className="py-4">8</td>
                  <td className="py-4 text-center">80</td>
                  <td className="py-4 text-right">11-03-2026 09:56</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
