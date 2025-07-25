'use server';

/**
 * @fileOverview Enhances an image using AI.
 *
 * - enhanceImage - A function that enhances an image.
 * - EnhanceImageInput - The input type for the enhanceImage function.
 * - EnhanceImageOutput - The return type for the enhanceImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The photo to enhance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceImageInput = z.infer<typeof EnhanceImageInputSchema>;

const EnhanceImageOutputSchema = z.object({
  enhancedImageDataUri: z
    .string()
    .describe(
      'The enhanced image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type EnhanceImageOutput = z.infer<typeof EnhanceImageOutputSchema>;

export async function enhanceImage(input: EnhanceImageInput): Promise<EnhanceImageOutput> {
  return enhanceImageFlow(input);
}

const enhanceImageFlow = ai.defineFlow(
  {
    name: 'enhanceImageFlow',
    inputSchema: EnhanceImageInputSchema,
    outputSchema: EnhanceImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: 'Automatically enhance the lighting, color, and sharpness of this image. Do not crop or otherwise transform the image.'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {enhancedImageDataUri: media.url!};
  }
);
