"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * On this page will show the some informations:
 * a. Dashboard ->
 *  1. Total Perhitungan 
 *  2. Nilai Maksimum dan Minimum
 *  3. Presentase total perhitungan
 * b. Button for each bangun datar
 */

export default function Home() {
  // for the navigation page
  const router = useRouter();
  const [totals, setTotals] = useState({
    segitiga: 0,
    persegi: 0,
    lingkaran: 0,
  });
  const [isLoadingTotals, setIsLoadingTotals] = useState(true);

  async function fetchTotal(url: string): Promise<number> {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return 0;
      const data = await res.json();
      if (!data || !Array.isArray(data.rows)) return 0;
      const total = data.rows.reduce((sum: number, row: { hasil?: unknown }) => {
        const n = Number((row as { hasil?: unknown }).hasil);
        return Number.isFinite(n) ? sum + n : sum;
      }, 0);
      // Keep only two digits after the decimal point
      return Number(total.toFixed(2));
    } catch {
      return 0;
    }
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const [segitiga, persegi, lingkaran] = await Promise.all([
        fetchTotal("/api/segitiga"),
        fetchTotal("/api/persegi"),
        fetchTotal("/api/lingkaran"),
      ]);

      if (isMounted) {
        setTotals({ segitiga, persegi, lingkaran });
        setIsLoadingTotals(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-14 pt-10 sm:px-10 sm:pt-14">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Selamat Datang di Hitung Bangun Datar
          </h1>
          <p className="mt-2 text-base text-zinc-600 sm:text-lg">
            Silahkan pilih bangun datar apa yang hendak dipilih
          </p>
        </header>

        <section className="mt-12 w-full space-y-5">
          <div className="rounded-3xl border border-zinc-300 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold">Total Perhitungan</h2>
            <div className="mt-5 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Segitiga</div>
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : totals.segitiga}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Persegi</div>
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : totals.persegi}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Lingkaran</div>
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : totals.lingkaran}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-300 px-6 py-5 sm:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-14">
              <div>
                <h2 className="text-lg font-semibold">Nilai Maksimum</h2>
                <div className="mt-5 grid grid-cols-1 gap-7 text-center sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Segitiga</div>
                    <div className="text-xl font-semibold">100</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Persegi</div>
                    <div className="text-xl font-semibold">78</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Lingkaran</div>
                    <div className="text-xl font-semibold">90</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Nilai Minimum</h2>
                <div className="mt-5 grid grid-cols-1 gap-7 text-center sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Segitiga</div>
                    <div className="text-xl font-semibold">100</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Persegi</div>
                    <div className="text-xl font-semibold">78</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Lingkaran</div>
                    <div className="text-xl font-semibold">90</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-300 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold">
              Presentase Total Perhitungan
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Segitiga</div>
                <div className="text-xl font-semibold">30%</div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Persegi</div>
                <div className="text-xl font-semibold">20%</div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Lingkaran</div>
                <div className="text-xl font-semibold">50%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 w-full">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <button
              type="button"
              className="h-32 rounded-2xl bg-zinc-700 text-lg font-medium text-zinc-100 shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
              onClick={() => router.push("/segitiga")}
            >
              Segitiga
            </button>
            <button
              type="button"
              className="h-32 rounded-2xl bg-zinc-700 text-lg font-medium text-zinc-100 shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
              onClick={() => router.push("/persegi")}
            >
              Persegi
            </button>
            <button
              type="button"
              className="h-32 rounded-2xl bg-zinc-700 text-lg font-medium text-zinc-100 shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
              onClick={() => router.push("/lingkaran")}
            >
              Lingkaran
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
