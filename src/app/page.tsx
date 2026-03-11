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
  // total on each bangun datar
  const [totals, setTotals] = useState({
    segitiga: 0,
    persegi: 0,
    lingkaran: 0,
  });
  const [isLoadingTotals, setIsLoadingTotals] = useState(true);
  // variable max values
  const [maxValues, setMaxValues] = useState({
    segitiga: 0,
    persegi: 0,
    lingkaran: 0,
  });
  // variable min values
  const [minValues, setMinValues] = useState({
    segitiga: 0,
    persegi: 0,
    lingkaran: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // fetch the information from the csv
  async function fetchTotal(url: string): Promise<number> {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return 0;
      /**
       * The output json
       * {
          "rows": [
              {
                  "id": "1",
                  "jarijari": "20",
                  "hasil": "1256",
                  "tanggaljam": "11-03-2026 11:16"
              },
              {
                  "id": "2",
                  "jarijari": "7",
                  "hasil": "153.86",
                  "tanggaljam": "11-03-2026 11:16"
              }
            ]
          }
       */
      const data = await res.json();
      if (!data || !Array.isArray(data.rows)) return 0;
      // looping and accumulate into one single value
      const total = data.rows.reduce(
        (sum: number, row: { hasil?: unknown }) => {
          const n = Number((row as { hasil?: unknown }).hasil);
          return Number.isFinite(n) ? sum + n : sum;
        },
        0,
      );
      // Keep only two digits after the decimal point
      return Number(total.toFixed(2));
    } catch {
      return 0;
    }
  }

  async function fetchMaxMin(
    url: string,
  ): Promise<{ max: number; min: number } | null> {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !Array.isArray(data.rows) || data.rows.length === 0) {
        return null;
      }

      let max = Number.NEGATIVE_INFINITY;
      let min = Number.POSITIVE_INFINITY;

      for (const row of data.rows as { hasil?: unknown }[]) {
        const n = Number(row.hasil);
        if (!Number.isFinite(n)) continue;
        if (n > max) max = n;
        if (n < min) min = n;
      }

      // Keep the value is numeric value
      if (!Number.isFinite(max) || !Number.isFinite(min)) {
        return null;
      }
      // match the value into two digits
      return {
        max: Number(max.toFixed(2)),
        min: Number(min.toFixed(2)),
      };
    } catch {
      return null;
    }
  }

  // Call when the browsers first load
  useEffect(() => {
    // prevent state updates after unmount
    let isMounted = true;

    (async () => {
      const [
        segitigaTotal,
        persegiTotal,
        lingkaranTotal,
        segitigaStats,
        persegiStats,
        lingkaranStats,
      ] = await Promise.all([
        fetchTotal("/api/segitiga"),
        fetchTotal("/api/persegi"),
        fetchTotal("/api/lingkaran"),
        fetchMaxMin("/api/segitiga"),
        fetchMaxMin("/api/persegi"),
        fetchMaxMin("/api/lingkaran"),
      ]);

      if (isMounted) {
        setTotals({
          segitiga: segitigaTotal,
          persegi: persegiTotal,
          lingkaran: lingkaranTotal,
        });
        setIsLoadingTotals(false);

        setMaxValues({
          segitiga: segitigaStats?.max ?? 0,
          persegi: persegiStats?.max ?? 0,
          lingkaran: lingkaranStats?.max ?? 0,
        });
        setMinValues({
          segitiga: segitigaStats?.min ?? 0,
          persegi: persegiStats?.min ?? 0,
          lingkaran: lingkaranStats?.min ?? 0,
        });
        setIsLoadingStats(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const grandTotal = totals.segitiga + totals.persegi + totals.lingkaran;
  const pctSegitiga =
    grandTotal > 0 ? ((totals.segitiga / grandTotal) * 100).toFixed(2) : "0";
  const pctPersegi =
    grandTotal > 0 ? ((totals.persegi / grandTotal) * 100).toFixed(2) : "0";
  const pctLingkaran =
    grandTotal > 0 ? ((totals.lingkaran / grandTotal) * 100).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-14 pt-10 sm:px-10 sm:pt-14">
        <header className="text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">
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
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : maxValues.segitiga}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Persegi</div>
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : maxValues.persegi}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Lingkaran</div>
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : maxValues.lingkaran}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Nilai Minimum</h2>
                <div className="mt-5 grid grid-cols-1 gap-7 text-center sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Segitiga</div>
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : minValues.segitiga}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Persegi</div>
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : minValues.persegi}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base text-zinc-800">Lingkaran</div>
                    <div className="text-xl font-semibold">
                      {isLoadingStats ? "-" : minValues.lingkaran}
                    </div>
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
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : `${pctSegitiga}%`}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Persegi</div>
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : `${pctPersegi}%`}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-base text-zinc-800">Lingkaran</div>
                <div className="text-xl font-semibold">
                  {isLoadingTotals ? "-" : `${pctLingkaran}%`}
                </div>
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
