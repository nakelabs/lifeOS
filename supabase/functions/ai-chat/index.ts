
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
    
    const huggingFaceApiKey = Deno.env.get('OPENAI_API_KEY');
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

    // Try using Hugging Face's text generation API with a different model
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-small', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `You are a helpful LifeOS AI assistant. ${contextualInfo ? `Context: ${contextualInfo}` : ''} User asks: ${message}`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: 50256
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
      
      // Provide a comprehensive personalized fallback response
      const fallbackResponse = generatePersonalizedResponse(message, profile, streak);
      
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);
    
    // Extract and clean the response
    let aiResponse = '';
    if (Array.isArray(data) && data.length > 0) {
      if (data[0].generated_text) {
        aiResponse = data[0].generated_text.trim();
        // Remove the input prompt from the response if it's included
        aiResponse = aiResponse.replace(`You are a helpful LifeOS AI assistant. ${contextualInfo ? `Context: ${contextualInfo}` : ''} User asks: ${message}`, '').trim();
      }
    }

    // If response is empty or too short, use fallback
    if (!aiResponse || aiResponse.length < 10) {
      aiResponse = generatePersonalizedResponse(message, profile, streak);
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

function generatePersonalizedResponse(message: string, profile: any, streak: any): string {
  const userName = profile?.name || 'there';
  const focusAreas = profile?.focus_areas?.join(' and ') || 'personal development';
  const currentStreak = streak?.current_streak || 0;
  
  // Generate contextual responses based on message content
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('unmotivated') || lowerMessage.includes('motivation')) {
    return `Hi ${userName}! I understand you're feeling unmotivated right now. Remember, you've already built a ${currentStreak} day streak - that shows incredible dedication! 

Your focus on ${focusAreas} is admirable. Here's what I suggest:
• Start with one small task today - even 5 minutes counts
• Review your recent progress to see how far you've come
• Remember your "why" - what drives your goals?
• Take a short break if needed - rest is part of growth

You've got this! What's one small step you can take right now?`;
  }
  
  if (lowerMessage.includes('health') || lowerMessage.includes('fitness')) {
    return `Great question about health, ${userName}! Based on your focus on ${focusAreas} and your ${currentStreak} day streak, you're already on a fantastic path.

Here are some health tips tailored for you:
• Consistency beats perfection - keep logging your health data
• Focus on one health habit at a time to avoid overwhelm
• Celebrate small wins like your current streak
• Stay hydrated and get adequate sleep for better results

What specific health area would you like to improve today?`;
  }
  
  if (lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('save')) {
    return `Hi ${userName}! Financial wellness is such an important part of overall life satisfaction. With your dedication (shown by your ${currentStreak} day streak), you can definitely build strong financial habits too!

Here are some practical tips:
• Start with tracking expenses for one week
• Set up automatic savings - even $5/week helps
• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
• Build an emergency fund gradually

What's your biggest financial challenge right now?`;
  }
  
  // Default personalized response
  return `Hello ${userName}! Thanks for your message about "${message}". 

Based on your profile, I can see you're focused on ${focusAreas} - that's wonderful! Your current streak of ${currentStreak} days shows you're building great habits consistently.

Here's some general advice:
• Keep up the momentum you've already built
• Break big goals into smaller, manageable steps
• Track your progress regularly (you're already doing great!)
• Remember that small daily actions lead to big results

How can I help you further with your ${focusAreas} goals today?`;
}
