import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Clock, TrendingUp, CheckCircle, Zap, Eye, Download, Mail, ArrowDownCircle, X as XIcon, Sparkles, Loader2, HelpCircle, Cpu, Lightbulb, AlertTriangle } from 'lucide-react';

// --- Color Palette (retained for UI consistency) ---
const pageBgColor = '#0a0a0a';
const textColorPrimary = '#efefea';
const textColorSecondary = '#c8c8c4';
const textColorMuted = '#a1a19b';
const textColorVeryMuted = '#6B7280';
const accentColor = '#92d8c8';
const popupBorderColorWithOpacity = '#0e9f7bBF';
const brighterMainCtaColor = '#4DCFB9';
const popupCtaTextColor = '#0A0A0A';
const accentColorBgLowOpacity = accentColor + '1A';
const accentColorBgMediumOpacity = accentColor + '26';
const accentColorBorderLowOpacity = accentColor + '33';
const generalPopupContentBg = 'rgba(20, 25, 35, 0.70)';

// --- Loading Messages ---
const loadingMessages = [
  { 
    text: "Sacrificing a USB cable to the tech gods for faster processing...", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><Zap className="w-8 h-8 text-red-400" /></div>
  },
  { 
    text: "Loading... please wait while we pretend this is complicated.", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><Clock className="w-8 h-8 text-blue-400" /></div>
  },
  { 
    text: "Please hold while our AI argues with itself about your answers...", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><Cpu className="w-8 h-8 text-pink-400 animate-pulse" /></div>
  },
  { 
    text: "Our AI is having an existential crisis... give it a moment to pull itself together.", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><AlertTriangle className="w-8 h-8 text-yellow-400 animate-bounce" /></div>
  },
  { 
    text: "Feeding our overworked algorithms some energy drinks and false hope...", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><Zap className="w-8 h-8 text-purple-400 animate-pulse" /></div>
  },
  { 
    text: "Our servers are powered by tears of frustrated developers... almost ready!", 
    icon: <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}><Sparkles className="w-8 h-8 text-blue-400" /></div>
  }
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
    id: 'automation_budget',
    title: 'What is the approximate monthly budget [Business Name,fallback=your company] is considering for automation solutions?',
    subtitle: 'Understanding your budget helps us recommend appropriately scaled solutions.',
    type: 'select',
    options: [
      { value: '850_1500', label: '$850 - $1,500 / month' },
      { value: '1500_3000', label: '$1,500 - $3,000 / month' },
      { value: '3000_5000', label: '$3,000 - $5,000 / month' },
      { value: '5000_10000', label: '$5,000 - $10,000 / month' },
      { value: '10000_plus', label: '$10,000+ / month' },
      { value: 'exploring_budget', label: 'Still exploring / Unsure' }
    ],
    customizableOptions: false,
    customizableQuestion: false,
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

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [emailConsent, setEmailConsent] = useState(true);

  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showCalendlyPopup, setShowCalendlyPopup] = useState(false);
  const [calendlyKey, setCalendlyKey] = useState(Date.now());

  const isQuestionDisplayable = useCallback((question, currentAnswers) => {
    if (!question.dependsOn) return true;
    const dependentQuestionAnswer = currentAnswers[question.dependsOn.questionId];
    return dependentQuestionAnswer === question.dependsOn.answerValue;
  }, []);

  useEffect(() => {
    // Initialize answers based on processed or base questions
    const initialMainAnswers = {};
    (processedQuestions || baseQuestions).forEach(q => {
      initialMainAnswers[q.id] = q.type === 'multiple' ? [] : '';
    });
    setAnswers(initialMainAnswers);
  }, [processedQuestions]); // Rerun when processedQuestions changes

  useEffect(() => {
    // Determine the order of displayable questions
    const order = [];
    const questionsToConsider = processedQuestions || baseQuestions; // Ensure we use the latest questions
    questionsToConsider.forEach((q) => { // Iterate through the source of truth for questions
      // Find the most up-to-date version of the question, preferring processedQuestions
      const questionToCheck = processedQuestions.find(pq => pq.id === q.id) || q;
      if (isQuestionDisplayable(questionToCheck, answers)) {
          // Find the index in the *current* processedQuestions array
          const idxInProcessed = processedQuestions.findIndex(pq => pq.id === q.id);
          if (idxInProcessed !== -1) { // Ensure it exists in processedQuestions
            order.push(idxInProcessed);
          }
      }
    });
    setDisplayableQuestionsOrder(order);
  }, [answers, processedQuestions, isQuestionDisplayable]);

  useEffect(() => {
    // Effect for handling the Calendly popup
    if (showCalendlyPopup) {
      setCalendlyKey(Date.now()); // Force re-render of Calendly widget if it's already on the page
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
        // If script exists, re-initialize widgets (useful if it was loaded before but hidden)
        if (window.Calendly && typeof window.Calendly.initInlineWidgets === 'function') {
           window.Calendly.initInlineWidgets();
        }
      }
      // Add event listener for escape key to close popup
      const handleEscape = (event) => {
        if (event.key === 'Escape') setShowCalendlyPopup(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape); // Cleanup listener
    }
  }, [showCalendlyPopup]);

  // Effect for cycling loading messages
  useEffect(() => {
    let intervalId;
    if (assessmentStage === 'personalizing') {
      intervalId = setInterval(() => {
        setLoadingMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }, 4000); // Change message every 4 seconds
    }
    return () => clearInterval(intervalId); // Cleanup interval
  }, [assessmentStage]);

  const handleAnswer = (questionId, value, isMultiple = false) => {
    setAnswers(prevAnswers => {
      let newAnswerForQuestion;
      if (isMultiple) {
        // Handle multiple choice answers (checkboxes)
        const currentAnswersForQuestion = prevAnswers[questionId] || [];
        newAnswerForQuestion = currentAnswersForQuestion.includes(value)
          ? currentAnswersForQuestion.filter(a => a !== value) // Remove if already selected
          : [...currentAnswersForQuestion, value]; // Add if not selected
      } else {
        // Handle single choice answers (radio/select)
        newAnswerForQuestion = value;
      }
      const newAnswers = { ...prevAnswers, [questionId]: newAnswerForQuestion };

      // Reset answers for dependent questions if the triggering answer changes
      (processedQuestions || baseQuestions).forEach(q => {
        if (q.dependsOn && q.dependsOn.questionId === questionId && newAnswerForQuestion !== q.dependsOn.answerValue) {
          if (newAnswers[q.id] !== undefined) { // Check if the answer exists before trying to reset
            newAnswers[q.id] = q.type === 'multiple' ? [] : ''; // Reset to default empty state
          }
        }
      });
      return newAnswers;
    });
  };

  const callGeminiAPI = async (prompt, isJsonOutput = false, expectedSchema = null) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("API key not found. Please set REACT_APP_GEMINI_API_KEY environment variable.");
      throw new Error("API key not configured");
    }

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    if (isJsonOutput) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: expectedSchema || { type: "OBJECT", properties: {"output": {type: "STRING"}} }
        };
    }

    // Ensure correct model for the API key
    const modelToUse = "gemini-2.0-flash-exp";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`;

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
        } else {
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
    setLoadingMessageIndex(0);

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
            throw new Error("AI response format error during question personalization.");
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
    const { hoursAutomatable } = calculatedResults;

    const automationTypes = [
      {
        id: 'content_automation',
        icon: <Sparkles className="w-6 h-6 text-purple-400" />,
        title: 'Content Creation & Repurposing',
        description: `Automate content generation, social media posting, and content repurposing workflows for ${businessName || 'your business'}.`,
        timeSavings: `${Math.max(3, Math.round(hoursAutomatable * 0.35))} hrs/week`
      },
      {
        id: 'data_automation',
        icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
        title: 'Data Entry & Management',
        description: `Eliminate manual data entry and resolve data silos with automated workflows and integrations.`,
        timeSavings: `${Math.max(4, Math.round(hoursAutomatable * 0.4))} hrs/week`
      },
      {
        id: 'communication_automation',
        icon: <Mail className="w-6 h-6 text-green-400" />,
        title: 'Customer Communication',
        description: `Streamline customer follow-ups, appointment reminders, and personalized messaging at scale.`,
        timeSavings: `${Math.max(2, Math.round(hoursAutomatable * 0.25))} hrs/week`
      }
    ];

    return automationTypes.slice(0, 3);
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
            automatablePercentageSum += 50; // Default potential if not specified
       }
       automatableItemCount++;
   }

   const averageAutomatablePercentage = automatableItemCount > 0 ? automatablePercentageSum / automatableItemCount : 30; // Default if no pain point selected
   const hoursAutomatable = Math.round((hoursSpentManually * (averageAutomatablePercentage / 100)) * 10) / 10;

   let estimatedMonthlyAutomationCost = 1800; // Default base cost
   let tier = 'growth';
   const timelineAnswer = answers.timeline;
   const budgetAnswer = answers.automation_budget;

   if (budgetAnswer === '850_1500') estimatedMonthlyAutomationCost = 1175;
   else if (budgetAnswer === '1500_3000') estimatedMonthlyAutomationCost = 2250;
   else if (budgetAnswer === '3000_5000') estimatedMonthlyAutomationCost = 4000;
   else if (budgetAnswer === '5000_10000') estimatedMonthlyAutomationCost = 7500;
   else if (budgetAnswer === '10000_plus') estimatedMonthlyAutomationCost = 12000;

   if (timelineAnswer === 'asap') {
     estimatedMonthlyAutomationCost = Math.max(estimatedMonthlyAutomationCost, 2500);
     tier = 'scale';
   } else if (timelineAnswer === '1_3months') {
     tier = 'growth';
   } else if (timelineAnswer === '3_6months') {
     tier = 'starter';
     estimatedMonthlyAutomationCost = Math.min(estimatedMonthlyAutomationCost, 1500);
   } else if (timelineAnswer === 'exploring') {
     tier = 'starter';
     estimatedMonthlyAutomationCost = Math.min(estimatedMonthlyAutomationCost, 1200);
   }

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

 const handleEmailSubmit = async (e) => {
     e.preventDefault();
     if (!emailConsent) {
       console.warn("Email consent not provided.");
       return;
     }
     console.log("Email form submitted. Email:", email, "Name:", name, "Consent:", emailConsent);
     setShowEmailCapture(false);
     setShowThankYou(true);
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
   padding: '0rem',
   boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
   width: '90vw',
   maxWidth: '1200px',
   height: '80vh',
   maxHeight: '800px',
   display: 'flex',
   flexDirection: 'column',
   position: 'relative',
   overflow: 'hidden',
   border: 'none',
 };

 const personalizeText = (text) => {
   if (!text) return '';
   return text.replace(/\[Business Name,fallback=([^\]]+)\]/g, businessName || "$1")
              .replace(/\[Business Name\]/g, businessName || "your business");
 };

 // --- RENDER LOGIC ---
 if (showThankYou) { 
   return (
     <div className="max-w-2xl mx-auto p-6 sm:p-8 min-h-screen flex items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
       <div style={{...defaultPopupWrapperStyle, maxWidth: '500px'}}> 
         <div style={{...thankYouPopupContentStyle, padding: '3rem'}} className="w-full text-center"> 
           <div className="p-5 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
             <CheckCircle className="w-14 h-14" style={{color: accentColor}} />
           </div>
           <h2 className="text-3xl font-bold mb-6" style={{color: textColorPrimary}}>Thank You{name ? `, ${name}` : ''}!</h2>
           <p className="text-base mb-10 leading-relaxed" style={{color: textColorSecondary}}>
             Your personalized automation strategy {email ? `has been sent to ${email}` : 'will arrive shortly'}. 
             Keep an eye on your inbox for your comprehensive report!
           </p>
           <button 
             onClick={() => { setShowThankYou(false); setShowEmailCapture(false); setShowResults(true); }} 
             className="px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 shadow-lg transition-opacity" 
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
     <div className="max-w-3xl mx-auto p-6 sm:p-8 min-h-screen flex items-center justify-center" style={{backgroundColor: '#040404', color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
       <div style={{...defaultPopupWrapperStyle, maxWidth: '600px'}}>
         <div style={{...defaultPopupContentStyle, background: '#040404', padding: '2.5rem'}} className="w-full"> 
           <div className="text-center mb-10">
             <div className="p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
               <Download className="w-10 h-10" style={{color: accentColor}} />
             </div>
             <h2 className="text-3xl font-bold mb-4" style={{color: textColorPrimary}}>Get Your Complete Automation Strategy</h2>
             <p className="text-base leading-relaxed" style={{color: textColorSecondary}}>Enter your details for a comprehensive report with roadmaps, ROI projections, and tool recommendations.</p>
           </div>
           
           <div className="p-8 rounded-2xl mb-10" style={{backgroundColor: accentColorBgLowOpacity, border: `1px solid ${accentColorBorderLowOpacity}`}}> 
             <h3 className="font-semibold text-lg mb-6 text-center" style={{color: textColorPrimary}}>🎯 Your Full Report Includes:</h3>
             <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{color: textColorSecondary}}>
               {[
                 'Implementation Roadmap', 
                 'ROI Projections & Analysis', 
                 'Tool Recommendations', 
                 'Timeline & Milestones', 
                 'Risk Assessment', 
                 'Success Metrics & KPIs'
               ].map(item => (
                  <div key={item} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{color: accentColor}} />
                    <span>{item}</span>
                  </div>
               ))}
             </div>
           </div>
           
           <form onSubmit={handleEmailSubmit} className="space-y-6">
             <input 
               id="nameInput" 
               type="text" 
               required 
               value={name} 
               onChange={e => setName(e.target.value)} 
               placeholder="Full Name"
               className="w-full p-4 rounded-xl border-2 focus:ring-2 outline-none transition-all" 
               style={{
                 color: textColorPrimary, 
                 backgroundColor: 'rgba(0,0,0,0.4)', 
                 borderColor: accentColorBorderLowOpacity, 
                 '--tw-ring-color': accentColor
               }}
             />
             <input 
               id="emailInput" 
               type="email" 
               required 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               placeholder="Business Email"
               className="w-full p-4 rounded-xl border-2 focus:ring-2 outline-none transition-all" 
               style={{
                 color: textColorPrimary, 
                 backgroundColor: 'rgba(0,0,0,0.4)', 
                 borderColor: accentColorBorderLowOpacity, 
                 '--tw-ring-color': accentColor
               }}
             />
             
             <div className="flex items-start space-x-4 py-3">
               <input 
                 id="emailConsent" 
                 type="checkbox" 
                 checked={emailConsent} 
                 onChange={(e) => setEmailConsent(e.target.checked)}
                 required
                 className="mt-1 scale-125" 
                 style={{accentColor: accentColor}} 
               />
               <label htmlFor="emailConsent" className="text-sm leading-relaxed" style={{color: textColorSecondary}}>
                 I agree to receive automation insights and industry updates via email. You can unsubscribe at any time. 
                 <span className="block mt-2 text-xs" style={{color: textColorVeryMuted}}>
                   By checking this box, you consent to our email communications as outlined in our privacy policy.
                 </span>
               </label>
             </div>

             <button 
               type="submit" 
               disabled={!emailConsent}
               className="w-full py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
               style={{
                 background: emailConsent ? accentColor : 'rgba(146, 216, 200, 0.3)', 
                 color: emailConsent ? '#0A0A0A' : textColorMuted 
               }}
             > 
               <Mail className="w-6 h-6 mr-3" />Send My Complete Report
             </button>
           </form>
           
           <button 
             onClick={() => setShowEmailCapture(false)} 
             className="w-full mt-6 py-3 rounded-xl font-medium border hover:bg-gray-700/20 transition-all" 
             style={{color: textColorMuted, borderColor: accentColorBorderLowOpacity}}
           >
             Back to Summary
           </button>
           
           <p className="text-center text-xs mt-6" style={{color: textColorVeryMuted}}>
             Report delivered within 5 minutes • We respect your privacy • No spam, ever
           </p>
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
             borderRadius: '0.875rem',
             overflow: 'hidden',
             outline: 'none',
             boxShadow: 'none'
           }}
         >
           {/* Calendly script will populate this div */}
         </div>
       </div>
     </div>
   );
 }

 if (assessmentStage === 'personalizing') {
   const currentLoadingMessage = loadingMessages[loadingMessageIndex];
   return (
     <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6" style={{backgroundColor: pageBgColor, color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
       <div className="flex items-center justify-center mb-8">
         <div className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: accentColor}}></div>
         <div className="w-3 h-3 rounded-full mr-3 animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.2s'}}></div>
         <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: accentColor, animationDelay: '0.4s'}}></div>
       </div>
       
       <div className="flex items-center justify-center mb-8 max-w-3xl">
         <div className="flex-shrink-0 mr-6">
           {currentLoadingMessage.icon}
         </div>
         <p className="text-xl sm:text-2xl leading-relaxed" style={{color: textColorSecondary}}>
           {currentLoadingMessage.text}
         </p>
       </div>
       
       {(businessName || selectedIndustry) && (
         <div className="p-6 rounded-2xl border border-slate-700/50 max-w-md" style={{backgroundColor: 'rgba(30, 41, 59, 0.4)'}}>
           <p className="text-lg font-medium mb-2" style={{color: textColorPrimary}}>Personalizing for:</p>
           {businessName && <p className="text-base" style={{color: accentColor}}>{businessName}</p>}
           {selectedIndustry && <p className="text-sm" style={{color: textColorSecondary}}>{selectedIndustry} Industry</p>}
         </div>
       )}
     </div>
   );
 }

 if (assessmentStage === 'initialName' || assessmentStage === 'initialIndustry') { 
    return (
     <div className="w-full h-screen flex flex-col bg-[#0a0a0a]" style={{color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
       <div className="flex-shrink-0 p-6 sm:p-8 sticky top-0 z-10 border-b border-slate-700/50 bg-[#0a0a0a]/90 backdrop-blur-md"> 
           <div className="max-w-4xl mx-auto">
               <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{color: textColorPrimary}}>Welcome! Let's Personalize Your Assessment</h1>
               <p className="mt-2 text-sm sm:text-base" style={{color: textColorMuted}}>A couple of quick questions to get started and tailor your experience.</p>
           </div>
       </div>
       
       <div className="flex-1 overflow-y-auto">
           <div className="max-w-2xl mx-auto p-6 sm:p-8">
               {assessmentStage === 'initialName' && (
                   <div className="mb-12 sm:mb-16 text-center">
                       <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 tracking-tight" style={{color: textColorPrimary}}>
                           What's your business name?
                       </h2>
                       <p className="mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed max-w-lg mx-auto" style={{color: textColorSecondary}}>
                           This helps us personalize the assessment language and questions specifically for your business.
                       </p>
                       <input 
                           type="text" 
                           value={businessName} 
                           onChange={(e) => setBusinessName(e.target.value)} 
                           placeholder="Enter your business name (optional)"
                           className="w-full p-5 rounded-2xl bg-black/40 border-2 focus:ring-4 outline-none text-lg transition-all" 
                           style={{
                             color: textColorPrimary, 
                             borderColor: 'rgba(239,239,234,0.2)', 
                             '--tw-ring-color': `${accentColor}33`,
                             '::placeholder': {color: textColorMuted}
                           }}
                       />
                   </div>
               )}
               
               {assessmentStage === 'initialIndustry' && (
                   <div className="mb-12 sm:mb-16 text-center">
                       <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 tracking-tight" style={{color: textColorPrimary}}>
                          What industry is {businessName || "your business"} in?
                       </h2>
                       <p className="mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{color: textColorSecondary}}>
                           Knowing your industry helps us provide more relevant insights and tailor the assessment questions to your specific context.
                       </p>
                       <select 
                           value={selectedIndustry} 
                           onChange={(e) => setSelectedIndustry(e.target.value)}
                           className="w-full p-5 rounded-2xl bg-black/40 border-2 focus:ring-4 outline-none appearance-none text-lg transition-all"
                           style={{
                             color: textColorPrimary, 
                             borderColor: 'rgba(239,239,234,0.2)', 
                             '--tw-ring-color': `${accentColor}33`,
                             backgroundRepeat: 'no-repeat', 
                             backgroundPosition: `right 1.5rem center`, 
                             backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${accentColor.substring(1)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
                           }}
                       >
                           <option value="" disabled style={{color: textColorMuted}}>Select your industry...</option>
                           {industries.map(industry => (
                               <option key={industry} value={industry} style={{backgroundColor: pageBgColor, color: textColorPrimary}}>{industry}</option>
                           ))}
                       </select>
                   </div>
               )}
           </div>
       </div>
       
       <div className="flex-shrink-0 p-6 sm:p-8 sticky bottom-0 z-10 border-t border-slate-700/50 bg-[#0a0a0a]/90 backdrop-blur-md"> 
           <div className="max-w-4xl mx-auto flex justify-end">
               <button 
                   onClick={handleInitialNext} 
                   disabled={(assessmentStage === 'initialIndustry' && !selectedIndustry)}
                   className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-lg flex items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                   style={{ 
                     background: (assessmentStage === 'initialIndustry' && !selectedIndustry) ? 'rgba(239,239,234,0.1)' : accentColor, 
                     color: (assessmentStage === 'initialIndustry' && !selectedIndustry) ? textColorVeryMuted : popupCtaTextColor, 
                     border: `2px solid ${(assessmentStage === 'initialIndustry' && !selectedIndustry) ? 'rgba(239,239,234,0.1)' : accentColor}`
                   }}
               > 
                   {assessmentStage === 'initialIndustry' ? 'Personalize & Start Assessment' : 'Continue'}
                   <ChevronRight className="w-6 h-6 ml-3" />
               </button>
           </div>
       </div>
     </div>
   );
 }

 if (showResults) {
   const results = calculateResults();

   return (
     <div className="w-full min-h-screen overflow-y-auto bg-[#0a0a0a]" style={{color: textColorPrimary, fontFamily: 'Inter, system-ui, sans-serif'}}>
       <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
         {/* Page Header */}
         <div className="text-center mb-16">
           <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight leading-tight" style={{color: textColorPrimary}}>
               {businessName ? `Your Custom Automation Strategy` : 'Your Custom Automation Strategy'}
           </h1>
           {businessName && <p className="text-xl sm:text-2xl mb-4 font-medium" style={{color: accentColor}}>{businessName}</p>}
           {selectedIndustry && <p className="text-lg mb-6" style={{color: textColorSecondary}}>Industry: {selectedIndustry}</p>}
           <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" style={{color: textColorSecondary}}>
             Discover the potential of AI automation for your business, tailored to your specific needs.
           </p>
         </div>

          {/* Key Metrics Grid */}
         <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
           {/* Time Savings Card */}
           <div className="p-8 rounded-2xl flex flex-col justify-center text-center border border-slate-600/30 hover:border-slate-500/50 transition-all" style={{backgroundColor: 'rgba(30, 41, 59, 0.6)'}}>
             <div className="w-16 h-16 mx-auto rounded-2xl mb-6 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
               <Clock className="w-8 h-8" style={{color: accentColor}} />
             </div>
             <h3 className="text-lg font-semibold mb-2" style={{color: textColorPrimary}}>Time Savings Potential</h3>
             <p className="text-5xl font-bold my-4 tracking-tight" style={{color: accentColor}}>{results.hoursAutomatable}h</p>
             <p className="text-sm" style={{color: textColorMuted}}>Est. weekly hours recoverable</p>
           </div>
           
           {/* Cost Reduction Card */}
           <div className="p-8 rounded-2xl flex flex-col justify-center text-center border border-slate-600/30 hover:border-slate-500/50 transition-all" style={{backgroundColor: 'rgba(51, 65, 85, 0.6)'}}>
             <div className="w-16 h-16 mx-auto rounded-2xl mb-6 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
               <ArrowDownCircle className="w-8 h-8" style={{color: accentColor}} />
             </div>
             <h3 className="text-lg font-semibold mb-2" style={{color: textColorPrimary}}>Monthly Cost Reduction</h3>
             <p className="text-5xl font-bold my-4 tracking-tight" style={{color: accentColor}}>{results.percentageSaving}%</p>
             <div className="text-sm space-y-1" style={{color: textColorMuted}}>
               <p>Current: <span className="font-semibold" style={{color: textColorSecondary}}>${results.currentMonthlyManualCost.toLocaleString()}</span></p>
               <p>With AI: <span className="font-semibold" style={{color: textColorSecondary}}>${results.estimatedMonthlyAutomationCost.toLocaleString()}</span></p>
             </div>
           </div>
           
           {/* ROI Potential Card */}
           <div className="p-8 rounded-2xl flex flex-col justify-center text-center border border-slate-600/30 hover:border-slate-500/50 transition-all" style={{backgroundColor: 'rgba(30, 41, 59, 0.6)'}}>
             <div className="w-16 h-16 mx-auto rounded-2xl mb-6 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
               <TrendingUp className="w-8 h-8" style={{color: accentColor}} />
             </div>
             <h3 className="text-lg font-semibold mb-2" style={{color: textColorPrimary}}>ROI Potential</h3>
             <p className="text-5xl font-bold my-4 tracking-tight" style={{color: accentColor}}>
               {results.roiPercentage > 0 ? `+${results.roiPercentage}%` : (results.roiPercentage === 0 && results.annualSavings > 0) ? 'High' : 'N/A'}
             </p>
             <p className="text-sm" style={{color: textColorMuted}}>
               {results.paybackMonths ? `${results.paybackMonths} month payback` : results.roiPercentage >=0 ? 'Positive outlook' : 'Custom analysis needed'}
             </p>
           </div>
         </div>
         
         {/* Top Automation Opportunities Section */}
         {results.topAutomations && results.topAutomations.length > 0 && (
           <div className="my-16 p-8 rounded-2xl border border-slate-700/50" style={{backgroundColor: 'rgba(30, 41, 59, 0.4)'}}>
             <div className="text-center mb-8">
               <h3 className="text-2xl sm:text-3xl font-semibold mb-3 flex items-center justify-center" style={{color: textColorPrimary}}>
                 <Sparkles className="w-7 h-7 mr-3 text-yellow-400" /> 
                 Top Automation Opportunities
               </h3>
               <p className="text-base" style={{color: textColorSecondary}}>
                 Customized for {businessName || "your business"}
               </p>
             </div>
             <div className="space-y-6 max-w-3xl mx-auto">
               {results.topAutomations.map((automation) => (
                 <div key={automation.id} className="p-6 rounded-xl border flex items-start hover:border-opacity-80 transition-all" style={{backgroundColor: accentColorBgLowOpacity, borderColor: accentColorBorderLowOpacity}}>
                   <div className="flex-shrink-0 mr-5 mt-1">
                     <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                       {automation.icon}
                     </div>
                   </div>
                   <div className="flex-1">
                     <h4 className="text-lg font-semibold mb-2" style={{color: textColorPrimary}}>{automation.title}</h4>
                     <p className="text-sm mb-3 leading-relaxed" style={{color: textColorSecondary}}>{automation.description}</p>
                     <p className="text-sm font-semibold" style={{color: accentColor}}>Est. Time Savings: {automation.timeSavings}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Automation Roadmap Preview Section */}
         <div className="my-12 relative">
           <div className="p-6 sm:p-8 rounded-2xl border border-slate-700/50" style={{backgroundColor: 'rgba(30, 41, 59, 0.4)'}}>
             <h3 className="text-2xl font-semibold mb-8 text-center" style={{color: textColorPrimary}}>
               🛣️ Your Automation Roadmap
             </h3>
             
             <div>
               {/* Phase 1 - Visible Content */}
               <div className="mb-8 relative">
                 <div className="flex items-center mb-6">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{backgroundColor: accentColor, color: '#0A0A0A'}}>
                     <span className="text-sm font-bold">1</span>
                   </div>
                   <h4 className="text-xl font-semibold" style={{color: textColorPrimary}}>Phase 1: Foundation & Quick Wins (Weeks 1-4)</h4>
                 </div>
                 <div className="ml-14 space-y-4 relative">
                   <div className="flex items-start">
                     <CheckCircle className="w-5 h-5 mr-4 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                     <div>
                       <p className="font-medium text-base mb-1" style={{color: textColorPrimary}}>Audit Current Processes</p>
                       <p className="text-sm leading-relaxed" style={{color: textColorSecondary}}>Document and map existing workflows to identify automation opportunities</p>
                     </div>
                   </div>
                   <div className="flex items-start">
                     <CheckCircle className="w-5 h-5 mr-4 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                     <div>
                       <p className="font-medium text-base mb-1" style={{color: textColorPrimary}}>Implement Basic Automations</p>
                       <p className="text-sm leading-relaxed" style={{color: textColorSecondary}}>Start with email automation, calendar scheduling, and simple data entry tasks</p>
                     </div>
                   </div>
                   <div className="flex items-start">
                     <CheckCircle className="w-5 h-5 mr-4 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                     <div>
                       <p className="font-medium text-base mb-1" style={{color: textColorPrimary}}>Team Training & Setup</p>
                       <p className="text-sm leading-relaxed" style={{color: textColorSecondary}}>Onboard team members and establish automation best practices</p>
                     </div>
                   </div>
                   
                   {/* Gradient fade overlay */}
                   <div 
                     className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                     style={{
                       background: 'linear-gradient(to bottom, transparent 0%, rgba(30, 41, 59, 0.4) 60%, rgba(30, 41, 59, 0.95) 100%)'
                     }}
                   ></div>
                 </div>
               </div>

               {/* Blurred Preview of Additional Phases */}
               <div className="relative">
                 <div className="filter blur-sm opacity-60">
                   <div className="mb-6">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{backgroundColor: 'rgba(146, 216, 200, 0.3)', color: textColorMuted}}>
                         <span className="text-sm font-bold">2</span>
                       </div>
                       <h4 className="text-xl font-semibold" style={{color: textColorPrimary}}>Phase 2: Advanced Integration (Weeks 5-8)</h4>
                     </div>
                     <div className="ml-14 space-y-3">
                       <div className="h-4 rounded-md opacity-40" style={{backgroundColor: textColorMuted, width: '80%'}}></div>
                       <div className="h-4 rounded-md opacity-40" style={{backgroundColor: textColorMuted, width: '90%'}}></div>
                       <div className="h-4 rounded-md opacity-40" style={{backgroundColor: textColorMuted, width: '70%'}}></div>
                     </div>
                   </div>
                   
                   <div className="mb-6">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{backgroundColor: 'rgba(146, 216, 200, 0.3)', color: textColorMuted}}>
                         <span className="text-sm font-bold">3</span>
                       </div>
                       <h4 className="text-xl font-semibold" style={{color: textColorPrimary}}>Phase 3: AI & Advanced Systems (Weeks 9-12)</h4>
                     </div>
                     <div className="ml-14 space-y-3">
                       <div className="h-4 rounded-md opacity-40" style={{backgroundColor: textColorMuted, width: '85%'}}></div>
                       <div className="h-4 rounded-md opacity-40" style={{backgroundColor: textColorMuted, width: '75%'}}></div>
                     </div>
                   </div>
                 </div>

                 {/* Unlock Overlay for Roadmap */}
                 <div className="absolute inset-0 flex items-center justify-center p-4">
                   <div className="w-full max-w-md mx-auto" style={{...modalWrapperBaseStyle, maxWidth: '400px'}}>
                     <div className="text-center p-6" style={{...modalContentBaseStyle, background: generalPopupContentBg}}>
                       <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
                         <Eye className="w-8 h-8" style={{color: accentColor}}/>
                       </div>
                       <h3 className="text-lg font-medium mb-3" style={{color: textColorPrimary}}>Complete Roadmap Available</h3>
                       <p className="mb-6 text-sm leading-relaxed" style={{color: textColorSecondary}}>Get the full 12-week implementation plan with detailed timelines and milestones.</p>
                       <button
                         onClick={() => setShowEmailCapture(true)}
                         className="px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center mx-auto hover:opacity-90 shadow-md"
                         style={{background: accentColor, color: '#0A0A0A'}}
                       >
                         <Download className="w-5 h-5 mr-2" />Unlock Full Roadmap
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Call to Action Section */}
         <div style={{...modalWrapperBaseStyle, maxWidth: 'none', padding:'1px'}} className="mx-auto mb-16" >
           <div className="p-8 sm:p-12 rounded-[0.8125rem] text-center" style={{background: generalPopupContentBg, backdropFilter: 'blur(3px)' }}>
             <h3 className="text-2xl sm:text-3xl font-semibold mb-4" style={{color: textColorPrimary}}>Ready to Transform Your Business?</h3>
             <p className="text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{color: textColorSecondary}}>
               Turn analysis into action. Schedule a free strategy call for a tailored implementation plan.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
               <button
                 onClick={() => setShowCalendlyPopup(true)}
                 className="px-8 py-4 rounded-xl font-medium w-full sm:w-auto hover:opacity-90 shadow-lg transition-opacity"
                 style={{background: brighterMainCtaColor, color: popupCtaTextColor }}
               >
                 Schedule Free Strategy Call
               </button>
               <button
                 onClick={() => setShowEmailCapture(true)}
                 className="px-8 py-4 rounded-xl font-medium w-full sm:w-auto border hover:opacity-90 transition-opacity"
                  style={{
                    background: accentColorBgMediumOpacity,
                    color: textColorPrimary,
                    borderColor: accentColor
                  }}
               >
                 Get Full Report
               </button>
             </div>
             <p className="text-sm mt-6" style={{color: textColorVeryMuted}}>Personalized consultation • Custom roadmap • No pressure</p>
           </div>
         </div>

       </div>
     </div>
   );
 }

 // --- Main Assessment Questions Rendering ---
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
       {/* Header with progress bar */}
       <div className="flex-shrink-0 p-6 sm:p-8 sticky top-0 z-10 border-b border-slate-700/50 bg-[#0a0a0a]/90 backdrop-blur-md"> 
         <div className="max-w-5xl mx-auto">
           <div className="flex items-center justify-between mb-6 sm:mb-8">
             <div>
               <h1 className="text-xl sm:text-3xl font-bold tracking-tight" style={{color: textColorPrimary}}>
                 AI Automation Assessment
               </h1>
               {businessName && <p className="text-base sm:text-lg font-medium mt-1" style={{color: accentColor}}>{businessName}</p>}
               <p className="mt-1 text-sm sm:text-base" style={{color: textColorSecondary}}>Industry: {selectedIndustry || "Not Selected"}</p>
             </div>
             <div className="text-right">
               <span className="text-sm font-medium" style={{color: textColorMuted}}>Step {currentStepInDisplayable + 1} of {displayableQuestionsOrder.length || 1}</span>
               <div className="text-xl sm:text-2xl font-bold" style={{color: accentColor}}>{Math.round(((currentStepInDisplayable + 1) / (displayableQuestionsOrder.length || 1)) * 100)}%</div>
             </div>
           </div>
           
           {/* Progress bar */}
           <div className="w-full rounded-full h-2 sm:h-3" style={{backgroundColor: 'rgba(239,239,234,0.15)'}}> 
             <div className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${((currentStepInDisplayable + 1) / (displayableQuestionsOrder.length || 1)) * 100}%`, 
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}33`
                  }} />
           </div>
         </div>
       </div>

       {/* Question content area */}
       <div className="flex-1 overflow-y-auto">
         <div className="max-w-4xl mx-auto p-6 sm:p-8"> 
           <div className="mb-12 sm:mb-16"> 
             <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight" style={{color: textColorPrimary}}>
               {personalizeText(actualCurrentQuestionData.title)}
             </h2>
             
             {actualCurrentQuestionData.subtitle && (
               <p className="mb-6 text-base sm:text-lg leading-relaxed max-w-3xl" style={{color: textColorSecondary}}>
                 {personalizeText(actualCurrentQuestionData.subtitle)}
               </p>
             )}
             
             {contextualHelpText && (
               <div className="mt-4 mb-8 p-4 rounded-xl flex items-start border" style={{backgroundColor: accentColorBgLowOpacity, borderColor: accentColorBorderLowOpacity}}>
                 <HelpCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{color: accentColor}}/>
                 <span className="text-sm leading-relaxed" style={{color: textColorSecondary}}>
                   {personalizeText(contextualHelpText)}
                 </span>
               </div>
             )}
             
             <div className="space-y-4 sm:space-y-5 mt-8"> 
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
                       className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 flex items-center border-2 hover:border-opacity-80 hover:shadow-lg ${isSelected ? 'shadow-lg' : ''}`}
                       style={{ 
                         borderColor: isSelected ? accentColor : 'rgba(239,239,234,0.2)', 
                         backgroundColor: isSelected ? accentColorBgLowOpacity : 'rgba(239,239,234,0.06)', 
                         minHeight: '80px',
                         transform: isSelected ? 'translateY(-2px)' : 'translateY(0)'
                       }}
                     >
                       <input 
                         type={actualCurrentQuestionData.type === 'multiple' ? 'checkbox' : 'radio'} 
                         name={actualCurrentQuestionData.id} 
                         value={option.value} 
                         checked={isSelected} 
                         onChange={() => handleAnswer(actualCurrentQuestionData.id, option.value, actualCurrentQuestionData.type === 'multiple')}
                         className="mr-4 sm:mr-5 mt-0.5 scale-125 flex-shrink-0" 
                         style={{accentColor: accentColor}} 
                       />
                       <div className="flex-1"> 
                         <span className="font-semibold text-base sm:text-lg" style={{color: textColorPrimary}}>
                           {personalizeText(option.label)}
                         </span>
                         {option.description && (
                           <p className="text-sm sm:text-base mt-2 leading-relaxed" style={{color: textColorSecondary}}>
                             {personalizeText(option.description)}
                           </p>
                         )}
                       </div>
                       {isSelected && <CheckCircle className="w-6 h-6 ml-4 flex-shrink-0" style={{color: accentColor}}/>}
                     </div>
                   </label>
                 );
               })}
             </div>
           </div>
         </div>
       </div>

       {/* Navigation buttons */}
       <div className="flex-shrink-0 p-6 sm:p-8 sticky bottom-0 z-10 border-t border-slate-700/50 bg-[#0a0a0a]/90 backdrop-blur-md"> 
         <div className="max-w-5xl mx-auto flex justify-between">
           <button 
             onClick={prevStep} 
             disabled={assessmentStage === 'mainAssessment' && currentStepInDisplayable === 0} 
             className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all border-2 hover:bg-slate-700/30 disabled:opacity-40 disabled:cursor-not-allowed"
             style={{
               backgroundColor: 'rgba(239,239,234,0.08)', 
               borderColor: 'rgba(239,239,234,0.3)',
               color: (assessmentStage === 'mainAssessment' && currentStepInDisplayable === 0) ? textColorVeryMuted : textColorPrimary
             }}
           >
             Previous
           </button>
           
           <button 
             onClick={nextStep} 
             disabled={!isAnswered}
             className="px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold flex items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
             style={{ 
               background: !isAnswered ? 'rgba(239,239,234,0.1)' : accentColor, 
               color: !isAnswered ? textColorVeryMuted : popupCtaTextColor, 
               border: `2px solid ${!isAnswered ? 'rgba(239,239,234,0.1)' : accentColor}`
             }}
           > 
             {currentStepInDisplayable === displayableQuestionsOrder.length - 1 ? 'Get My Analysis' : 'Continue'}
             <ChevronRight className="w-5 h-5 ml-2 sm:ml-3" />
           </button>
         </div>
       </div>
     </div>
   );
 }

 // Fallback initial loading state if no other stage matches
 return (
     <div className="w-full h-screen flex items-center justify-center" style={{backgroundColor: pageBgColor, color: textColorPrimary}}>
       Initializing Assessment...
     </div>
 );

};

export default AutomationOpportunityFinder;
