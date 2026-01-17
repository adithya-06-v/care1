import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  recognizedText: string;
  pronunciationScore: number;
  feedbackMessage: string;
  mispronounced: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received speech analysis request');
    
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const expectedText = formData.get('expectedText') as string;

    if (!audioFile) {
      console.error('No audio file provided');
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!expectedText) {
      console.error('No expected text provided');
      return new Response(
        JSON.stringify({ error: 'No expected text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes`);
    console.log(`Expected text: "${expectedText}"`);

    // Read the audio file
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);
    
    console.log(`Audio buffer size: ${audioBytes.length} bytes`);

    // For now, we'll simulate speech analysis since we don't have a specific STT API configured
    // This can be replaced with actual STT API calls (Google Cloud Speech, Azure, etc.)
    const result = await simulateSpeechAnalysis(expectedText, audioBytes.length);

    console.log('Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing speech analysis:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze speech', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function simulateSpeechAnalysis(expectedText: string, audioSize: number): Promise<AnalysisResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate realistic analysis based on audio size and expected text
  const words = expectedText.split(/\s+/);
  const hasGoodRecording = audioSize > 5000; // Reasonable audio size check
  
  // Base score influenced by recording quality
  let baseScore = hasGoodRecording ? 70 + Math.random() * 25 : 50 + Math.random() * 30;
  
  // Adjust score based on text complexity
  const complexityFactor = Math.min(words.length / 10, 1);
  baseScore -= complexityFactor * 10;
  baseScore = Math.max(40, Math.min(98, baseScore));
  
  const score = Math.round(baseScore);

  // Simulate recognized text with minor variations for lower scores
  let recognizedText = expectedText;
  const mispronounced: string[] = [];
  
  if (score < 80) {
    // Introduce some "misrecognition" for lower scores
    const difficultSounds = ['th', 'r', 'l', 's', 'sh', 'ch', 'v', 'w'];
    words.forEach(word => {
      for (const sound of difficultSounds) {
        if (word.toLowerCase().includes(sound) && Math.random() > 0.6) {
          if (!mispronounced.includes(sound)) {
            mispronounced.push(sound);
          }
        }
      }
    });
    
    // Simulate slight text variations
    if (score < 60 && words.length > 3) {
      const skipIndex = Math.floor(Math.random() * words.length);
      recognizedText = words.filter((_, i) => i !== skipIndex).join(' ');
    }
  }

  // Generate feedback message based on score
  let feedbackMessage: string;
  if (score >= 90) {
    feedbackMessage = "Excellent pronunciation! Your speech was clear and accurate.";
  } else if (score >= 80) {
    feedbackMessage = "Great job! Minor improvements possible on a few sounds.";
  } else if (score >= 70) {
    feedbackMessage = "Good effort! Focus on speaking more slowly and clearly.";
  } else if (score >= 60) {
    feedbackMessage = "Keep practicing! Try to enunciate each syllable distinctly.";
  } else {
    feedbackMessage = "More practice needed. Try speaking slower and record in a quieter environment.";
  }

  if (mispronounced.length > 0) {
    feedbackMessage += ` Pay attention to: ${mispronounced.join(', ')} sounds.`;
  }

  return {
    recognizedText,
    pronunciationScore: score,
    feedbackMessage,
    mispronounced,
  };
}