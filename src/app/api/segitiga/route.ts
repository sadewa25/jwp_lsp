import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Payload = {
  alas: number;
  tinggi: number;
  hasil: number;
};

const csvPath = path.join(process.cwd(), "public", "segitiga.csv");

export async function GET() {
  try {
    let content: string;
    try {
      content = await fs.readFile(csvPath, "utf8");
    } catch {
      // If file does not exist yet, initialize with header and return empty list
      content = "id,alas,tinggi,hasil,tanggaljam\n";
      await fs.writeFile(csvPath, content, "utf8");
    }

    const lines = content.trim().split("\n");
    const [header, ...rows] = lines;
    // sample: [ 'id', 'alas', 'tinggi', 'hasil', 'tanggaljam' ]
    const cols = header.split(",");

    /**
     * 
     data: [
        {
          id: '1',
          alas: '10',
          tinggi: '10',
          hasil: '50',
          tanggaljam: '11-03-2026 11:00'
        },
        {
          id: '2',
          alas: '20',
          tinggi: '10',
          hasil: '100',
          tanggaljam: '11-03-2026 11:02'
        },
        {
          id: '3',
          alas: '10',
          tinggi: '30',
          hasil: '150',
          tanggaljam: '11-03-2026 11:02'
        },
        {
          id: '4',
          alas: '10',
          tinggi: '30',
          hasil: '150',
          tanggaljam: '11-03-2026 11:03'
        }
      ]
     */

    const data = rows
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const parts = line.split(",");
        const item: Record<string, string> = {};
        cols.forEach((col, idx) => {
          item[col] = parts[idx] ?? "";
        });
        return item;
      });

    return NextResponse.json({ rows: data.reverse() }, { status: 200 });
  } catch (error) {
    console.error("Failed to read segitiga.csv", error);
    return NextResponse.json(
      { message: "Internal server error while reading CSV." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    // Validation numeric value
    if (
      typeof body.alas !== "number" ||
      Number.isNaN(body.alas) ||
      typeof body.tinggi !== "number" ||
      Number.isNaN(body.tinggi) ||
      typeof body.hasil !== "number" ||
      Number.isNaN(body.hasil)
    ) {
      return NextResponse.json(
        { message: "Invalid payload, alas and tinggi must be numbers." },
        { status: 400 },
      );
    }

    // formula for calculation
    const alas = body.alas;
    const tinggi = body.tinggi;
    const hasil = body.hasil;

    // sample: 2026-03-11T04:38:36.882Z
    const now = new Date();

    const pad = (n: number) => String(n).padStart(2, "0");
    const tanggal =
      `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Ensure file exists and read current lines for id
    let content: string;
    try {
      content = await fs.readFile(csvPath, "utf8");
    } catch {
      content = "id,alas,tinggi,hasil,tanggaljam\n";
      await fs.writeFile(csvPath, content, "utf8");
    }

    const lines = content.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    let nextId = 1;
    if (lines.length > 1 && lastLine) {
      const maybeId = Number(lastLine.split(",")[0]);
      if (!Number.isNaN(maybeId) && maybeId >= 1) {
        nextId = maybeId + 1;
      }
    }

    const newLine = `\n${nextId},${alas},${tinggi},${hasil},${tanggal}`;
    await fs.appendFile(csvPath, newLine, "utf8");

    return NextResponse.json(
      {
        id: nextId,
        alas,
        tinggi,
        hasil,
        tanggal,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to append to segitiga.csv", error);
    return NextResponse.json(
      { message: "Internal server error while writing CSV." },
      { status: 500 },
    );
  }
}
