import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  // Muestra cómo se usan los subcomponentes
  subcomponents: { CardHeader, CardTitle, CardDescription, CardContent, CardFooter },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Crear Proyecto</CardTitle>
        <CardDescription>Implementa tu nuevo proyecto en un solo clic.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido principal de la tarjeta.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button>Implementar</Button>
      </CardFooter>
    </Card>
  ),
};