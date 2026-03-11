import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Payload = {
  sisi: number;
};

const csvPath = path.join(process.cwd(), "public", "persegi.csv");

export async function GET() {
  try {
    let content: string;
    try {
      content = await fs.readFile(csvPath, "utf8");
    } catch {
      content = "id,sisi,hasil,tanggaljam\n";
      await fs.writeFile(csvPath, content, "utf8");
    }

    const lines = content.trim().split("\n");
    const [header, ...rows] = lines;
    const cols = header.split(",");

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

    return NextResponse.json({ rows: data }, { status: 200 });
  } catch (error) {
    console.error("Failed to read persegi.csv", error);
    return NextResponse.json(
      { message: "Internal server error while reading CSV." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;

    if (typeof body.sisi !== "number" || Number.isNaN(body.sisi)) {
      return NextResponse.json(
        { message: "Invalid payload, sisi must be a number." },
        { status: 400 },
      );
    }

    const sisi = body.sisi;
    const hasil = sisi * sisi;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const tanggal =
      `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let content: string;
    try {
      content = await fs.readFile(csvPath, "utf8");
    } catch {
      content = "id,sisi,hasil,tanggaljam\n";
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

    const newLine = `\n${nextId},${sisi},${hasil},${tanggal}`;
    await fs.appendFile(csvPath, newLine, "utf8");

    return NextResponse.json(
      {
        id: nextId,
        sisi,
        hasil,
        tanggal,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to append to persegi.csv", error);
    return NextResponse.json(
      { message: "Internal server error while writing CSV." },
      { status: 500 },
    );
  }
}

