"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formulaLingkaran } from "../utils/utils";

type Row = {
  id: string;
  jarijari: string;
  hasil: string;
  tanggaljam: string;
};

export default function Page() {
  // navigation path
  const router = useRouter();
  // store the variable
  const [jarijari, setJarijari] = useState<number>();
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchRows(): Promise<Row[]> {
    try {
      const res = await fetch("/api/lingkaran", { cache: "no-store" });
      if (!res.ok) {
        console.error("Gagal mengambil data lingkaran");
        return [];
      }
      const data = await res.json();
      if (data && Array.isArray(data.rows)) {
        return data.rows as Row[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching lingkaran rows", error);
      return [];
    }
  }

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
    if (jarijari == undefined) {
      alert("Input jari-jari kosong, mohon periksa kembali");
      return;
    }

    try {
      setIsLoading(true);
      const hasil = formulaLingkaran({
        jariJari: jarijari,
      });
      const res = await fetch("/api/lingkaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jarijari, hasil }),
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

      alert("Berhasil menyimpan data luas lingkaran.");
      const updatedRows = await fetchRows();
      setRows(updatedRows);
      setJarijari(0);
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
          <h1 className="text-4xl font-semibold">Hitung Luas Lingkaran</h1>
          <p className="text-sm text-slate-600">Luas lingkaran = phi x r x r</p>
        </header>

        <div className="mt-10">
          <label className="block text-sm text-slate-500" htmlFor="r">
            R (Jari Jari)
          </label>
          <input
            value={jarijari?.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setJarijari(Number(e.target.value));
            }}
            id="r"
            name="r"
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
          <h2 className="text-xl font-semibold">Daftar Luas Lingkaran</h2>

          <div className="mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-3 text-left text-sm font-semibold text-slate-900">
                    R (Jari - Jari)
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
                      Belum ada data luas lingkaran.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4 text-sm text-slate-800">
                        {row.jarijari}
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
