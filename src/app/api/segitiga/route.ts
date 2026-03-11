import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Payload = {
  alas: number;
  tinggi: number;
};

const csvPath = path.join(process.cwd(), "public", "segitiga.csv");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;

    if (
      typeof body.alas !== "number" ||
      Number.isNaN(body.alas) ||
      typeof body.tinggi !== "number" ||
      Number.isNaN(body.tinggi)
    ) {
      return NextResponse.json(
        { message: "Invalid payload, alas and tinggi must be numbers." },
        { status: 400 },
      );
    }

    const alas = body.alas;
    const tinggi = body.tinggi;
    const hasil = 0.5 * alas * tinggi;

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

