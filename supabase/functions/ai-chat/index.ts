
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

    // Try using a more reliable text generation model
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${systemPrompt}\n\nUser question: ${message}\n\nProvide helpful advice:`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      }),
    });

    console.log('Hugging Face API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);
      
      // Provide a personalized fallback response
      const fallbackResponse = `Hello ${profile?.name || 'there'}! I'm having some technical difficulties connecting to my AI service right now, but I'm still here to help based on your profile! 

I can see you're focused on ${profile?.focus_areas?.join(' and ') || 'health'}, which is fantastic! Your current ${streak?.current_streak || 0} day streak shows you're building great habits. Here are some personalized tips:

${profile?.focus_areas?.includes('health') ? '• Keep tracking your health metrics - consistency is key for long-term success\n• Try to maintain your current routine and gradually build upon it' : ''}
${profile?.focus_areas?.includes('finance') ? '• Focus on small, consistent saving habits\n• Track your expenses to identify areas for improvement' : ''}

What specific area would you like advice on today? I'm here to help with health, goals, finance, or general life guidance!`;

      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);
    
    // Extract the response text
    let aiResponse = '';
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      aiResponse = data[0].generated_text.trim();
    } else if (data.generated_text) {
      aiResponse = data.generated_text.trim();
    } else {
      // Provide a contextual fallback response
      aiResponse = `Hello ${profile?.name || 'there'}! Thanks for your message about "${message}". 

Based on your profile, I can see you're focused on ${profile?.focus_areas?.join(' and ') || 'personal development'} - that's wonderful! Your current streak of ${streak?.current_streak || 0} days shows you're building great habits.

Here's some advice: Stay consistent with your current routine, celebrate small wins, and remember that progress takes time. Your dedication to tracking your health data shows you're on the right path!

How can I help you further with your goals today?`;
    }

    // Clean up the response if it contains the system prompt
    if (aiResponse.includes('User question:')) {
      const parts = aiResponse.split('Provide helpful advice:');
      aiResponse = parts.length > 1 ? parts[1].trim() : aiResponse;
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    // Enhanced personalized fallback response
    const fallbackResponse = `Hi there! I'm experiencing some technical difficulties right now, but I'm still here to help you with your LifeOS journey!

Here are some personalized tips based on your profile:
- Keep building those healthy habits (your consistency is impressive!)
- Set small, achievable daily goals that align with your focus areas
- Track your progress regularly - you're already doing great with health data
- Remember to celebrate your wins, no matter how small

What specific area would you like advice on today - health, goals, finance, or something else? I'm here to help!`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
