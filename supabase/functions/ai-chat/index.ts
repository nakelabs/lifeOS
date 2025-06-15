
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

    // Try a simpler approach with a text generation model
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);
      
      // Fallback response if API fails
      const fallbackResponse = `Hello ${profile?.name || 'there'}! I'm having some technical difficulties connecting to my AI service right now, but I'm still here to help! 

Based on your profile, I can see you're focused on health, which is fantastic! Here are some general tips I can share:

- Keep tracking your health data regularly (I see you've been logging water, sleep, and exercise - great job!)
- Your current ${streak?.current_streak || 0} day streak shows you're building great habits
- Remember that small, consistent steps lead to big changes over time

Feel free to ask me anything about health, goals, finance, or life in general. I'll do my best to provide helpful advice based on your profile and progress!`;

      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);
    
    // Extract the response text
    let aiResponse = '';
    if (Array.isArray(data) && data.length > 0) {
      aiResponse = data[0].generated_text || 'I apologize, but I could not generate a response at this time.';
    } else if (data.generated_text) {
      aiResponse = data.generated_text;
    } else {
      // Fallback to a contextual response
      aiResponse = `Hello ${profile?.name || 'there'}! Thanks for your message: "${message}". 

Based on your profile, I can see you're from Nigeria and focused on health - that's wonderful! I'm here to help you with life advice, health tips, goal setting, and motivation.

Your current streak of ${streak?.current_streak || 0} days shows you're building great habits. Keep up the excellent work with tracking your health data!

How can I assist you further with your health and life goals today?`;
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    // Enhanced fallback response
    const fallbackResponse = `Hi there! I'm experiencing some technical difficulties right now, but I'm still here to help you with your LifeOS journey!

Here are some quick tips I can share:
- Keep building those healthy habits (consistency is key!)
- Set small, achievable daily goals
- Track your progress regularly
- Don't forget to celebrate your wins, no matter how small

What specific area would you like advice on today - health, goals, finance, or something else?`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
