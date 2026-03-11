"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formulaPersegi } from "../utils/utils";

type Row = {
  id: string;
  sisi: string;
  hasil: string;
  tanggaljam: string;
};

export default function Persegi() {
  const router = useRouter();
  const [sisi, setSisi] = useState<number>();
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Call the endpoint GET for fetch the data from .csv
  async function fetchRows(): Promise<Row[]> {
    try {
      const res = await fetch("/api/persegi", { cache: "no-store" });
      if (!res.ok) {
        console.error("Gagal mengambil data persegi");
        return [];
      }
      const data = await res.json();
      if (data && Array.isArray(data.rows)) {
        return data.rows as Row[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching persegi rows", error);
      return [];
    }
  }

  // Call when page is load
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const result = await fetchRows();
      if (isMounted) {
        setRows(result);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmitHandle = async () => {
    if (sisi == undefined) {
      alert("Input sisi kosong, mohon periksa kembali");
      return;
    }

    try {
      setIsLoading(true);

      const hasil = formulaPersegi({
        sisi: sisi,
      });

      const res = await fetch("/api/persegi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sisi, hasil }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data && typeof data.message === "string"
            ? data.message
            : "Gagal menyimpan data ke CSV.";
        alert(message);
        setIsLoading(false);
        return;
      }

      alert("Berhasil menyimpan data luas persegi.");
      const updatedRows = await fetchRows();
      setRows(updatedRows);
      setSisi(0);
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal menyimpan ke CSV", error);
      alert("Terjadi kesalahan saat menyimpan data.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold">Hitung Luas Persegi</h1>
          <p className="text-sm text-slate-600">Luas persegi = sisi x sisi</p>
        </header>

        <div className="mt-10">
          <label className="block text-sm text-slate-500" htmlFor="sisi">
            Sisi
          </label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSisi(Number(e.target.value));
            }}
            value={sisi?.toString()}
            id="sisi"
            name="sisi"
            inputMode="decimal"
            placeholder=""
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              className="inline-flex h-11 w-44 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={() => router.back()}
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="inline-flex h-11 w-44 items-center justify-center rounded-lg bg-slate-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onSubmitHandle}
            >
              {isLoading ? "Menyimpan..." : "Kirim"}
            </button>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold">Daftar Luas Persegi</h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">
                    Sisi
                  </th>
                  <th className="py-3 text-center text-sm font-semibold text-slate-900">
                    Hasil
                  </th>
                  <th className="py-3 text-right text-sm font-semibold text-slate-900">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-slate-500" colSpan={3}>
                      Belum ada data luas persegi.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 text-sm text-slate-800">
                        {row.sisi}
                      </td>
                      <td className="py-4 text-center text-sm text-slate-800">
                        {row.hasil}
                      </td>
                      <td className="py-4 text-right text-sm text-slate-800">
                        {row.tanggaljam}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
