import { GoogleGenAI, Type } from "@google/genai";
import { DriverBehaviorData, DriverBehaviorResponse, OptimizedRouteResponse, PredictiveETAResponse, RouteSegment, DriverFeedbackResponse, LandmarkDirectionsResponse, HotspotSuggestionResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getRouteOptimization(route: RouteSegment[]): Promise<OptimizedRouteResponse> {
    const routeString = route.map(r => r.street).join(', ');
    const prompt = `Given the following Taxi route: ${routeString}. Suggest a more optimized route considering fuel efficiency and speed. Provide a brief reason for your suggestion. The start and end points must remain the same.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    optimizedRoute: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of street names for the optimized route."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief explanation for why this route is better."
                    }
                },
                required: ["optimizedRoute", "reason"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as OptimizedRouteResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for route optimization:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}

export async function getPredictiveEta(currentEta: number, progress: number): Promise<PredictiveETAResponse> {
    const prompt = `A Taxi is on its route. Current ETA is ${currentEta} minutes and the trip is ${progress.toFixed(0)}% complete. Consider potential live traffic (moderate congestion ahead) and historical data (this time of day is usually busy). Provide a new predictive ETA and list the factors considered.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    predictiveETA: {
                        type: Type.INTEGER,
                        description: "The new predicted ETA in minutes."
                    },
                    factors: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of factors considered for the new ETA."
                    }
                },
                required: ["predictiveETA", "factors"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as PredictiveETAResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for predictive ETA:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}

export async function getDriverBehaviorAnalysis(data: DriverBehaviorData): Promise<DriverBehaviorResponse> {
    const prompt = `Analyze the following driver behavior data for a single trip: Total idle time of ${Math.round(data.idleTime / 60)} minutes, ${data.harshBrakingEvents} harsh braking events, and ${data.frequentStops} stops. Provide a brief summary and 2-3 actionable suggestions for improvement.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: {
                        type: Type.STRING,
                        description: "A brief summary of the driver's behavior."
                    },
                    suggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Actionable suggestions for the driver."
                    }
                },
                required: ["summary", "suggestions"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        return parsedData as DriverBehaviorResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for driver behavior:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}

export async function getDriverFeedback(tripData: { stops: number; idleTime: number }): Promise<DriverFeedbackResponse> {
    const customerComments = [
        "The ride was very smooth and comfortable.",
        "Driver was friendly and played good music.",
        "A bit of a bumpy ride, and we arrived a little late.",
        "Efficient trip, got to my destination quickly.",
        "The driver seemed a bit distracted.",
    ];
    const randomComment = customerComments[Math.floor(Math.random() * customerComments.length)];

    const prompt = `
        Analyze a Taxi driver's performance based on the following data:
        - Trip Stops: ${tripData.stops}
        - Total Idle Time: ${Math.round(tripData.idleTime / 60)} minutes
        - A customer's comment: "${randomComment}"

        Based on this, provide a star rating from 1 to 5 (can be a decimal like 4.5) and a short, constructive feedback summary for the driver.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    rating: {
                        type: Type.NUMBER,
                        description: "A rating for the driver from 1 to 5. Can be a decimal."
                    },
                    feedback: {
                        type: Type.STRING,
                        description: "A short, constructive feedback summary for the driver."
                    }
                },
                required: ["rating", "feedback"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        if (data.rating < 1) data.rating = 1;
        if (data.rating > 5) data.rating = 5;
        return data as DriverFeedbackResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for driver feedback:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}

export async function getLandmarkDirections(currentSegment: RouteSegment, destination: string): Promise<LandmarkDirectionsResponse> {
    const prompt = `
        You are a helpful GPS assistant for a Taxi driver in a rural South African area where street names are not common.
        Provide simple, clear, turn-by-turn directions from the current street to the final destination.
        Crucially, you must reference the local landmarks provided.

        - Current Location: On **${currentSegment.street}**
        - Nearby Landmarks: **${currentSegment.landmarks?.join(', ') || 'None specified'}**
        - Final Destination: **${destination}**

        Generate a short list of directions. Be conversational and direct.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    directions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of turn-by-turn directions using landmarks."
                    }
                },
                required: ["directions"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as LandmarkDirectionsResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for landmark directions:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}

export async function getHotspotSuggestion(): Promise<HotspotSuggestionResponse> {
    const prompt = `A Taxi driver in a dense urban area is currently roaming for passengers. Based on general time-of-day patterns (it's mid-afternoon), suggest a type of location that is likely to be a "hotspot" for finding passengers. Provide the suggestion and a brief reason.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hotspot: {
                        type: Type.STRING,
                        description: "A suggested high-demand area or type of location (e.g., 'Shopping Mall', 'Train Station')."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief explanation for why this area is a good suggestion."
                    }
                },
                required: ["hotspot", "reason"]
            },
        },
    });
    
    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as HotspotSuggestionResponse;
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for hotspot suggestion:", response.text);
        throw new Error("Invalid response format from AI service.");
    }
}