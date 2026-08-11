"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Download, Settings, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Slider } from "@/components/ui/slider";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type VideoFormat = "mp4" | "webm";
type Resolution = "1080p" | "720p" | "480p" | "original";

export default function VideoCrunchPage() {
    const { t } = useI18n();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // FFmpeg state
    const ffmpegRef = useRef(new FFmpeg());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");

    // Settings
    const [format, setFormat] = useState<VideoFormat>("mp4");
    const [quality, setQuality] = useState<number>(28); // CRF value: lower is better quality (0-51)
    const [resolution, setResolution] = useState<Resolution>("720p");

    // Result
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [processedSize, setProcessedSize] = useState<number | null>(null);

    // Clean up Object URLs
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (processedUrl) URL.revokeObjectURL(processedUrl);
        };
    }, [previewUrl, processedUrl]);

    // Load FFmpeg on mount
    useEffect(() => {
        const loadFFmpeg = async () => {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });

            ffmpeg.on('progress', ({ progress, time }) => {
                setProgress(Math.round(progress * 100));
            });

            try {
                setStatusText(t.tools_content.videoCrunch.status.loading);
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
                setIsLoaded(true);
                setStatusText("");
            } catch (err) {
                console.error("Failed to load FFmpeg", err);
                setStatusText(t.common.error + ": FFmpeg");
            }
        };

        if (!isLoaded) {
            loadFFmpeg();
        }
    }, [isLoaded]);

    const handleFileSelect = (selectedFile: File | null) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (processedUrl) URL.revokeObjectURL(processedUrl);

        setFile(selectedFile);
        setProcessedUrl(null);
        setProcessedSize(null);
        setProgress(0);
        setStatusText("");

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(null);
        }
    };

    const getResolutionParams = () => {
        switch (resolution) {
            case "1080p": return ["-vf", "scale=-2:1080"];
            case "720p": return ["-vf", "scale=-2:720"];
            case "480p": return ["-vf", "scale=-2:480"];
            default: return [];
        }
    };

    const processVideo = async () => {
        if (!file || !isLoaded) return;

        setIsProcessing(true);
        setStatusText(t.tools_content.videoCrunch.status.starting);
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = `input.${file.name.split('.').pop()}`;
            const outputName = `output.${format}`;

            // Write the file to memory
            await ffmpeg.writeFile(inputName, await fetchFile(file));

            const commandParams = [
                '-i', inputName,
                '-c:v', format === 'mp4' ? 'libx264' : 'libvpx-vp9',
                '-preset', 'fast', // Faster compression
                '-crf', quality.toString(), // Quality constant
                ...getResolutionParams(),
                // Audio codec: AAC for MP4, libopus for WEBM
                '-c:a', format === 'mp4' ? 'aac' : 'libopus',
                outputName
            ];

            setStatusText(t.tools_content.videoCrunch.status.compressing);
            await ffmpeg.exec(commandParams);

            const data = await ffmpeg.readFile(outputName);
            // FFmpeg's readFile returns FileData (Uint8Array | string). 
            const blobData = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data as Uint8Array);
            const blob = new Blob([blobData], { type: `video/${format}` });

            if (processedUrl) URL.revokeObjectURL(processedUrl);
            setProcessedUrl(URL.createObjectURL(blob));
            setProcessedSize(blob.size);
            setStatusText(t.tools_content.videoCrunch.status.done);

        } catch (error) {
            console.error("Compression error:", error);
            setStatusText(t.common.error);
        } finally {
            setIsProcessing(false);
            setProgress(100);
        }
    };

    const handleDownload = () => {
        if (!processedUrl || !file) return;

        const originalName = file.name.split('.')[0];
        const newFilename = `${originalName}-crunched.${format}`;

        const a = document.createElement("a");
        a.href = processedUrl;
        a.download = newFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatFileSize = (bytes: number) => {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Video className="w-6 h-6 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{t.tools_content.videoCrunch.title}</h1>
                </div>
                <p className="text-muted-foreground">
                    {t.tools_content.videoCrunch.description}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload & Settings */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.tools_content.videoCrunch.originalVideo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileDropzone
                                onFileSelect={handleFileSelect}
                                selectedFile={file}
                                accept={{
                                    'video/*': ['.mp4', '.mov', '.avi', '.webm']
                                }}
                                acceptLabel={t.tools_content.videoCrunch.status.idle}
                            />
                        </CardContent>
                    </Card>

                    <Card className={!file ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="w-4 h-4" />
                                {t.tools_content.videoCrunch.compressionSettings}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Format Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.common.format}</label>
                                <Select value={format} onValueChange={(v: string | null) => { if (v) setFormat(v as VideoFormat) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.common.loading} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mp4">{t.tools_content.videoCrunch.formats.mp4}</SelectItem>
                                        <SelectItem value="webm">WebM (Optimizador Web)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Resolution Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t.tools_content.videoCrunch.resolution}</label>
                                <Select value={resolution} onValueChange={(v: string | null) => { if (v) setResolution(v as Resolution) }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.tools_content.videoCrunch.selectResolution} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="original">Original</SelectItem>
                                        <SelectItem value="1080p">1080p (FHD)</SelectItem>
                                        <SelectItem value="720p">720p (HD)</SelectItem>
                                        <SelectItem value="480p">480p (SD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Compression Slider (CRF) - Inverted specifically for UI friendliness */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">{t.tools_content.videoCrunch.compressionLevel}</label>
                                    <span className="text-sm text-muted-foreground text-right">
                                        {quality < 23 ? (t.locale === 'es' ? "Ligera" : t.locale === 'en' ? "Light" : "Leicht") : quality > 35 ? (t.locale === 'es' ? "Extrema" : t.locale === 'en' ? "Extreme" : "Extrem") : (t.locale === 'es' ? "Equilibrada" : t.locale === 'en' ? "Balanced" : "Ausgeglichen")}
                                    </span>
                                </div>
                                <Slider
                                    value={[51 - quality]} // Invert so sliding right means MORE compression (visually intuitive)
                                    onValueChange={(v: number | readonly number[]) => {
                                        const values = Array.isArray(v) ? v : (typeof v === 'number' ? [v] : []);
                                        if (values.length > 0) {
                                            // The slider goes 0-51 (right is more compression).
                                            // CRF goes 0-51 (higher is more compression).
                                            // quality state tracks CRF directly.
                                            setQuality(51 - values[0]);
                                        }
                                    }}
                                    min={0}
                                    max={51}
                                    step={1}
                                />
                            </div>

                            {/* Processing Progress */}
                            {(isProcessing || statusText) && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground border-t pt-4">
                                        <span>{statusText}</span>
                                        {isProcessing && <span>{progress}%</span>}
                                    </div>
                                    {isProcessing && (
                                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-orange-500 h-1.5 transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={processVideo}
                                disabled={!file || !isLoaded || isProcessing}
                            >
                                {!isLoaded ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : isProcessing ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Video className="w-4 h-4" />
                                )}
                                {!isLoaded ? t.tools_content.videoCrunch.status.loading : isProcessing ? t.tools_content.videoCrunch.status.compressing : t.tools_content.videoCrunch.status.start}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Preview & Result */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full min-h-[500px] flex flex-col overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between py-4 bg-muted/30 border-b">
                            <div>
                                <CardTitle className="text-lg">Resultado en Vivo</CardTitle>
                                {file && (
                                    <CardDescription>
                                        Original: {formatFileSize(file.size)}
                                        {processedSize && ` → Final: ${formatFileSize(processedSize)}`}
                                    </CardDescription>
                                )}
                            </div>

                            {processedUrl && (
                                <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    {t.common.download} {format.toUpperCase()}
                                </Button>
                            )}
                        </CardHeader>

                        <CardContent className="flex-1 flex items-center justify-center p-0 bg-black relative">
                            {!file ? (
                                <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center w-full h-full min-h-[400px]">
                                    <Video className="w-16 h-16 mb-4 opacity-20" />
                                    <p>{t.tools_content.videoCrunch.status.idle}</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
                                    {/* Video Player toggles depending if processed url exists */}
                                    <video
                                        src={processedUrl || previewUrl || ""}
                                        controls
                                        className="max-h-[500px] w-full"
                                        style={{ opacity: isProcessing ? 0.3 : 1 }}
                                    />

                                    {isProcessing && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                            <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                                            <p className="text-xl font-bold text-white mb-2">{progress}%</p>
                                            <p className="text-sm text-gray-300">{t.tools_content.videoCrunch.status.cpuWarning}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
