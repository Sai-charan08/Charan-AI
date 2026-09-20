/**
 * Charan AI Fast Image Generator (Sub-2 Second Turbo Model)
 */

export function generateAIImageUrl(prompt: string, seed?: number): string {
  const cleanPrompt = encodeURIComponent(prompt.trim());
  const randomSeed = seed || Math.floor(Math.random() * 1000000);
  // Using Turbo model with enhance=false for instant sub-2 second generation
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=768&height=768&seed=${randomSeed}&nologo=true&model=turbo&enhance=false`;
}

export function isImageGenerationQuery(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('generate image') ||
    lower.includes('generate an image') ||
    lower.includes('create image') ||
    lower.includes('create an image') ||
    lower.includes('make image') ||
    lower.includes('make an image') ||
    lower.includes('draw') ||
    lower.includes('picture of') ||
    lower.includes('image of') ||
    lower.includes('photo of') ||
    lower.includes('illustration of') ||
    lower.includes('render image') ||
    lower.includes('generate artwork') ||
    lower.includes('design an image') ||
    lower.includes('visual recipe')
  );
}
