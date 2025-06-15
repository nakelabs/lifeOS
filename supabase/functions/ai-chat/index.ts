
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, profile, streak, healthData, financialData, learningData } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Build comprehensive context from all user data
    let contextualInfo = '';
    
    if (profile) {
      contextualInfo += `User Profile: Name: ${profile.name}`;
      if (profile.age) contextualInfo += `, Age: ${profile.age}`;
      if (profile.region) contextualInfo += `, Region: ${profile.region}`;
      if (profile.goals) contextualInfo += `, Goals: ${profile.goals}`;
      if (profile.focus_areas?.length) contextualInfo += `, Focus Areas: ${profile.focus_areas.join(', ')}`;
      contextualInfo += '. ';
    }
    
    if (streak) {
      contextualInfo += `Activity Streak: Current streak: ${streak.current_streak} days, longest streak: ${streak.longest_streak} days, total active days: ${streak.total_active_days}. `;
    }

    if (healthData?.length) {
      contextualInfo += `Health Data: ${healthData.length} recent entries including `;
      const healthTypes = [...new Set(healthData.map(h => h.type))];
      contextualInfo += `${healthTypes.join(', ')}. Recent values: `;
      healthData.slice(0, 3).forEach(entry => {
        contextualInfo += `${entry.type}: ${entry.value} ${entry.unit || ''} on ${new Date(entry.recorded_at).toDateString()}; `;
      });
    }

    if (financialData) {
      contextualInfo += `Financial Summary: Total Income: ${financialData.totalIncome}, Total Expenses: ${financialData.totalExpenses}, Net Worth: ${financialData.netWorth}. `;
      if (financialData.recentTransactions?.length) {
        contextualInfo += `Recent transactions: `;
        financialData.recentTransactions.slice(0, 3).forEach(tx => {
          contextualInfo += `${tx.type} of ${tx.amount} (${tx.category || 'uncategorized'}); `;
        });
      }
    }

    if (learningData) {
      contextualInfo += `Learning Progress: ${learningData.totalCourses} total courses, ${learningData.activeCourses} active, ${learningData.completedCourses} completed, ${learningData.averageProgress}% average progress. `;
      if (learningData.recentCourses?.length) {
        contextualInfo += `Recent courses: `;
        learningData.recentCourses.forEach(course => {
          contextualInfo += `"${course.title}" (${course.progress || 0}% complete, ${course.status}); `;
        });
      }
    }

    // Create enhanced system prompt for comprehensive LifeOS assistant
    const systemPrompt = `You are an advanced LifeOS AI assistant with comprehensive access to the user's personal data across health, finances, learning, and life goals. You provide highly personalized, data-driven advice and insights.

Key capabilities:
- Analyze patterns across health, finance, and learning data
- Provide actionable recommendations based on real user data
- Identify correlations between different life areas (e.g., stress vs spending, exercise vs productivity)
- Create personalized plans that consider the user's actual habits and progress
- Offer financial advice based on real spending patterns and income
- Suggest learning paths aligned with goals and current progress
- Provide health recommendations based on actual tracked metrics

${contextualInfo ? `Complete User Context: ${contextualInfo}` : ''}

Guidelines:
- Always reference specific data points when giving advice
- Identify trends and patterns in the user's data
- Provide actionable, specific recommendations
- Be encouraging about progress made and realistic about areas for improvement
- Connect insights across different life areas (health affecting finances, learning supporting goals, etc.)
- Use the user's actual data to personalize every response
- Be conversational, supportive, and insightful

Respond with comprehensive, personalized advice that demonstrates deep understanding of the user's complete life picture.`;

    // Use Gemini API with enhanced context
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      
      // Enhanced fallback response with comprehensive data understanding
      const fallbackResponse = generateComprehensiveFallback(message, profile, streak, healthData, financialData, learningData);
      
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    // Extract the response from Gemini
    let aiResponse = '';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      aiResponse = data.candidates[0].content.parts[0].text.trim();
    }

    // If response is empty or too short, use enhanced fallback
    if (!aiResponse || aiResponse.length < 20) {
      aiResponse = generateComprehensiveFallback(message, profile, streak, healthData, financialData, learningData);
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    // Enhanced error fallback with data awareness
    const fallbackResponse = `Hi there! I'm experiencing some technical difficulties, but I can still provide helpful insights based on your LifeOS data!

Based on your profile, here are some personalized recommendations:
- Your current ${streak?.current_streak || 0}-day streak shows great consistency - keep building on this momentum!
- Consider reviewing your recent patterns across health, finance, and learning for optimization opportunities
- Focus on connecting your daily habits to your larger goals for maximum impact

What specific area would you like personalized advice on today? I'm here to help with health optimization, financial planning, learning strategies, or goal achievement!`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateComprehensiveFallback(message: string, profile: any, streak: any, healthData: any, financialData: any, learningData: any): string {
  const userName = profile?.name || 'there';
  const currentStreak = streak?.current_streak || 0;
  const lowerMessage = message.toLowerCase();
  
  // Analyze user's comprehensive data for personalized insights
  let insights = [];
  
  if (healthData?.length > 0) {
    const recentHealthTypes = [...new Set(healthData.slice(0, 5).map((h: any) => h.type))];
    insights.push(`Your recent health tracking includes ${recentHealthTypes.join(', ')} - great job staying consistent!`);
  }
  
  if (financialData && (financialData.totalIncome > 0 || financialData.totalExpenses > 0)) {
    const netWorth = financialData.netWorth;
    insights.push(`Your financial position shows ${netWorth >= 0 ? 'positive' : 'needs attention with'} net worth of ${Math.abs(netWorth)}`);
  }
  
  if (learningData && learningData.totalCourses > 0) {
    insights.push(`You're actively learning with ${learningData.activeCourses} active courses out of ${learningData.totalCourses} total - ${learningData.averageProgress}% average progress!`);
  }

  if (lowerMessage.includes('overall') || lowerMessage.includes('analyze') || lowerMessage.includes('progress')) {
    return `Hi ${userName}! Based on your comprehensive LifeOS data, here's your holistic analysis:

📊 **Overall Progress Snapshot:**
- Activity Streak: ${currentStreak} days (fantastic consistency!)
${insights.join('\n- ')}

🎯 **Key Recommendations:**
- Your ${currentStreak}-day streak shows you're building great habits - leverage this momentum across all areas
- Consider connecting your health patterns with your financial and learning goals for synergistic growth
- Focus on the intersection points where your different life areas can support each other

💡 **Personalized Insights:**
Based on your data patterns, you're showing strong commitment to self-improvement. The key is maintaining this consistency while optimizing the connections between your health, financial, and learning activities.

What specific area would you like me to dive deeper into?`;
  }
  
  if (lowerMessage.includes('health')) {
    const healthInsight = healthData?.length > 0 ? 
      `Based on your ${healthData.length} recent health entries, you're actively tracking your wellness - that's excellent!` :
      "Let's start building some health tracking habits to optimize your wellness journey.";
    
    return `Hello ${userName}! ${healthInsight}

🏃‍♂️ **Health Optimization Tips:**
- Your ${currentStreak}-day activity streak shows great discipline
- Consider correlating your health metrics with your energy levels for learning and work
- Track how your health habits impact your financial stress and decision-making

What specific health area would you like personalized advice on?`;
  }
  
  if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('budget')) {
    const financialInsight = financialData && financialData.totalIncome > 0 ? 
      `Your financial tracking shows ${financialData.recentTransactions?.length || 0} recent transactions - good record keeping!` :
      "Building financial awareness through consistent tracking will accelerate your wealth journey.";
    
    return `Hi ${userName}! ${financialInsight}

💰 **Financial Strategy Based on Your Data:**
- Leverage your ${currentStreak}-day consistency streak for financial habit building
- Consider how your learning investments are supporting your income potential
- Monitor how your health affects your productivity and earning capacity

Would you like specific budgeting advice based on your spending patterns?`;
  }
  
  // Default comprehensive response
  return `Hello ${userName}! I have access to your complete LifeOS profile and I'm here to provide personalized insights across all areas of your life.

🌟 **Your Current Status:**
- Maintaining a ${currentStreak}-day activity streak (impressive dedication!)
- ${insights.length > 0 ? insights.join('\n- ') : 'Ready to start tracking comprehensive life data'}

🚀 **What I Can Help With:**
- Comprehensive life analysis using your actual data
- Personalized health, finance, and learning recommendations
- Goal optimization based on your patterns and progress
- Connecting insights across different life areas

What specific area would you like me to analyze and provide personalized advice on today?`;
}
