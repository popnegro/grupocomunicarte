import { z } from 'zod';
import { quoteStatusEnum } from '../db/schema';

export const quoteCreateSchema = z.object({
  leadId: z.string().uuid(),
  screenIds: z.array(z.string().uuid()).optional(),
  message: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const quoteUpdateSchema = z.object({
  status: z.enum(quoteStatusEnum.enumValues).optional(),
  quotedPrice: z.number().positive().optional(),
  adminComments: z.string().optional(),
  validUntil: z.coerce.date().optional(),
});