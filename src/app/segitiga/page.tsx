"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  alas: string;
  tinggi: string;
  hasil: string;
  tanggaljam: string;
};

export default function Segitiga() {
  const router = useRouter();
  const [alas, setAlas] = useState<number>();

  const [tinggi, setTinggi] = useState<number>();
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchRows(): Promise<Row[]> {
    try {
      const res = await fetch("/api/segitiga", { cache: "no-store" });
      if (!res.ok) {
        console.error("Gagal mengambil data segitiga");
        return [];
      }
      const data = await res.json();
      if (data && Array.isArray(data.rows)) {
        return data.rows as Row[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching segitiga rows", error);
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
    if (alas == undefined || tinggi == undefined) {
      alert("Terdapat inputan yang kosong, mohon periksa kembali");
      return;
    }
    try {
      setIsLoading(true);
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
        setIsLoading(false);
        return;
      }

      alert("Berhasil menyimpan data luas segitiga.");
      const updatedRows = await fetchRows();
      setRows(updatedRows);
      setAlas(0)
      setTinggi(0)
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal menyimpan ke CSV", error);
      alert("Terjadi kesalahan saat menyimpan data.");
      setIsLoading(false);
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
              disabled={isLoading}
              className="h-10 w-40 rounded-md bg-zinc-800 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onSubmitHandle}
            >
              {isLoading ? "Menyimpan..." : "Kirim"}
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
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="py-6 text-center text-zinc-500"
                      colSpan={4}
                    >
                      Belum ada data luas segitiga.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td className="py-4">{row.alas}</td>
                      <td className="py-4">{row.tinggi}</td>
                      <td className="py-4 text-center">{row.hasil}</td>
                      <td className="py-4 text-right">{row.tanggaljam}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
