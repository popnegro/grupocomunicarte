import React from "react";
import { FolderOpen, RefreshCw } from "lucide-react";
import { useToast } from "../ui/Toast";
import { useGooglePicker } from "../../hooks/useGooglePicker";

interface GooglePickerButtonProps {
  onSelect: (fileId: string, fileName?: string) => void;
  disabled?: boolean;
  className?: string;
  buttonText?: string;
  title?: string;
}

export const GooglePickerButton: React.FC<GooglePickerButtonProps> = ({
  onSelect,
  disabled = false,
  className = "",
  buttonText = "Seleccionar desde Drive",
  title,
}) => {
  const { toast } = useToast();

  const { openPicker, loading } = useGooglePicker({
    viewId: "PRESENTATIONS",
    mimeTypes: ["application/vnd.google-apps.presentation"],
    onSelect: (files) => {
      if (files.length > 0) {
        const file = files[0];
        onSelect(file.id, file.name);
        toast.success(`Presentación seleccionada: "${file.name}"`);
      }
    },
  });

  const handleOpenPicker = async () => {
    try {
      await openPicker();
    } catch (err: any) {
      toast.error(err.message || "No se pudo abrir el selector de Google Drive.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpenPicker}
      disabled={disabled || loading}
      title={title}
      className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
        disabled || loading
          ? "text-stone-300 cursor-not-allowed"
          : "text-[#06434a] hover:text-[#042a2f]"
      } ${className}`}
    >
      {loading ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" />
          Cargando...
        </>
      ) : (
        <>
          <FolderOpen className="h-3.5 w-3.5" />
          {buttonText}
        </>
      )}
    </button>
  );
};

