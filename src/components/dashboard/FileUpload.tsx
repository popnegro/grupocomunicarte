import React, { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase-storage";
import { Upload, File, CheckCircle2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  folderPath?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  folderPath = "soportes",
  accept = "image/*,video/*",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    setProgress(0);

    const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err: any) => {
        console.error("Upload error:", err);
        if (err?.code === "storage/unauthorized") {
          setError("No tienes permiso para subir archivos. Por favor inicia sesión.");
        } else {
          setError("Error al subir el archivo. Inténtalo de nuevo.");
        }
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedUrl(downloadUrl);
          onUploadSuccess(downloadUrl);
          setIsUploading(false);
        } catch (urlErr) {
          setError("Error al obtener la URL de descarga.");
          setIsUploading(false);
        }
      }
    );
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? "border-[#06434a] bg-[#06434a]/5"
            : "border-stone-250 hover:border-[#06434a]/40 bg-stone-50/50 hover:bg-stone-50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept={accept}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2 w-full max-w-[200px] mx-auto">
            <Upload className="h-6 w-6 text-[#06434a] animate-bounce mx-auto" />
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Subiendo: {progress}%</div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#06434a] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : uploadedUrl ? (
          <div className="space-y-1">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">¡Subida Exitosa!</span>
            <span className="block text-[9px] text-stone-400 font-mono truncate max-w-[200px] mx-auto">{uploadedUrl}</span>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="h-6 w-6 text-stone-400 mx-auto group-hover:text-[#06434a] transition-colors" />
            <span className="block text-[11px] font-bold text-stone-700">Arrastra tu archivo aquí o haz clic</span>
            <span className="block text-[9px] text-stone-400">Soporta imágenes, videos de Drone o fichas técnicas</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-semibold bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
