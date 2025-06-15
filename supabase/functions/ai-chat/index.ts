
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, profile, streak, healthData } = await req.json();
    
    const huggingFaceApiKey = Deno.env.get('OPENAI_API_KEY'); // Using the same env var name for the HF key
    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Build context from user data
    let contextualInfo = '';
    if (profile) {
      contextualInfo += `User's name: ${profile.name}. `;
      if (profile.goals) contextualInfo += `Their goals: ${profile.goals}. `;
      if (profile.focus_areas?.length) contextualInfo += `Focus areas: ${profile.focus_areas.join(', ')}. `;
    }
    
    if (streak) {
      contextualInfo += `Current streak: ${streak.current_streak} days, longest streak: ${streak.longest_streak} days, total active days: ${streak.total_active_days}. `;
    }

    if (healthData?.length) {
      contextualInfo += `Recent health data entries: ${healthData.length} entries logged. `;
    }

    const systemPrompt = `You are a helpful LifeOS AI assistant designed to provide personalized life advice, motivation, and support. You help users with goal setting, health, finance, learning, emotional wellbeing, and general life guidance.

${contextualInfo ? `User context: ${contextualInfo}` : ''}

Guidelines:
- Be encouraging, supportive, and personal in your responses
- Reference the user's data when relevant (goals, streaks, focus areas)
- Provide actionable advice and specific suggestions
- Keep responses conversational but informative
- Acknowledge their progress and achievements when appropriate
- If they mention feeling unmotivated, provide encouraging support
- For health questions, give general wellness advice
- For financial questions, provide practical budgeting and saving tips
- For goal-setting, use SMART goal principles
- Keep responses to 2-3 paragraphs maximum`;

    // Format the prompt for Hugging Face API
    const formattedPrompt = `System: ${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          max_length: 300,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the response text
    let aiResponse = '';
    if (Array.isArray(data) && data.length > 0) {
      aiResponse = data[0].generated_text || 'I apologize, but I could not generate a response at this time.';
    } else if (data.generated_text) {
      aiResponse = data.generated_text;
    } else {
      aiResponse = 'I apologize, but I could not generate a response at this time. Please try again.';
    }

    // Clean up the response if it contains the original prompt
    if (aiResponse.includes('Assistant:')) {
      aiResponse = aiResponse.split('Assistant:').pop()?.trim() || aiResponse;
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
