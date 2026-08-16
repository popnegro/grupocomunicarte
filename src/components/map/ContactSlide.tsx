import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea, Label } from '../ui/Input';

interface ContactSlideProps {
  itemName: string;
  onBack: () => void;
}

export function ContactSlide({ itemName, onBack }: ContactSlideProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center px-2 py-10 text-center" role="status" aria-live="polite">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-bold">Consulta enviada</h3>
        <p className="mb-8 max-w-xs text-sm text-gray-500">
          Recibimos tu consulta sobre <span className="font-medium text-gray-700">{itemName}</span>. Nuestro equipo comercial te va a contactar a la brevedad.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al detalle
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-2 rounded-lg px-1 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al detalle
      </button>

      <h3 className="mb-1 text-lg font-bold">Consultar disponibilidad</h3>
      <p className="mb-6 text-sm text-gray-500">
        Sobre <span className="font-medium text-gray-700">{itemName}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contact-name">Nombre</Label>
          <Input id="contact-name" name="name" required placeholder="Tu nombre" autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="contact-company">Empresa</Label>
          <Input id="contact-company" name="company" placeholder="Nombre de tu empresa (opcional)" autoComplete="organization" />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required placeholder="tu@empresa.com" autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="contact-phone">Teléfono</Label>
          <Input id="contact-phone" name="phone" type="tel" placeholder="Opcional" autoComplete="tel" />
        </div>
        <div>
          <Label htmlFor="contact-message">Mensaje</Label>
          <Textarea id="contact-message" name="message" rows={3} placeholder={`Quisiera consultar por ${itemName}...`} />
        </div>
        <Button type="submit" className="w-full">Enviar consulta</Button>
      </form>
    </div>
  );
}
