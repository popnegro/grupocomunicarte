import type { Meta, StoryObj } from '@storybook/react';
import { Sparkles } from 'lucide-react';
import { Button } from './button';

// Metadatos del componente para Storybook
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  // Describe los argumentos (props) que el componente puede recibir
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    children: {
      control: 'text',
    },
  },
  // Define los argumentos por defecto
  args: {
    children: 'Botón',
    variant: 'default',
    size: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Define la historia principal (Default)
export const Default: Story = {
  args: {
    children: 'Botón Principal',
  },
};

// Define una historia para una variante específica
export const WithIcon: Story = {
  args: {
    children: ['Acción con Icono', <Sparkles key="icon" className="ml-2 h-4 w-4" />],
    size: 'lg',
  },
};