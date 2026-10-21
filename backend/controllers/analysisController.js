const BehaviorLog = require('../models/BehaviorLog');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in .env! AI analysis will fail.');
} else {
  console.log('Gemini API Key detected. Initializing Generative AI...');
}
const genAI = new GoogleGenerativeAI(apiKey);

// Helper to calculate level based on points
const calculateLevel = (points) => {
  return Math.floor(points / 50) + 1; // Level up every 50 points
};

// @desc    Analyze human behavior and store log
// @route   POST /api/analyze
// @access  Public (should be private in prod)
exports.analyzeBehavior = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      electricityUsage, waterUsage, wasteGeneration, travelDistance, travelMode, dietType,
      fuelUsage, liquidConsumption, vehicleType 
    } = req.body;

    if (electricityUsage === undefined || waterUsage === undefined) {
      return res.status(400).json({ error: 'Please provide all core behavior attributes' });
    }

    // Connect to Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Using a more stable model name

    const prompt = `
      You are an expert Environmental Impact Analyst and Personal Climate Coach.
      Analyze the following user behavior using a Multi-Factor Environmental Model. 
      Consider both core metrics and optional advanced metrics to calculate a highly accurate footprint.

      CORE METRICS:
      - Electricity Usage: ${electricityUsage} kWh
      - General Water Usage: ${waterUsage} Liters
      - Waste Generation: ${wasteGeneration} kg
      - Travel: ${travelDistance} km via ${travelMode}
      - Diet: ${dietType}

      OPTIONAL ADVANCED METRICS (Factor these heavily if provided):
      - Direct Fuel Usage: ${fuelUsage ? fuelUsage + ' Liters/Gallons' : 'Not provided'}
      - Specific Liquid Consumption: ${liquidConsumption || 'Not provided'} (Note: Bottled water & Sugary drinks have high impact, Tap water has low impact)
      - Vehicle Type: ${vehicleType || 'Not provided'} (Note: Electric significantly reduces travel impact, Hybrid reduces it moderately, Fuel increases it)

      TASK: Generate a comprehensive personal environmental analysis.
      1. footprintScore: A number from 1 (Best Case Scenario / Green / Excellent) to 100 (Worst Case Scenario / Disaster / Terrible) representing their eco-impact. Adjust this score dynamically based on the advanced metrics (e.g., if Vehicle Type is Electric, lower the score; if Liquid Consumption is Bottled Water, raise the score).
      2. keyFindings: An array of 3 specific bullet points highlighting harmful habits or positive lifestyle choices based on their exact input (reference the advanced metrics if they provided them).
      3. alternatives: An array of 3 personalized recommendations with { title, desc } to improve their habits.

      You MUST format your response as a valid RAW JSON object matching this exact schema:
      {
        "footprintScore": <number>,
        "keyFindings": ["finding 1", "finding 2", "finding 3"],
        "alternatives": [
          {"title": "Alternative 1", "desc": "description..."},
          {"title": "Alternative 2", "desc": "description..."},
          {"title": "Alternative 3", "desc": "description..."}
        ]
      }
    `;

    let textResponse;
    try {
      const result = await model.generateContent(prompt);
      textResponse = result.response.text();
      
      // Aggressive JSON Trapping to ignore Gemini Markdown wrapper
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        textResponse = jsonMatch[0];
      } else {
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      }
    } catch (apiError) {
      console.error('Gemini API Error:', apiError.message);
      console.log('Using fallback response due to AI API failure.');
      
      // Fallback dynamic response
      const fallbackScore = Math.min(100, Math.max(1, (Number(electricityUsage) / 10) + (Number(waterUsage) / 20) + (Number(wasteGeneration) * 2)));
      
      textResponse = JSON.stringify({
        footprintScore: Math.round(fallbackScore) || 50,
        keyFindings: [
          "AI Analysis degraded due to API limit - using fallback estimation.",
          `Electricity usage recorded at ${electricityUsage} kWh.`,
          `Water usage recorded at ${waterUsage} Liters.`
        ],
        alternatives: [
          { "title": "Energy Conservation", "desc": "Consider using energy-efficient appliances and turning off lights." },
          { "title": "Water Efficiency", "desc": "Fix any leaking taps and use water-saving fixtures." },
          { "title": "Waste Reduction", "desc": "Start a compost bin for organic waste and recycle." }
        ]
      });
    }

    let genData;
    try {
      genData = JSON.parse(textResponse);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response:', textResponse);
      return res.status(500).json({ error: 'Failed to process AI response' });
    }

    const analysisDetails = {
      keyFindings: genData.keyFindings,
      alternatives: genData.alternatives,
    };

    const newLog = await BehaviorLog.create({
      userId,
      electricityUsage: Number(electricityUsage),
      waterUsage: Number(waterUsage),
      wasteGeneration: Number(wasteGeneration),
      travelDistance: Number(travelDistance),
      travelMode,
      dietType,
      fuelUsage: fuelUsage ? Number(fuelUsage) : undefined,
      liquidConsumption: liquidConsumption || undefined,
      vehicleType: vehicleType || undefined,
      footprintScore: genData.footprintScore,
      analysisDetails: analysisDetails,
    });

    // Gamification Logic: Award user +10 points for analyzing
    const user = await User.findById(userId);
    if(user) {
      user.points += 10;
      user.level = calculateLevel(user.points);
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: newLog,
      pointsEarned: 10,
      newTotalPoints: user ? user.points : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server Error during analysis' });
  }
};

// @desc    Get all behavior histories for a user
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'Please provide a userId' });
    }

    const entries = await BehaviorLog.find({ userId, isHiddenForUser: false }).sort({ createdAt: -1 });
    console.log(`History requested: Found ${entries.length} entries for user ${userId}`);

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error retrieving history' });
  }
};

// @desc    Soft Delete my specific history entry (Hide from user, keep for admin)
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteMyEntry = async (req, res) => {
  try {
    const entry = await BehaviorLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isHiddenForUser: true },
      { returnDocument: 'after' }
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found or unauthorized' });
    }

    res.json({ message: 'History item hidden for user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error hiding history item' });
  }
};

// @desc    Clear all my history (Hide from user, keep for admin)
// @route   DELETE /api/history
// @access  Private
exports.clearMyHistory = async (req, res) => {
  try {
    await BehaviorLog.updateMany(
      { userId: req.user._id, isHiddenForUser: false },
      { isHiddenForUser: true }
    );
    res.json({ message: 'All personal history hidden' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error hiding personal history' });
  }
};
