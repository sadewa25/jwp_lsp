"use client"

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Hitung Luas Lingkaran</h1>
          <p className="text-sm text-slate-600">Luas lingkaran = phi x r x r</p>
        </header>

        <div className="mt-10">
          <label className="block text-sm text-slate-500" htmlFor="r">
            R (Jari Jari)
          </label>
          <input
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
            >
              Kembali
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-44 items-center justify-center rounded-lg bg-slate-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Kirim
            </button>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold">Daftar Luas Lingkaran</h2>

          <div className="mt-4 overflow-x-auto">
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
                <tr>
                  <td className="py-4 text-sm text-slate-800">10</td>
                  <td className="py-4 text-center text-sm text-slate-800">314</td>
                  <td className="py-4 text-right text-sm text-slate-800">11-03-2026 09:56</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-slate-800">5</td>
                  <td className="py-4 text-center text-sm text-slate-800">78.5</td>
                  <td className="py-4 text-right text-sm text-slate-800">11-03-2026 09:56</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
