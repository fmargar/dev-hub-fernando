import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image_file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "Archivo no válido o ausente." }, { status: 400 });
        }

        const apiKey = process.env.REMOVE_BG_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key de Remove.bg no configurada." }, { status: 500 });
        }

        const externalFormData = new FormData();
        externalFormData.append("image_file", file);
        externalFormData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": apiKey,
            },
            body: externalFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error from Remove.bg API:", errorText);
            return NextResponse.json({ error: "Fallo al procesar la imagen en Remove.bg" }, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();

        // Return the binary PNG image directly
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Ruta API Error:", error);
        return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
    }
}
