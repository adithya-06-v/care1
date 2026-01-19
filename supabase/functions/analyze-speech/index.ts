import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_URL = 'https://pink-weeks-hammer.loca.lt/analyze-speech';

interface ExternalApiResponse {
  recognizedText: string;
  pronunciationScore: number;
  feedbackMessage: string;
  improvementTip: string;
  mispronounced?: string[];
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

    // Create FormData to send to external API
    const externalFormData = new FormData();
    externalFormData.append('audio', audioFile, audioFile.name || 'recording.webm');
    externalFormData.append('expected_text', expectedText);

    console.log(`Calling external API: ${EXTERNAL_API_URL}`);

    // Call the external pronunciation API
    const externalResponse = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: externalFormData,
      headers: {
        'bypass-tunnel-reminder': 'true', // For localtunnel bypass
      },
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error(`External API error: ${externalResponse.status} - ${errorText}`);
      throw new Error(`External API returned ${externalResponse.status}: ${errorText}`);
    }

    const externalData: ExternalApiResponse = await externalResponse.json();
    console.log('External API response:', externalData);

    // Format response for frontend
    const result = {
      recognizedText: externalData.recognizedText || '',
      pronunciationScore: externalData.pronunciationScore || 0,
      feedbackMessage: externalData.feedbackMessage || '',
      improvementTip: externalData.improvementTip || '',
      mispronounced: externalData.mispronounced || [],
    };

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
