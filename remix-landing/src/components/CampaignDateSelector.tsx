import { useState, useEffect, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, AlertCircle, Clock, RefreshCw, ArrowRight } from 'lucide-react';

export function CampaignDateSelector() {
  const { campaignStartDate, campaignEndDate, setCampaignDates } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(campaignStartDate || '');
  const [endDate, setEndDate] = useState<string>(campaignEndDate || '');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(!campaignStartDate || !campaignEndDate);

  useEffect(() => {
    if (campaignStartDate && campaignEndDate) {
      setStartDate(campaignStartDate);
      setEndDate(campaignEndDate);
    }
  }, [campaignStartDate, campaignEndDate]);

  const handleApplyDates = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!startDate) {
      setError('Por favor selecciona la fecha de inicio de la campaña.');
      return;
    }
    if (!endDate) {
      setError('Por favor selecciona la fecha de finalización de la campaña.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de finalización debe ser posterior o igual a la fecha de inicio.');
      return;
    }

    setCampaignDates(startDate, endDate);
    setIsEditing(false);
  };

  const calculateDays = () => {
    if (!campaignStartDate || !campaignEndDate) return 0;
    const start = new Date(campaignStartDate);
    const end = new Date(campaignEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const isValid = Boolean(campaignStartDate && campaignEndDate && !isEditing);

  return (
    <div className="bg-white border border-[#DCE4DF] rounded-2xl p-5 shadow-2xs space-y-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DCE4DF] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#E8F0E4] text-[#049A41] rounded-xl border border-[#049A41]/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#082028]">Período de Campaña Publicitaria</h2>
            <p className="text-xs text-[#40515A]">Define el rango de fechas para verificar disponibilidad y cotización.</p>
          </div>
        </div>

        {isValid && (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start md:self-auto px-3.5 py-1.5 bg-[#F7F9F7] hover:bg-[#E8F0E4] text-[#082028] border border-[#DCE4DF] text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#049A41]" />
            Cambiar período
          </button>
        )}
      </div>

      {isValid ? (
        <div className="bg-[#E8F0E4]/60 border border-[#049A41]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[#049A41] shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-extrabold text-[#049A41] tracking-wider block">
                Período Activo de Campaña
              </span>
              <p className="text-sm font-extrabold text-[#082028]">
                {formatDateDisplay(campaignStartDate!)} <span className="text-[#049A41] mx-1">→</span> {formatDateDisplay(campaignEndDate!)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-[#DCE4DF] text-xs font-extrabold text-[#082028]">
            <Clock className="w-3.5 h-3.5 text-[#049A41]" />
            <span>Duración: {calculateDays()} {calculateDays() === 1 ? 'día' : 'días'}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApplyDates} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <div className="lg:col-span-5 space-y-1">
              <label className="block text-[11px] font-extrabold text-[#082028]">
                Fecha de Inicio <span className="text-[#049A41]">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError(null);
                }}
                className="w-full px-3.5 py-2 bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#049A41] focus:bg-white rounded-xl text-xs font-extrabold text-[#082028] outline-none transition-all"
              />
            </div>

            <div className="lg:col-span-5 space-y-1">
              <label className="block text-[11px] font-extrabold text-[#082028]">
                Fecha de Finalización <span className="text-[#049A41]">*</span>
              </label>
              <input
                type="date"
                min={startDate || todayStr}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError(null);
                }}
                className="w-full px-3.5 py-2 bg-[#F7F9F7] border border-[#DCE4DF] focus:border-[#049A41] focus:bg-white rounded-xl text-xs font-extrabold text-[#082028] outline-none transition-all"
              />
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#049A41] hover:bg-[#038537] text-[#082028] text-xs font-extrabold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
              >
                <span>Definir Fechas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-extrabold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
