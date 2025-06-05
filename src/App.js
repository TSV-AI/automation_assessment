import React, { useState, useEffect, useCallback } from 'react'; 
import { ChevronRight, Clock, TrendingUp, CheckCircle, Zap, Eye, Download, Mail, ArrowDownCircle, X as XIcon, Sparkles, Loader2, Building, Briefcase, HelpCircle, Cpu, Lightbulb, Shuffle } from 'lucide-react'; // Added Cpu, Lightbulb, Shuffle

// --- Color Palette (retained for UI consistency) ---
const pageBgColor = '#0a0a0a';
const textColorPrimary = '#efefea';       
const textColorSecondary = '#c8c8c4';   
const textColorMuted = '#a1a19b';       
const textColorVeryMuted = '#6B7280'; 
const accentColor = '#92d8c8'; 
const accentColorDarker = '#6BAA9B'; 
const popupBorderColorWithOpacity = '#0e9f7bBF'; 
const brighterMainCtaColor = '#4DCFB9'; 
const popupCtaTextColor = '#0A0A0A'; 
const accentColorBgLowOpacity = accentColor + '1A'; 
const accentColorBgMediumOpacity = accentColor + '26'; 
const accentColorBorderLowOpacity = accentColor + '33'; 
const generalPopupContentBg = 'rgba(20, 25, 35, 0.70)'; 
const calendlyPopupOuterBg = '#040404';

// --- Funny Loading Messages ---
const funnyLoadingMessages = [
  { text: "Summoning the AI gnomes to tailor your questions...", icon: <Sparkles className="w-8 h-8 mr-3 text-yellow-400" /> },
  { text: "Our digital hamsters are running as fast as they can!", icon: <Shuffle className="w-8 h-8 mr-3 text-purple-400 animate-pulse" /> },
  { text: "Brewing a fresh batch of personalized insights...", icon: <Lightbulb className="w-8 h-8 mr-3 text-green-400" /> },
  { text: "Don't worry, we haven't forgotten about you... just teaching the AI some manners.", icon: <Clock className="w-8 h-8 mr-3 text-blue-400" /> },
  { text: "Analyzing your info with our team of tiny AI helpers...", icon: <Cpu className="w-8 h-8 mr-3 text-teal-400 animate-bounce" /> }
];

// --- Initial Loading Messages ---
const initialLoadingMessages = [
  { text: "Initializing automation analysis engine...", icon: <Cpu className="w-6 h-6 mr-3 text-blue-400" /> },
  { text: "Calibrating efficiency algorithms...", icon: <Zap className="w-6 h-6 mr-3 text-yellow-400" /> },
  { text: "Loading business intelligence modules...", icon: <TrendingUp className="w-6 h-6 mr-3 text-green-400" /> },
  { text: "Preparing personalized recommendations...", icon: <Lightbulb className="w-6 h-6 mr-3 text-purple-400" /> }
];


// --- Initial Questions Setup ---
const industries = [
  "Retail & E-commerce", "Healthcare", "Manufacturing", "Real Estate", "Financial Services", 
  "Technology (Software/SaaS)", "Professional Services (Consulting, Legal, Accounting)", 
  "Hospitality & Tourism", "Education", "Construction", "Marketing & Advertising", 
  "Logistics & Transportation", "Non-Profit", "Other"
];

// Base questions structure - AI will attempt to modify titles, subtitles, and options
const baseQuestions = [
  {
    id: 'company_scale_generic', 
    title: 'What is the operational scale of [Business Name,fallback=your company]?', 
    subtitle: 'Understanding your size helps us tailor complexity assessments.', 
    type: 'select',
    options: [ 
      { value: 'small_scale', label: 'Small Scale / Low Volume' },
      { value: 'medium_scale', label: 'Medium Scale / Moderate Volume' },
      { value: 'large_scale', label: 'Large Scale / High Volume' },
      { value: 'very_large_scale', label: 'Very Large Scale / Very High Volume' }
    ],
    customizableOptions: true, 
    customizableQuestion: true, 
  },
  {
    id: 'manual_hours',
    title: 'Approximately how many total hours per week does [Business Name,fallback=your company] spend on repetitive manual tasks?',
    subtitle: 'Think company-wide: data entry, reporting, follow-ups, scheduling, content creation, etc.',
    type: 'select',
    options: [ 
      { value: '10_25', label: '10-25 hours per week', hours: 17.5, avgWageModifier: 1.0 },
      { value: '26_50', label: '26-50 hours per week', hours: 38, avgWageModifier: 1.1 },
      { value: '51_100', label: '51-100 hours per week', hours: 75, avgWageModifier: 1.2 },
      { value: '100_plus', label: '100+ hours per week', hours: 125, avgWageModifier: 1.3 }
    ],
    customizableOptions: true, 
    customizableQuestion: false, 
    contextualHelp: { 
      'Healthcare': "For Healthcare, this might include time spent on patient record updates, insurance claim processing, or appointment scheduling.",
      'Manufacturing': "In Manufacturing, consider time on order processing, supply chain coordination, or quality control documentation."
    }
  },
  {
    id: 'biggest_pain_generic', 
    title: 'What is the biggest operational bottleneck or primary pain point for [Business Name,fallback=your business] right now?', 
    subtitle: 'Choose the area causing the most delays or frustration. AI will refine these options for your industry.', 
    type: 'select',
    options: [ 
      { value: 'data_handling', label: 'Data entry and information management', automationPotential: 0.7 },
      { value: 'customer_interactions', label: 'Customer communication and follow-up', automationPotential: 0.6 },
      { value: 'content_marketing_ops', label: 'Content creation and marketing operations', automationPotential: 0.5 },
      { value: 'reporting_analytics', label: 'Reporting and data analysis tasks', automationPotential: 0.8 },
      { value: 'sales_lead_mgmt', label: 'Sales process and lead management', automationPotential: 0.65 },
      { value: 'internal_coordination', label: 'Internal scheduling and coordination', automationPotential: 0.55 }
    ],
    customizableOptions: true,
    customizableQuestion: true, 
  },
  { 
    id: 'customer_comm_specifics',
    title: 'Regarding customer communication challenges for [Business Name,fallback=your business], which specific areas are most time-consuming or problematic?',
    subtitle: 'Select all that apply. This helps us pinpoint key automation opportunities within your customer interactions.',
    type: 'multiple',
    options: [ 
      { value: 'initial_outreach', label: 'Initial customer outreach and first contact' },
      { value: 'follow_up_sequences', label: 'Managing and personalizing follow-up sequences' },
      { value: 'handling_complaints', label: 'Responding to and resolving customer complaints/issues' },
      { value: 'personalized_messaging', label: 'Delivering personalized messages at scale (e.g., updates, offers)' },
      { value: 'appointment_reminders', label: 'Sending appointment or event reminders' },
      { value: 'feedback_collection', label: 'Collecting customer feedback systematically' }
    ],
    customizableOptions: false, 
    customizableQuestion: false,
    dependsOn: { questionId: 'biggest_pain_generic', answerValue: 'customer_interactions' } 
  },
  {
    id: 'tech_stack_generic', 
    title: 'What types of systems or tools does [Business Name,fallback=your team] currently use most?', 
    subtitle: 'Select all that apply. More tools often mean more integration and automation opportunities. AI will provide industry-specific examples.',
    type: 'multiple',
    options: [ 
      { value: 'crm_generic', label: 'CRM / Client Management System' },
      { value: 'email_marketing_generic', label: 'Email Marketing Platform' },
      { value: 'project_mgmt_generic', label: 'Project/Task Management Tool' },
      { value: 'spreadsheets_docs_generic', label: 'Heavy use of Spreadsheets/Documents for core processes' },
      { value: 'industry_specific_software_generic', label: 'Specialized Industry-Specific Software (e.g., EHR, MES, PMS)' },
      { value: 'basic_office_tools', label: 'Mostly standard office tools (email, calendar, basic docs)' }
    ],
    customizableOptions: true,
    customizableQuestion: true,
  },
  {
    id: 'growth_challenge_generic', 
    title: 'What is the biggest growth challenge for [Business Name,fallback=your business] right now?', 
    subtitle: 'This helps us prioritize which automations will have the most impact. AI will tailor options to your industry.',
    type: 'select',
    options: [ 
      { value: 'scaling_operations', label: 'Scaling operations without proportionally increasing costs/staff' },
      { value: 'improving_customer_experience', label: 'Improving customer service and experience at scale' },
      { value: 'marketing_lead_gen_roi', label: 'Marketing effectiveness and lead generation ROI' },
      { value: 'process_efficiency_bottlenecks', label: 'Manual processes creating bottlenecks and slowing growth' },
      { value: 'data_utilization_insights', label: 'Utilizing data effectively for decision-making and insights' }
    ],
    customizableOptions: true,
    customizableQuestion: true,
  },
  {
    id: 'timeline',
    title: 'When is [Business Name,fallback=your company] looking to implement automation solutions?',
    subtitle: 'Honest timeline helps us suggest the right approach.',
    type: 'select',
    options: [
      { value: 'asap', label: 'ASAP - this is urgent', priority: 100 },
      { value: '1_3months', label: 'Within 1-3 months', priority: 80 },
      { value: '3_6months', label: '3-6 months out', priority: 60 },
      { value: 'exploring', label: 'Just exploring options for now', priority: 30 }
    ],
    customizableOptions: false, 
    customizableQuestion: false,
  },
];

const AutomationOpportunityFinder = () => {
  const [assessmentStage, setAssessmentStage] = useState('initialName'); 
  const [businessName, setBusinessName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  
  const [answers, setAnswers] = useState({});
  const [processedQuestions, setProcessedQuestions] = useState(JSON.parse(JSON.stringify(baseQuestions))); 

  const [displayableQuestionsOrder, setDisplayableQuestionsOrder] = useState([]); 
  const [currentStepInDisplayable, setCurrentStepInDisplayable] = useState(0);

  const [funnyLoadingMessageIndex, setFunnyLoadingMessageIndex] = useState(0);
  const [initialLoadingMessageIndex, setInitialLoadingMessageIndex] = useState(0);


  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState(''); 
  const [showThankYou, setShowThankYou] = useState(false);
  const [name, setName] = useState(''); 
  const [showCalendlyPopup, setShowCalendlyPopup] = useState(false); 
  const [calendlyKey, setCalendlyKey] = useState(Date.now());
  
  const [aiTopRecNextSteps, setAiTopRecNextSteps] = useState({});
  const [isGeneratingNextSteps, setIsGeneratingNextSteps] = useState({});
  const [aiNextStepsError, setAiNextStepsError] = useState({});


  const isQuestionDisplayable = useCallback((question, currentAnswers) => {
    if (!question.dependsOn) return true;
    const dependentQuestionAnswer = currentAnswers[question.dependsOn.questionId];
    return dependentQuestionAnswer === question.dependsOn.answerValue;
  }, []);

  useEffect(() => {
    const initialMainAnswers = {};
    (processedQuestions || baseQuestions).forEach(q => {
      initialMainAnswers[q.id] = q.type === 'multiple' ? [] : '';
    });
    setAnswers(initialMainAnswers);
  }, [processedQuestions]);


  useEffect(() => {
    const order = [];
    (processedQuestions || baseQuestions).forEach((q, index) => {
      const questionToCheck = processedQuestions.find(pq => pq.id === q.id) || q; 
      if (isQuestionDisplayable(questionToCheck, answers)) {
        const idxInProcessed = processedQuestions.findIndex(pq => pq.id === q.id);
        if (idxInProcessed !== -1) {
            order.push(idxInProcessed);
        }
      }
    });
    setDisplayableQuestionsOrder(order);
  }, [answers, processedQuestions, isQuestionDisplayable]);


  useEffect(() => {
    if (showCalendlyPopup) {
      setCalendlyKey(Date.now()); 
      const scriptId = 'calendly-widget-script';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        if (window.Calendly && typeof window.Calendly.initInlineWidgets === 'function') {
           window.Calendly.initInlineWidgets();
        }
      }
      const handleEscape = (event) => {
        if (event.key === 'Escape') setShowCalendlyPopup(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showCalendlyPopup]);

  // Effect for cycling funny loading messages
  useEffect(() => {
    let intervalId;
    if (assessmentStage === 'personalizing') {
      intervalId = setInterval(() => {
        setFunnyLoadingMessageIndex(prevIndex => (prevIndex + 1) % funnyLoadingMessages.length);
      }, 6000); // Changed interval to 6 seconds
    }
    return () => clearInterval(intervalId);
  }, [assessmentStage]);

  // Effect for cycling initial loading messages
  useEffect(() => {
    let intervalId;
    if (assessmentStage === 'initialName') {
      intervalId = setInterval(() => {
        setInitialLoadingMessageIndex(prevIndex => (prevIndex + 1) % initialLoadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [assessmentStage]);


  const handleAnswer = (questionId, value, isMultiple = false) => {
    setAnswers(prevAnswers => {
      let newAnswerForQuestion;
      if (isMultiple) {
        const currentAnswersForQuestion = prevAnswers[questionId] || [];
        newAnswerForQuestion = currentAnswersForQuestion.includes(value)
          ? currentAnswersForQuestion.filter(a => a !== value)
          : [...currentAnswersForQuestion, value];
      } else {
        newAnswerForQuestion = value;
      }
      const newAnswers = { ...prevAnswers, [questionId]: newAnswerForQuestion };
      
      (processedQuestions || baseQuestions).forEach(q => {
        if (q.dependsOn && q.dependsOn.questionId === questionId && newAnswerForQuestion !== q.dependsOn.answerValue) {
          if (newAnswers[q.id] !== undefined) { 
            newAnswers[q.id] = q.type === 'multiple' ? [] : ''; 
          }
        }
      });
      return newAnswers;
    });
  };
  
  const callGeminiAPI = async (prompt, isJsonOutput = false, expectedSchema = null) => {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    if (isJsonOutput) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: expectedSchema || { type: "OBJECT", properties: {"output": {type: "STRING"}} } 
        };
    }
    const apiKey = "AIzaSyBO22-mK7am5AwLEMrV7UIuBRK66dPlChg"; // API_KEY REMOVED FOR SECURITY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorBody = await response.text(); 
            console.error("Gemini API error response body:", errorBody); 
            throw new Error(`API request failed with status ${response.status}. Full error: ${errorBody}`);
        }
        const result = await response.json();
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0].text) {
            const rawText = result.candidates[0].content.parts[0].text;
            if (isJsonOutput) {
                try { return JSON.parse(rawText); }
                catch (e) { 
                    console.error("Failed to parse JSON from Gemini:", e, "\nRaw text:", rawText);
                    throw new Error("AI response was not valid JSON as expected.");
                }
            }
            return rawText; 
        } else if (result.promptFeedback && result.promptFeedback.blockReason) {
            console.error("Gemini API prompt blocked:", result.promptFeedback);
            throw new Error(`AI request was blocked: ${result.promptFeedback.blockReason}. ${result.promptFeedback.blockReasonMessage || ''}`);
        }
         else {
            console.error("Unexpected response structure from Gemini:", result);
            throw new Error("AI did not return valid content.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error.message); 
        throw error; 
    }
  };

  const handlePersonalizeQuestions = async () => {
    setAssessmentStage('personalizing');
    setFunnyLoadingMessageIndex(0); 
    
    const questionsToPersonalize = baseQuestions.map(q => ({
        id: q.id,
        originalTitle: q.title,
        originalSubtitle: q.subtitle || "",
        originalOptions: q.options.map(opt => ({ value: opt.value, label: opt.label })),
        customizableQuestion: q.customizableQuestion || false,
        customizableOptions: q.customizableOptions || false,
        type: q.type 
    }));

    const prompt = `
      You are an AI assistant personalizing an automation assessment for a business.
      Business Name: "${businessName || 'This Business'}"
      Industry: "${selectedIndustry}"

      For each question in the provided 'questionsToPersonalize' array:
      1.  If 'customizableQuestion' is true for a question:
          * Rephrase its 'originalTitle' to be highly specific to the '${selectedIndustry}' industry. Incorporate "${businessName || 'This Business'}" naturally.
              Example for a generic scale question:
              - Healthcare: "For ${businessName || 'This Business'}, what is your approximate monthly patient volume?"
              - Retail: "How many monthly orders does ${businessName || 'This Business'} typically process?"
          * Rephrase its 'originalSubtitle' similarly to provide industry-specific context.
      2.  If 'customizableOptions' is true for a question:
          * Review its 'originalOptions'. Rephrase the labels or suggest 1-2 entirely new relevant options to be more specific to the rephrased question and the '${selectedIndustry}' industry.
          * If rephrasing an original option, KEEP its original 'value'.
          * For NEW options, create a NEW, concise, lowercase, underscore_separated 'value'.
          * Ensure options are appropriate for the question's 'type' (e.g., select vs. multiple).
      3.  If 'customizableQuestion' is false, return the 'originalTitle' and 'originalSubtitle'.
      4.  If 'customizableOptions' is false, return the 'originalOptions'.

      Provide your response as a single JSON array. Each element in the array must correspond to a question from the input and have the following structure:
      {
        "id": "string (original question ID)",
        "title": "string (new or original title)",
        "subtitle": "string (new or original subtitle)",
        "options": [ { "value": "string", "label": "string" }, ... ] (new or original options)
      }
      
      Ensure every question ID from the input is present in your output array.

      Questions to personalize (input format):
      ${JSON.stringify(questionsToPersonalize, null, 2)}
    `;

    const schemaForPersonalizedQuestions = { 
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                "id": { type: "STRING" },
                "title": { type: "STRING" },
                "subtitle": { type: "STRING" },
                "options": {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            "value": { type: "STRING" },
                            "label": { type: "STRING" }
                        },
                        required: ["value", "label"]
                    }
                }
            },
            required: ["id", "title", "options"]
        }
    };
    
    try {
        const aiModifiedQuestionsData = await callGeminiAPI(prompt, true, schemaForPersonalizedQuestions);
        
        if (!Array.isArray(aiModifiedQuestionsData)) {
            console.error("AI response for question personalization was not an array:", aiModifiedQuestionsData);
            throw new Error("AI response format error.");
        }

        const newProcessedQuestions = baseQuestions.map(baseQ => {
            const aiDataForThisQuestion = aiModifiedQuestionsData.find(aiQ => aiQ.id === baseQ.id);
            if (aiDataForThisQuestion) {
                const originalOptionsMap = new Map(baseQ.options.map(opt => [opt.value, opt]));
                const mergedOptions = aiDataForThisQuestion.options.map(aiOpt => {
                    const originalBaseOptData = originalOptionsMap.get(aiOpt.value);
                    if (originalBaseOptData) { 
                        return { ...originalBaseOptData, label: aiOpt.label }; 
                    } else { 
                        return { 
                            value: aiOpt.value, 
                            label: aiOpt.label,
                        };
                    }
                });

                return {
                    ...baseQ, 
                    title: aiDataForThisQuestion.title || baseQ.title, 
                    subtitle: aiDataForThisQuestion.subtitle || baseQ.subtitle, 
                    options: mergedOptions.length > 0 ? mergedOptions : baseQ.options, 
                };
            }
            return baseQ; 
        });
        setProcessedQuestions(newProcessedQuestions);

    } catch (error) {
        console.error("Failed to personalize questions with AI:", error.message); 
        setProcessedQuestions(JSON.parse(JSON.stringify(baseQuestions))); 
    } finally {
        setAssessmentStage('mainAssessment');
        setCurrentStepInDisplayable(0); 
    }
  };
  
  const handleInitialNext = () => {
    if (assessmentStage === 'initialName') { 
      setAssessmentStage('initialIndustry');
    } else if (assessmentStage === 'initialIndustry' && selectedIndustry) {
      handlePersonalizeQuestions(); 
    } else if (assessmentStage === 'initialIndustry' && !selectedIndustry) {
        setProcessedQuestions(JSON.parse(JSON.stringify(baseQuestions))); 
        setAssessmentStage('mainAssessment');
        setCurrentStepInDisplayable(0);
    }
  };

  const prevStep = () => {
    if (assessmentStage === 'mainAssessment') {
      if (currentStepInDisplayable > 0) {
        setCurrentStepInDisplayable(s => s - 1);
      } else {
        setAssessmentStage('initialIndustry');
        setProcessedQuestions(JSON.parse(JSON.stringify(baseQuestions))); 
      }
    } else if (assessmentStage === 'initialIndustry') {
      setAssessmentStage('initialName');
    }
    setTimeout(() => {
      const scrollableArea = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollableArea) scrollableArea.scrollTo(0, 0);
    }, 50);
  };

  const nextStep = () => {
    if (assessmentStage === 'mainAssessment') {
      if (currentStepInDisplayable < displayableQuestionsOrder.length - 1) {
        setCurrentStepInDisplayable(s => s + 1);
      } else {
        setShowResults(true); 
      }
    }
    setTimeout(() => {
      const scrollableArea = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollableArea) scrollableArea.scrollTo(0, 0);
    }, 50);
  };


  const generateTopAutomationOpportunities = (currentAnswers, currentQuestions, calculatedResults) => {
    const opportunities = [];
    const { hoursAutomatable } = calculatedResults;
    const painPointAnswer = currentAnswers.biggest_pain_generic;
    const painPointQuestion = currentQuestions.find(q => q.id === 'biggest_pain_generic');
    const painPointOption = painPointQuestion?.options.find(o => o.value === painPointAnswer);
    const painPointLabel = painPointOption?.label || "your primary challenge";

    if (painPointAnswer) {
        const potentialPainSavings = Math.max(5, Math.round(hoursAutomatable * 0.4));
        opportunities.push({
            id: 'pain_point_automation',
            icon: <Zap className="w-7 h-7 text-yellow-400" />,
            title: `Automate Tasks Around "${personalizeText(painPointLabel)}"`,
            description: `Streamlining processes related to ${personalizeText(painPointLabel)} for ${businessName || 'your business'} can free up significant time.`,
            timeSavings: `${potentialPainSavings} hrs/week`
        });
    }

    let repetitiveTaskDescription = "Reduce time on general administrative tasks like data entry, scheduling, and report generation.";
    if (selectedIndustry === "Healthcare" && painPointAnswer !== 'documentation') { // Avoid duplication if pain is documentation
        repetitiveTaskDescription = `Optimize patient record management and administrative workflows in your ${businessName || 'Healthcare practice'}.`;
    } else if (selectedIndustry === "Retail & E-commerce" && painPointAnswer !== 'inventory_mgmt') { // Avoid duplication if pain is inventory
        repetitiveTaskDescription = `Streamline inventory updates and customer communication for ${businessName || 'your E-commerce store'}.`;
    }
    const potentialRepetitiveSavings = Math.max(3, Math.round(hoursAutomatable * 0.3));
     if (opportunities.length < 3) {
        opportunities.push({
            id: 'repetitive_tasks_automation',
            icon: <Clock className="w-7 h-7 text-blue-400" />,
            title: 'Streamline Repetitive Manual Work',
            description: repetitiveTaskDescription,
            timeSavings: `${potentialRepetitiveSavings} hrs/week`
        });
    }

    const potentialAISavings = Math.max(2, Math.round(hoursAutomatable * 0.25)); // Slightly reduced multiplier to differentiate
    if (opportunities.length < 3) {
        opportunities.push({
            id: 'ai_tools_exploration',
            icon: <Lightbulb className="w-7 h-7 text-green-400" />,
            title: `Explore AI Tools for ${selectedIndustry} Workflows`,
            description: `Leverage AI for tasks like content generation, data analysis, or customer support specific to the ${selectedIndustry} sector for ${businessName || 'your company'}.`,
            timeSavings: `${potentialAISavings} hrs/week`
        });
    }
    
    return opportunities.slice(0, 3); 
};


  const calculateResults = () => {
    const questionsToUse = processedQuestions || baseQuestions;
    
    let hoursSpentManually = 50; 
    const manualHoursAnswer = answers.manual_hours; 
    const manualHoursQuestion = questionsToUse.find(q => q.id === 'manual_hours');
    if (manualHoursAnswer && manualHoursQuestion) {
        const selectedOption = manualHoursQuestion.options.find(opt => opt.value === manualHoursAnswer);
        if (selectedOption && typeof selectedOption.hours === 'number') {
            hoursSpentManually = selectedOption.hours;
        } 
    }

    let avgHourlyWage = 60; 
    const scaleAnswer = answers.company_scale_generic;
    const scaleQuestion = questionsToUse.find(q => q.id === 'company_scale_generic');
    if(scaleAnswer && scaleQuestion) {
        const scaleOptionLabel = scaleQuestion.options.find(o => o.value === scaleAnswer)?.label.toLowerCase();
        if(scaleOptionLabel) {
            if (scaleOptionLabel.includes('small') || scaleOptionLabel.includes('low volume') || scaleOptionLabel.includes('under 500') || scaleOptionLabel.includes('under 100 orders')) avgHourlyWage = 45;
            else if (scaleOptionLabel.includes('medium') || scaleOptionLabel.includes('moderate volume') || scaleOptionLabel.includes('500-2000') || scaleOptionLabel.includes('100-1000 orders')) avgHourlyWage = 55;
            else if (scaleOptionLabel.includes('large') || scaleOptionLabel.includes('high volume') || scaleOptionLabel.includes('2000-10000') || scaleOptionLabel.includes('1000-10000 orders')) avgHourlyWage = 65;
            else if (scaleOptionLabel.includes('very large') || scaleOptionLabel.includes('very high volume') || scaleOptionLabel.includes('10000+') || scaleOptionLabel.includes('10000+ orders')) avgHourlyWage = 75;
        }
    }

    const currentWeeklyManualCost = hoursSpentManually * avgHourlyWage;
    const currentMonthlyManualCost = currentWeeklyManualCost * 4.33; 
    const currentAnnualManualCost = currentMonthlyManualCost * 12;
  
    let automatablePercentageSum = 0;
    let automatableItemCount = 0;
  
    const biggestPainAnswer = answers.biggest_pain_generic; 
    const biggestPainQuestion = questionsToUse.find(q => q.id === 'biggest_pain_generic');
    if (biggestPainAnswer && biggestPainQuestion) {
        const painOption = biggestPainQuestion.options.find(opt => opt.value === biggestPainAnswer);
        if (painOption && typeof painOption.automationPotential === 'number') {
             automatablePercentageSum += (painOption.automationPotential * 100) ; 
        } else {
            automatablePercentageSum += 50; 
        }
        automatableItemCount++;
    }
  
    const averageAutomatablePercentage = automatableItemCount > 0 ? automatablePercentageSum / automatableItemCount : 30; 
    const hoursAutomatable = Math.round((hoursSpentManually * (averageAutomatablePercentage / 100)) * 10) / 10; 
  
    let estimatedMonthlyAutomationCost = 2000; 
    let tier = 'growth';
    const timelineAnswer = answers.timeline;
    if (timelineAnswer === 'asap') { estimatedMonthlyAutomationCost = 3000; tier = 'scale';}
    else if (timelineAnswer === '1_3months') { estimatedMonthlyAutomationCost = 2000; tier = 'growth';}
    else if (timelineAnswer === '3_6months') { estimatedMonthlyAutomationCost = 1000; tier = 'starter';}
    else if (timelineAnswer === 'exploring') { estimatedMonthlyAutomationCost = 800; tier = 'starter';}


    const estimatedAnnualAutomationCost = estimatedMonthlyAutomationCost * 12;
    const annualSavings = currentAnnualManualCost * (averageAutomatablePercentage / 100) - estimatedAnnualAutomationCost;
    const monthlySavings = annualSavings / 12;
  
    let roiPercentage = 0;
    if (estimatedAnnualAutomationCost > 0) {
      roiPercentage = Math.round((annualSavings / estimatedAnnualAutomationCost) * 100);
    } else if (annualSavings > 0) { roiPercentage = 1000; }
  
    let paybackMonths = 0;
    if (monthlySavings > 0) { paybackMonths = Math.ceil(estimatedMonthlyAutomationCost / monthlySavings); }
    else if (annualSavings <=0 && estimatedMonthlyAutomationCost > 0) { paybackMonths = null; }
    else if (annualSavings > 0 && estimatedMonthlyAutomationCost === 0) { paybackMonths = 1; }

    const percentageSaving = currentMonthlyManualCost > 0 ? 
        Math.round(((currentMonthlyManualCost - (currentMonthlyManualCost * (1 - (averageAutomatablePercentage / 100)) + estimatedMonthlyAutomationCost)) / currentMonthlyManualCost) * 100)
        : 0;
    
    const topAutomations = generateTopAutomationOpportunities(answers, questionsToUse, { hoursAutomatable });

    return {
      hoursAutomatable, currentWeeklyManualCost, currentMonthlyManualCost, currentAnnualManualCost,
      estimatedMonthlyAutomationCost, estimatedAnnualAutomationCost, annualSavings, monthlySavings,
      roiPercentage, paybackMonths, tier, avgHourlyWage, hoursSpentManually, averageAutomatablePercentage,
      percentageSaving: percentageSaving > 0 ? percentageSaving : 0,
      topAutomations: topAutomations, 
    };
  };
  
  const getDetailedRecommendations = (results) => { 
      const questionsToUse = processedQuestions || baseQuestions;
      const painPointAnswer = answers.biggest_pain_generic;
      const painPointOption = questionsToUse.find(q=>q.id === 'biggest_pain_generic')?.options.find(o=>o.value === painPointAnswer);
      const painPointLabel = painPointOption?.label || "your key challenge area";

      let recs = [];
      recs.push({
          id: 'quick_wins', title: 'Quick Wins: High-Impact Automations for [Business Name]',
          timeline: '1-2 Weeks', impact: 'High', priority: 'high', preview: true,
          items: [
              `Address "${personalizeText(painPointLabel)}" with targeted automation (est. ${Math.round(results.hoursAutomatable * 0.3)} hrs/wk savings).`,
              `Implement automated reminders/follow-ups for key processes related to your pain point.`,
              `Set up basic automated reporting for metrics relevant to "${personalizeText(painPointLabel)}".`
          ]
      });
      
      const techStackAnswer = answers.tech_stack_generic || [];
      if (techStackAnswer.includes('basic_office_tools') || techStackAnswer.includes('spreadsheets_docs_generic')) {
          recs.push({
              id: 'foundational_tech', title: 'Build a Strong Tech Foundation for [Business Name]',
              timeline: '2-4 Weeks', impact: 'High', priority: 'high', preview: true,
              items: [
                  `Evaluate and implement a central CRM or industry-specific management system relevant to '${selectedIndustry}'.`,
                  `Automate data migration from spreadsheets to the new system.`,
                  `Integrate email and calendar with your new core system.`
              ]
          });
      }
      return recs;
  };

  const handleEmailSubmit = async (e) => { 
      e.preventDefault();
      console.log("Email to be sent to:", email, "with name:", name);
      setShowEmailCapture(false);
      setShowThankYou(true); 
  };
  
  const handleGenerateNextSteps = async (recommendationTitle, recommendationItems, recId) => { 
        setIsGeneratingNextSteps(prev => ({...prev, [recId]: true}));
    setAiNextStepsError(prev => ({...prev, [recId]: ''}));
    
    const prompt = `
      Recommendation Title: "${recommendationTitle}"
      Recommendation Items: ${recommendationItems.join(", ")}
      Business Name: "${businessName || 'This Business'}"
      Industry: "${selectedIndustry || 'General Business'}"

      Provide 2-3 specific, actionable next steps (each a short phrase or sentence) for ${businessName || 'this business'} to start implementing the above recommendation.
      Format as a JSON array of strings. For example: ["Research X tool", "Draft Y process", "Assign Z task"]
    `;
    try {
      const nextSteps = await callGeminiAPI(prompt, true, { type: "ARRAY", items: { type: "STRING" } });
      if (Array.isArray(nextSteps)) {
        setAiTopRecNextSteps(prev => ({...prev, [recId]: nextSteps}));
      } else {
        throw new Error("AI Next Steps were not in the expected array format.");
      }
    } catch (error) {
      console.error(`Failed to generate AI next steps for ${recId}:`, error);
      setAiNextStepsError(prev => ({...prev, [recId]: error.message || "Could not generate next steps."}));
      setAiTopRecNextSteps(prev => ({...prev, [recId]: ["Define current process for these items.", "Identify key team members for this initiative.", "Explore relevant software solutions." ]})); 
    } finally {
      setIsGeneratingNextSteps(prev => ({...prev, [recId]: false}));
    }
   };
  

  const modalWrapperBaseStyle = { 
    borderRadius: '0.875rem', 
    padding: '1px', 
    background: popupBorderColorWithOpacity, 
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)', 
    width: '100%', 
  };
  const modalContentBaseStyle = { 
    borderRadius: 'calc(0.875rem - 1px)', 
    backdropFilter: 'blur(3px)',
    height: '100%', 
    display: 'flex',
    flexDirection: 'column',
  };
  const defaultPopupWrapperStyle = { 
    ...modalWrapperBaseStyle,
    maxWidth: '560px',
  };
  const defaultPopupContentStyle = { 
    ...modalContentBaseStyle,
    background: generalPopupContentBg, 
    padding: '1.5rem',
  };
  const thankYouPopupContentStyle = { 
    ...defaultPopupContentStyle,
    padding: '2rem',
  };
  const calendlyModalContainerStyle = {   
    background: '#040404',      
    borderRadius: '0.875rem',             
    padding: '0.5rem', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
    width: '90vw',                        
    maxWidth: '1200px', 
    height: '80vh',
    maxHeight: '800px',      
    display: 'flex',                      
    flexDirection: 'column',              
    position: 'relative',                 
    overflow: 'hidden',                   
  };
  
  const personalizeText = (text) => { 
    if (!text) return '';
    return text.replace(/\[Business Name,fallback=([^\]]+)\]/g, businessName || "$1")
               .replace(/\[Business Name\]/g, businessName || "your business");
  };

  // --- RENDER LOGIC ---
  if (showThankYou) { 
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div style={defaultPopupWrapperStyle}> 
          <div style={thankYouPopupContentStyle} className="w-full text-center"> 
            <div className="p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
              <CheckCircle className="w-12 h-12" style={{color: accentColor}} />
            </div>
            <h2 className="text-2xl font-semibold mb-4" style={{color: textColorPrimary}}>Thank You, {name || 'Valued User'}!</h2>
            <p className="text-sm mb-8" style={{color: textColorSecondary}}>Your personalized insights {email ? `for ${email}` : ''} will arrive shortly. Keep an eye on your inbox!</p>
            <button 
              onClick={() => { setShowThankYou(false); setShowEmailCapture(false); setShowResults(true); }} 
              className="px-6 py-3 rounded-xl font-medium" 
              style={{background: accentColor, color: popupCtaTextColor}}
            > 
              Back to My Report
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (showEmailCapture) { 
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#040404', color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div style={defaultPopupWrapperStyle}>
          <div style={{...defaultPopupContentStyle, background: '#040404', border: `1px solid ${accentColor}33`}} className="w-full"> 
            <div className="text-center mb-8">
              <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
                <Download className="w-10 h-10" style={{color: accentColor}} />
              </div>
              <h2 className="text-2xl font-semibold mb-3" style={{color: textColorPrimary}}>Get Your Complete Automation Strategy</h2>
              <p className="text-sm" style={{color: textColorSecondary}}>Enter details for a full report: roadmaps, ROI, tool recommendations.</p>
            </div>
            <div className="p-6 rounded-2xl mb-8 border" style={{backgroundColor: accentColorBgLowOpacity, borderColor: accentColorBorderLowOpacity}}> 
              <h3 className="font-medium text-base mb-4" style={{color: textColorPrimary}}>🎯 Full Report Includes:</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm" style={{color: textColorSecondary}}>
                {['Roadmap', 'ROI Projections', 'Tool Recommendations', 'Implementation Timeline', 'Risk Checklist', 'Success Metrics'].map(item => (
                   <div key={item} className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{color: accentColor}} />{item}</div>
                ))}
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input id="nameInput" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                     className="w-full p-4 rounded-xl border focus:ring-2 outline-none" 
                     style={{color:textColorPrimary, backgroundColor: 'rgba(0,0,0,0.3)', borderColor: accentColorBorderLowOpacity, '--tw-ring-color': accentColor}}/>
              <input id="emailInput" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Business Email"
                     className="w-full p-4 rounded-xl border focus:ring-2 outline-none" 
                     style={{color:textColorPrimary, backgroundColor: 'rgba(0,0,0,0.3)', borderColor: accentColorBorderLowOpacity, '--tw-ring-color': accentColor}}/>
              <button type="submit" className="w-full py-4 px-8 rounded-xl font-medium flex items-center justify-center hover:opacity-90 shadow-md" 
                      style={{background: accentColor, color: '#0A0A0A' }}> 
                <Mail className="w-5 h-5 mr-2" />Send My Report
              </button>
            </form>
            <button onClick={() => setShowEmailCapture(false)} className="w-full mt-3 py-3 rounded-xl font-medium text-sm border hover:bg-gray-700/30" style={{color: textColorMuted, borderColor: accentColorBorderLowOpacity}}>
              Back to Summary
            </button>
            <p className="text-center text-xs mt-4" style={{color: textColorVeryMuted}}>Report emailed in 5 mins. We respect your privacy.</p>
          </div>
        </div>
      </div>
    );
  }
  if (showCalendlyPopup) { 
    return (
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" 
        onClick={() => setShowCalendlyPopup(false)} 
      >
        <div 
          style={calendlyModalContainerStyle} 
          onClick={e => e.stopPropagation()} 
        >
            <button 
              onClick={() => setShowCalendlyPopup(false)} 
              className="p-1 rounded-full hover:bg-slate-700/30 text-slate-300 hover:text-slate-100 transition-colors"
              aria-label="Close"
              style={{ 
                position: 'absolute', 
                top: 'calc(0.5rem + 0.25rem)', 
                right: 'calc(0.5rem + 0.25rem)', 
                zIndex: 10 
              }}
            >
              <XIcon className="w-5 h-5" /> 
            </button>
            <div
              key={calendlyKey} 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/threesixtyvue-info/free-consultation?hide_gdpr_banner=1&background_color=040404&text_color=efefea&primary_color=27b48f&month=2025-06&date=2025-06-10"
              style={{ 
                width: '100%',    
                height: '100%',
                minHeight: '600px',
                border: 'none', 
                borderRadius: '0.625rem', 
                overflow: 'hidden', 
              }} 
            >
              {/* Calendly script populates this */}
            </div>
        </div>
      </div>
    );
  }
  
  if (assessmentStage === 'personalizing') {
    const currentFunnyMessage = funnyLoadingMessages[funnyLoadingMessageIndex];
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-4" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="flex items-center justify-center mb-6">
          <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{backgroundColor: accentColor}}></div>
          <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.4s'}}></div>
        </div>
        <div className="flex items-center justify-center mb-4">
          {currentFunnyMessage.icon}
          <p className="text-xl" style={{color: textColorSecondary}}>{currentFunnyMessage.text}</p>
        </div>
        {businessName && <p className="text-md mt-1" style={{color: textColorMuted}}>Crafting genius for {businessName} in the {selectedIndustry} sector!</p>}
      </div>
    );
  }

  if (assessmentStage === 'initialName' || assessmentStage === 'initialIndustry') { 
     return (
      <div className="w-full h-screen flex flex-col bg-[#0a0a0a]" style={{color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="flex-shrink-0 p-4 sm:p-6 sticky top-0 z-10 border-b border-slate-700/50 bg-[#0a0a0a]/80 backdrop-blur-md"> 
            <div className="max-w-4xl mx-auto">
                <h1 className="text-lg sm:text-2xl font-semibold tracking-tight" style={{color: textColorPrimary}}>Welcome! Let's Personalize Your Assessment</h1>
                <p className="mt-1 text-xs sm:text-sm" style={{color: textColorMuted}}>A couple of quick questions to get started.</p>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                {assessmentStage === 'initialName' && (
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center justify-center mb-6">
                          <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{backgroundColor: accentColor}}></div>
                          <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.4s'}}></div>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                          {initialLoadingMessages[initialLoadingMessageIndex].icon}
                          <p className="text-sm" style={{color: textColorMuted}}>{initialLoadingMessages[initialLoadingMessageIndex].text}</p>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight flex items-center justify-center" style={{color: textColorPrimary}}>
                            What's your business name?
                        </h2>
                        <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-center" style={{color: textColorSecondary}}>This will help us tailor the assessment language for you (optional).</p>
                        <input 
                            type="text" 
                            value={businessName} 
                            onChange={(e) => setBusinessName(e.target.value)} 
                            placeholder="E.g., Acme Corp, Sparkle Cleaners"
                            className="w-full p-4 rounded-xl bg-black/30 border focus:ring-2 outline-none" 
                            style={{color:textColorPrimary, borderColor: 'rgba(239,239,234,0.1)', ringColor: accentColor, '::placeholder': {color: textColorMuted}}}
                        />
                    </div>
                )}
                {assessmentStage === 'initialIndustry' && (
                    <div className="mb-10 sm:mb-12">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight flex items-center justify-center" style={{color: textColorPrimary}}>
                           What industry is {businessName || "your business"} in?
                        </h2>
                        <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-center" style={{color: textColorSecondary}}>Knowing your industry helps us provide more relevant insights and tailor questions.</p>
                        <select 
                            value={selectedIndustry} 
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/30 border focus:ring-2 outline-none appearance-none"
                            style={{color:textColorPrimary, borderColor: 'rgba(239,239,234,0.1)', ringColor: accentColor, backgroundRepeat: 'no-repeat', backgroundPosition: `right 0.75rem center`, backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${accentColor.substring(1)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                        >
                            <option value="" disabled style={{color: textColorMuted}}>Select an industry...</option>
                            {industries.map(industry => (
                                <option key={industry} value={industry} style={{backgroundColor: pageBgColor, color: textColorPrimary}}>{industry}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
        <div className="flex-shrink-0 p-4 sm:p-6 sticky bottom-0 z-10 border-t border-slate-700/50 bg-[#0a0a0a]/80 backdrop-blur-md"> 
            <div className="max-w-4xl mx-auto flex justify-end">
                <button 
                    onClick={handleInitialNext} 
                    disabled={(assessmentStage === 'initialIndustry' && !selectedIndustry)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: (assessmentStage === 'initialIndustry' && !selectedIndustry) ? 'rgba(239,239,234,0.1)' : accentColor, color: (assessmentStage === 'initialIndustry' && !selectedIndustry) ? textColorVeryMuted : popupCtaTextColor, border: `1px solid ${(assessmentStage === 'initialIndustry' && !selectedIndustry) ? 'rgba(239,239,234,0.1)' : accentColor}`}}
                > 
                    {assessmentStage === 'initialIndustry' ? 'Personalize & Start Assessment' : 'Next'}
                    <ChevronRight className="w-5 h-5 ml-1.5 sm:ml-2" />
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const recommendations = getDetailedRecommendations(results); 
    const previewRecs = recommendations.filter(r => r.preview);
    const hiddenRecs = recommendations.filter(r => !r.preview);
    
    return (
      <div className="w-full min-h-screen overflow-y-auto bg-[#0a0a0a]" style={{color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-3 tracking-tight leading-tight" style={{color: textColorPrimary}}>
                {businessName ? `Your Custom Automation Strategy for ${businessName}` : 'Your Custom Automation Strategy'}
            </h1>
             {selectedIndustry && <p className="text-lg" style={{color: accentColor}}>Industry: {selectedIndustry}</p>}
            <p className="text-md sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4" style={{color: textColorSecondary}}>Snapshot of AI automation's potential for your business, based on your answers.</p>
          </div>

           <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-12">
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-slate-800/50 border" style={{borderColor: 'rgba(239,239,234,0.2)'}}>
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <Clock className="w-6 h-6" style={{color: accentColor}} />
              </div>
              <h3 className="text-base font-medium mb-1" style={{color: textColorPrimary}}>Time Savings Potential</h3>
              <p className="text-4xl font-semibold my-2 tracking-tight" style={{color: accentColor}}>{results.hoursAutomatable}h</p>
              <p className="text-sm" style={{color: textColorMuted}}>Est. weekly hours recoverable.</p>
            </div>
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-slate-700/50 border" style={{borderColor: 'rgba(239,239,234,0.25)'}}> 
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <ArrowDownCircle className="w-6 h-6" style={{color: accentColor}} />
              </div>
              <h3 className="text-base font-medium mb-1" style={{color: textColorPrimary}}>Monthly Cost Reduction</h3>
              <p className="text-5xl font-bold my-3 tracking-tighter" style={{color: accentColor}}>{results.percentageSaving}%</p>
              <div className="text-xs space-y-1" style={{color: textColorMuted}}>
                <p>Manual: <span className="font-medium" style={{color: textColorSecondary}}>${results.currentMonthlyManualCost.toLocaleString()}</span></p>
                <p>With AI: <span className="font-medium" style={{color: textColorSecondary}}>${results.estimatedMonthlyAutomationCost.toLocaleString()}</span></p>
              </div>
            </div>
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-slate-800/50 border" style={{borderColor: 'rgba(239,239,234,0.2)'}}>
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <TrendingUp className="w-6 h-6" style={{color: accentColor}} />
              </div>
              <h3 className="text-base font-medium mb-1" style={{color: textColorPrimary}}>ROI Potential</h3>
              <p className="text-4xl font-semibold my-2 tracking-tight" style={{color: accentColor}}>
                {results.roiPercentage > 0 ? `+${results.roiPercentage}%` : (results.roiPercentage === 0 && results.annualSavings > 0) ? 'High' : 'N/A'}
              </p>
              <p className="text-sm" style={{color: textColorMuted}}>
                {results.paybackMonths ? `${results.paybackMonths} month payback` : results.roiPercentage >=0 ? 'Positive Outlook' : 'Details in full report'}
              </p>
            </div>
          </div>
          
          {results.topAutomations && results.topAutomations.length > 0 && (
            <div className="my-12 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center" style={{color: textColorPrimary}}>
                <Sparkles className="w-6 h-6 mr-2 text-yellow-400" /> Top Automation Opportunities for {businessName || "Your Business"}
              </h3>
              <div className="space-y-5 max-w-2xl mx-auto">
                {results.topAutomations.map((automation) => (
                  <div key={automation.id} className="p-5 rounded-xl border flex items-start" style={{backgroundColor: accentColorBgLowOpacity, borderColor: accentColorBorderLowOpacity}}>
                    <div className="flex-shrink-0 mr-4 mt-1">
                      {automation.icon || <Lightbulb className="w-7 h-7" style={{color: accentColor}}/>}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1" style={{color: textColorPrimary}}>{automation.title}</h4>
                      <p className="text-sm mb-2" style={{color: textColorSecondary}}>{automation.description}</p>
                      <p className="text-sm font-semibold" style={{color: accentColor}}>Est. Time Savings: {automation.timeSavings}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Automation Roadmap Preview Section */}
          <div className="my-12 relative">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-center" style={{color: textColorPrimary}}>
                🛣️ Your Automation Roadmap
              </h3>
              
              {/* Phase 1 - Visible Content */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: accentColor, color: '#0A0A0A'}}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <h4 className="text-xl font-semibold" style={{color: textColorPrimary}}>Phase 1: Foundation & Quick Wins (Weeks 1-4)</h4>
                </div>
                <div className="ml-11 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-1 flex-shrink-0" style={{color: accentColor}} />
                    <div>
                      <p className="font-medium" style={{color: textColorPrimary}}>Audit Current Processes</p>
                      <p className="text-sm" style={{color: textColorSecondary}}>Document and map existing workflows to identify automation opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-1 flex-shrink-0" style={{color: accentColor}} />
                    <div>
                      <p className="font-medium" style={{color: textColorPrimary}}>Implement Basic Automations</p>
                      <p className="text-sm" style={{color: textColorSecondary}}>Start with email automation, calendar scheduling, and simple data entry tasks</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 mt-1 flex-shrink-0" style={{color: accentColor}} />
                    <div>
                      <p className="font-medium" style={{color: textColorPrimary}}>Team Training & Setup</p>
                      <p className="text-sm" style={{color: textColorSecondary}}>Onboard team members and establish automation best practices</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blurred Preview of Additional Phases */}
              <div className="relative">
                <div className="filter blur-sm">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: 'rgba(146, 216, 200, 0.3)', color: textColorMuted}}>
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <h4 className="text-xl font-semibold opacity-60" style={{color: textColorPrimary}}>Phase 2: Advanced Integration (Weeks 5-8)</h4>
                    </div>
                    <div className="ml-11 space-y-3">
                      <div className="h-4 rounded opacity-30" style={{backgroundColor: textColorMuted}}></div>
                      <div className="h-4 rounded opacity-30" style={{backgroundColor: textColorMuted}}></div>
                      <div className="h-4 rounded opacity-30" style={{backgroundColor: textColorMuted}}></div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: 'rgba(146, 216, 200, 0.3)', color: textColorMuted}}>
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <h4 className="text-xl font-semibold opacity-60" style={{color: textColorPrimary}}>Phase 3: AI & Advanced Systems (Weeks 9-12)</h4>
                    </div>
                    <div className="ml-11 space-y-3">
                      <div className="h-4 rounded opacity-30" style={{backgroundColor: textColorMuted}}></div>
                      <div className="h-4 rounded opacity-30" style={{backgroundColor: textColorMuted}}></div>
                    </div>
                  </div>
                </div>

                {/* Unlock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div style={{...modalWrapperBaseStyle, maxWidth: '400px'}}> 
                    <div className="text-center p-6" style={{...modalContentBaseStyle, background: generalPopupContentBg, padding: '1.5rem'}}> 
                      <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
                        <Eye className="w-8 h-8" style={{color: accentColor}}/>
                      </div>
                      <h3 className="text-lg font-medium mb-2" style={{color: textColorPrimary}}>Complete Roadmap Available</h3>
                      <p className="mb-6 text-sm" style={{color: textColorSecondary}}>Get the full 12-week implementation plan with detailed timelines and milestones.</p>
                      <button 
                        onClick={() => setShowEmailCapture(true)}
                        className="px-6 py-3 rounded-xl font-medium flex items-center mx-auto hover:opacity-90" 
                        style={{background: accentColor, color: '#0A0A0A'}}
                      > 
                        <Download className="w-4 h-4 mr-2" />Unlock Full Roadmap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {previewRecs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-8 text-center sm:text-left" style={{color: textColorPrimary}}>Further Recommendations (Preview)</h3>
              <div className="space-y-6">
                {previewRecs.map((rec, index) => (
                  <div key={rec.id || index} className="p-6 sm:p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-lg sm:text-xl mb-2 flex items-center" style={{color: textColorPrimary}}>
                          <div className={`w-2.5 h-2.5 rounded-full mr-3`} style={{backgroundColor: rec.priority === 'high' ? accentColor : textColorVeryMuted}}></div>
                          {personalizeText(rec.title)}
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm" style={{color: textColorMuted}}>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" />{rec.timeline}</span>
                          <span className="flex items-center"><Zap className="w-4 h-4 mr-1.5" />{rec.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {rec.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="p-4 rounded-xl text-sm" style={{backgroundColor: accentColorBgLowOpacity, border: `1px solid ${accentColorBorderLowOpacity}`}}>
                          <div className="flex items-start" style={{color: textColorSecondary}}>
                            <CheckCircle className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                            <span>{personalizeText(item)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {index === 0 && ( 
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        {!aiTopRecNextSteps[rec.id] && !isGeneratingNextSteps[rec.id] && (
                           <button 
                              onClick={() => handleGenerateNextSteps(rec.title, rec.items, rec.id)}
                              disabled={isGeneratingNextSteps[rec.id]}
                              className="px-4 py-2 text-sm rounded-lg font-medium flex items-center hover:opacity-90 transition-all"
                              style={{background: accentColorDarker, color: textColorPrimary, border: `1px solid ${accentColor}`}}
                           >
                              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" /> Get AI Next Steps
                           </button>
                        )}
                        {isGeneratingNextSteps[rec.id] && (
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" style={{color: accentColor}} />
                            <p style={{color: textColorSecondary}}>Generating next steps...</p>
                          </div>
                        )}
                        {aiNextStepsError[rec.id] && <p className="text-red-400 mt-2 text-sm">{aiNextStepsError[rec.id]}</p>}
                        {aiTopRecNextSteps[rec.id] && Array.isArray(aiTopRecNextSteps[rec.id]) && (
                          <div className="mt-3">
                            <h5 className="text-sm font-semibold mb-2" style={{color: textColorPrimary}}>✨ AI Suggested Next Steps:</h5>
                            <ul className="space-y-2">
                              {aiTopRecNextSteps[rec.id].map((step, stepIdx) => (
                                <li key={stepIdx} className="text-xs flex items-start" style={{color: textColorSecondary}}>
                                  <ChevronRight className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
           {hiddenRecs.length > 0 && ( 
            <div className="mb-12 relative"> 
              <div className="filter blur-sm pointer-events-none"> 
                <h3 className="text-2xl sm:text-3xl font-semibold mb-8 text-center sm:text-left opacity-30" style={{color: textColorPrimary}}>Advanced & Custom Strategies</h3>
                <div className="space-y-6">
                  {hiddenRecs.slice(0, 2).map((rec, index) => ( 
                    <div key={index} className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                      <h4 className="font-medium text-lg sm:text-xl mb-2" style={{color: 'rgba(239,239,234,0.3)'}}>{personalizeText(rec.title)}</h4>
                      <div className="h-4 rounded" style={{backgroundColor: 'rgba(239,239,234,0.1)'}} ></div>
                      <div className="h-4 rounded mt-2" style={{backgroundColor: 'rgba(239,239,234,0.08)'}} ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4"> 
                <div style={{...modalWrapperBaseStyle, maxWidth: '480px'}}> 
                  <div className="text-center p-6 sm:p-8" style={{...modalContentBaseStyle, background: generalPopupContentBg, padding: '1.5rem'}}> 
                    <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
                      <Eye className="w-8 h-8" style={{color: accentColor}}/>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-2" style={{color: textColorPrimary}}>Unlock Your Full Potential</h3>
                    <p className="mb-6 text-sm" style={{color: textColorSecondary}}>Get the complete report: detailed strategies, tools, ROI.</p>
                    <button 
                      onClick={() => setShowEmailCapture(true)}
                      className="px-6 py-3 rounded-xl font-medium flex items-center mx-auto hover:opacity-90 shadow-lg" 
                      style={{background: accentColorDarker, color: textColorPrimary}}
                    > 
                      <Download className="w-4 h-4 mr-2" />Get My Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        
          <div style={{...modalWrapperBaseStyle, maxWidth: 'none', padding:'1px'}} className="mx-auto" > 
            <div className="p-6 sm:p-10 rounded-[0.8125rem] text-center" style={{background: generalPopupContentBg, backdropFilter: 'blur(3px)' }}> 
              <h3 className="text-xl sm:text-2xl font-semibold mb-3" style={{color: textColorPrimary}}>Ready to Transform Your Business?</h3>
              <p className="text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed" style={{color: textColorSecondary}}>
                Turn analysis into action. Schedule a free strategy call for a tailored implementation plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button 
                  onClick={() => setShowCalendlyPopup(true)} 
                  className="px-6 py-3 rounded-xl font-medium w-full sm:w-auto hover:opacity-90 shadow-md" 
                  style={{background: brighterMainCtaColor, color: popupCtaTextColor }}
                > 
                  Schedule Free Strategy Call
                </button>
                <button 
                  onClick={() => setShowEmailCapture(true)}
                  className="px-6 py-3 rounded-xl font-medium w-full sm:w-auto border hover:opacity-90" 
                   style={{
                      background: accentColorBgMediumOpacity, 
                      color: textColorPrimary, 
                      borderColor: accentColor 
                    }}
                >
                  Get Full Report
                </button>
              </div>
              <p className="text-xs mt-4" style={{color: textColorVeryMuted}}>Personalized consultation • Custom roadmap • No pressure</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const questionsSource = processedQuestions || baseQuestions; 
  let actualCurrentQuestionData = null;

  if (assessmentStage === 'mainAssessment' && displayableQuestionsOrder.length > 0 && currentStepInDisplayable < displayableQuestionsOrder.length) {
    const displayableQuestionOriginalIndex = displayableQuestionsOrder[currentStepInDisplayable];
    actualCurrentQuestionData = questionsSource[displayableQuestionOriginalIndex];
  }


  if (assessmentStage === 'mainAssessment' && !actualCurrentQuestionData) { 
    if (displayableQuestionsOrder.length === 0 && currentStepInDisplayable === 0) {
        return (
             <div className="w-full h-screen flex flex-col items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
                <HelpCircle className="w-12 h-12 text-yellow-400 mb-4" />
                <p className="text-xl" style={{color: textColorSecondary}}>No applicable questions based on current selections.</p>
                <button onClick={() => setShowResults(true)} className="mt-4 px-6 py-2 rounded-lg" style={{background: accentColor, color: popupCtaTextColor}}>Show Summary</button>
            </div>
        );
    }
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{color: accentColor}} />
            <p className="text-xl" style={{color: textColorSecondary}}>Loading questions...</p>
        </div>
    );
  }

  if (assessmentStage === 'mainAssessment' && actualCurrentQuestionData) {
    const currentQuestionAnswer = answers[actualCurrentQuestionData.id];
    const isAnswered = actualCurrentQuestionData.type === 'multiple'
      ? (currentQuestionAnswer && currentQuestionAnswer.length > 0)
      : (currentQuestionAnswer !== '' && currentQuestionAnswer !== undefined && currentQuestionAnswer !== null);
    
    const contextualHelpText = actualCurrentQuestionData.contextualHelp && actualCurrentQuestionData.contextualHelp[selectedIndustry]
      ? actualCurrentQuestionData.contextualHelp[selectedIndustry]
      : null;

    return (
      <div className="w-full h-screen flex flex-col bg-[#0a0a0a]" style={{color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="flex-shrink-0 p-4 sm:p-6 sticky top-0 z-10 border-b border-slate-700/50 bg-[#0a0a0a]/80 backdrop-blur-md"> 
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h1 className="text-lg sm:text-2xl font-semibold tracking-tight" style={{color: textColorPrimary}}>
                  AI Automation Assessment {businessName && `for ${businessName}`}
                </h1>
                <p className="mt-1 text-xs sm:text-sm" style={{color: textColorMuted}}>Industry: {selectedIndustry || "Not Selected"}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium" style={{color: textColorMuted}}>Step {currentStepInDisplayable + 1} of {displayableQuestionsOrder.length || 1}</span>
                <div className="text-lg sm:text-xl font-semibold" style={{color: accentColor}}>{Math.round(((currentStepInDisplayable + 1) / (displayableQuestionsOrder.length || 1)) * 100)}%</div>
              </div>
            </div>
            <div className="w-full rounded-full h-1.5 sm:h-2" style={{backgroundColor: 'rgba(239,239,234,0.15)'}}> 
              <div className="h-full rounded-full transition-all duration-300"
                   style={{ width: `${((currentStepInDisplayable + 1) / (displayableQuestionsOrder.length || 1)) * 100}%`, backgroundColor: accentColor }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 sm:p-6"> 
            <div className="mb-10 sm:mb-12"> 
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight" style={{color: textColorPrimary}}>{personalizeText(actualCurrentQuestionData.title)}</h2>
              {actualCurrentQuestionData.subtitle && <p className="mb-1 text-sm sm:text-base leading-relaxed" style={{color: textColorSecondary}}>{personalizeText(actualCurrentQuestionData.subtitle)}</p>}
              {contextualHelpText && (
                <div className="mt-2 mb-4 p-3 rounded-lg text-xs flex items-start" style={{backgroundColor: accentColorBgLowOpacity, color: textColorSecondary, border: `1px solid ${accentColorBorderLowOpacity}`}}>
                  <HelpCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{color: accentColor}}/>
                  <span>{personalizeText(contextualHelpText)}</span>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4 mt-6">
                {actualCurrentQuestionData.options.map((option) => {
                  let isSelected;
                  if (actualCurrentQuestionData.type === 'multiple') {
                      isSelected = Array.isArray(answers[actualCurrentQuestionData.id]) && answers[actualCurrentQuestionData.id].includes(option.value);
                  } else {
                      isSelected = answers[actualCurrentQuestionData.id] === option.value;
                  }
                  
                  return (
                    <label key={option.value} className="block cursor-pointer group"> 
                      <div 
                        className={`p-4 sm:p-5 rounded-xl transition-all duration-200 flex items-center border hover:border-opacity-70 ${isSelected ? 'shadow-md' : ''}`}
                        style={{ 
                          borderColor: isSelected ? accentColor : 'rgba(239,239,234,0.15)', 
                          backgroundColor: isSelected ? accentColorBgLowOpacity : 'rgba(239,239,234,0.04)', 
                          minHeight: '64px' 
                        }}
                      >
                        <input 
                          type={actualCurrentQuestionData.type === 'multiple' ? 'checkbox' : 'radio'} 
                          name={actualCurrentQuestionData.id} 
                          value={option.value} 
                          checked={isSelected} 
                          onChange={() => handleAnswer(actualCurrentQuestionData.id, option.value, actualCurrentQuestionData.type === 'multiple')}
                          className="mr-3 sm:mr-4 mt-0.5 scale-105 sm:scale-110 flex-shrink-0" 
                          style={{accentColor: accentColor}} 
                        />
                        <div className="flex-1"> 
                          <span className="font-medium text-sm sm:text-base" style={{color: textColorPrimary}}>{personalizeText(option.label)}</span>
                          {option.description && <p className="text-xs sm:text-sm mt-1" style={{color: textColorSecondary}}>{personalizeText(option.description)}</p>}
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 ml-3 flex-shrink-0" style={{color: accentColor}}/>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 sticky bottom-0 z-10 border-t border-slate-700/50 bg-[#0a0a0a]/80 backdrop-blur-md"> 
          <div className="max-w-4xl mx-auto flex justify-between">
            <button 
              onClick={prevStep} 
              disabled={assessmentStage === 'mainAssessment' && currentStepInDisplayable === 0 && assessmentStage !== 'initialIndustry' && assessmentStage !== 'initialName'} 
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors border hover:bg-slate-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(239,239,234,0.06)', 
                borderColor: 'rgba(239,239,234,0.25)',
                color: (assessmentStage === 'mainAssessment' && currentStepInDisplayable === 0 && assessmentStage !== 'initialIndustry' && assessmentStage !== 'initialName' ) ? textColorVeryMuted : textColorPrimary
              }}
            >
              Previous
            </button>
            <button 
              onClick={nextStep} 
              disabled={!isAnswered}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: !isAnswered ? 'rgba(239,239,234,0.1)' : accentColor, 
                color: !isAnswered ? textColorVeryMuted : popupCtaTextColor, 
                border: `1px solid ${!isAnswered ? 'rgba(239,239,234,0.1)' : accentColor}`
              }}
            > 
              {currentStepInDisplayable === displayableQuestionsOrder.length - 1 ? 'Get My Analysis' : 'Continue'}
              <ChevronRight className="w-5 h-5 ml-1.5 sm:ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
      <div className="w-full h-screen flex items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary}}>
        Initializing Assessment...
      </div>
  );

};

export default AutomationOpportunityFinder;
