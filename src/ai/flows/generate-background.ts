// This file holds the Genkit flow for generating new backgrounds for images using AI.

'use server';

/**
 * @fileOverview Generates a new background for an image using AI.
 *
 * - generateBackground - A function that generates a new background for an image.
 * - GenerateBackgroundInput - The input type for the generateBackground function.
 * - GenerateBackgroundOutput - The return type for the generateBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'The photo to generate a background for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // lgtm[js/incomplete-url-sanitization]
    ),
  prompt: z.string().describe('A text prompt describing the desired background.'),
});
export type GenerateBackgroundInput = z.infer<typeof GenerateBackgroundInputSchema>;

const GenerateBackgroundOutputSchema = z.object({
  newBackgroundDataUri: z
    .string()
    .describe(
      'The new background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // lgtm[js/incomplete-url-sanitization]
    ),
});
export type GenerateBackgroundOutput = z.infer<typeof GenerateBackgroundOutputSchema>;

export async function generateBackground(input: GenerateBackgroundInput): Promise<GenerateBackgroundOutput> {
  return generateBackgroundFlow(input);
}

const generateBackgroundPrompt = ai.definePrompt({
  name: 'generateBackgroundPrompt',
  input: {schema: GenerateBackgroundInputSchema},
  output: {schema: GenerateBackgroundOutputSchema},
  prompt: `Generate a new background for the image based on the following prompt: {{{prompt}}}.

    Use the following image as the base:
    {{media url=photoDataUri}}
    `,
});

const generateBackgroundFlow = ai.defineFlow(
  {
    name: 'generateBackgroundFlow',
    inputSchema: GenerateBackgroundInputSchema,
    outputSchema: GenerateBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Generate a new background for the image based on the following prompt: ${input.prompt}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {newBackgroundDataUri: media.url!};
  }
);
