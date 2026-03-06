"use client";

import React, { useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    acceptLabel?: string;
    className?: string;
}

// Utility para formatear bytes agregada inline por simplicidad, 
// o podemos moverla a lib/utils.tsx.
function formatFileSize(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FileDropzone({
    onFileSelect,
    selectedFile,
    acceptLabel = "Arrastra y suelta tu archivo aquí, o haz clic para seleccionar",
    className,
    ...dropzoneProps
}: FileDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        multiple: false,
        ...dropzoneProps,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
    };

    return (
        <div className={cn("w-full", className)}>
            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "group relative flex flex-col items-center justify-center w-full h-64 px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out",
                        isDragActive
                            ? "border-primary bg-primary/5"
                            : isDragReject
                                ? "border-destructive bg-destructive/5"
                                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    )}
                >
                    <input {...getInputProps()} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <UploadCloud
                                className={cn(
                                    "w-10 h-10 transition-colors",
                                    isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                {isDragActive
                                    ? "Suelta el archivo aquí..."
                                    : isDragReject
                                        ? "Tipo de archivo no soportado"
                                        : acceptLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                (Tamaño máximo: 50MB)
                            </p>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex items-center p-4 space-x-4 border rounded-xl bg-card"
                >
                    <div className="p-2 rounded-lg bg-primary/10">
                        <FileIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                        </p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-2 ml-4 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                        title="Quitar archivo"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
