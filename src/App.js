import React, { useState } from 'react';
import { ChevronRight, Clock, DollarSign, TrendingUp, CheckCircle, Zap, Eye, Download, Mail } from 'lucide-react';

const AutomationOpportunityFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [name, setName] = useState('');

  // Define your accent color here for easy customization
  const accentColor = '#60A5FA'; // Example: A pleasant blue. You can change this.
  const lightAccentColor = '#BFDBFE'; // A lighter shade for borders or less prominent accents

  const questions = [
    {
      id: 'company_size',
      title: 'What\'s your company size?',
      subtitle: 'This helps us understand your operational complexity',
      type: 'select',
      options: [
        { value: '1-10', label: '1-10 employees', complexity: 1.0, avgWage: 45 },
        { value: '11-50', label: '11-50 employees', complexity: 1.2, avgWage: 55 },
        { value: '51-200', label: '51-200 employees', complexity: 1.4, avgWage: 65 },
        { value: '200+', label: '200+ employees', complexity: 1.6, avgWage: 75 }
      ]
    },
    {
      id: 'manual_hours',
      title: 'Approximately how many total hours per week does your company spend on repetitive manual tasks?',
      subtitle: 'Think company-wide: data entry, reporting, follow-ups, scheduling, content creation, etc.',
      type: 'select',
      options: [
        { value: '10-25', label: '10-25 hours per week', hours: 17.5 },
        { value: '26-50', label: '26-50 hours per week', hours: 38 },
        { value: '51-100', label: '51-100 hours per week', hours: 75 },
        { value: '100+', label: '100+ hours per week', hours: 125 }
      ]
    },
    {
      id: 'biggest_pain',
      title: 'What\'s your biggest operational bottleneck right now?',
      subtitle: 'Choose the area causing the most delays or frustration',
      type: 'select',
      options: [
        { value: 'data_entry', label: 'Data entry and file management', automation: 90, impact: 'high', category: 'operations' },
        { value: 'customer_comm', label: 'Customer follow-up and communication', automation: 75, impact: 'high', category: 'customer' },
        { value: 'content_creation', label: 'Content creation and social media management', automation: 85, impact: 'high', category: 'marketing' },
        { value: 'reporting', label: 'Creating reports and dashboards', automation: 95, impact: 'medium', category: 'analytics' },
        { value: 'lead_mgmt', label: 'Lead generation and qualification', automation: 85, impact: 'high', category: 'sales' },
        { value: 'scheduling', label: 'Scheduling and calendar coordination', automation: 80, impact: 'medium', category: 'operations' }
      ]
    },
    {
      id: 'marketing_challenges',
      title: 'Which marketing and social media challenges are slowing you down?',
      subtitle: 'Select all that apply - these represent major automation opportunities',
      type: 'multiple',
      options: [
        { value: 'content_creation', label: 'Creating consistent social media content', automation: 85, time_savings: 15 },
        { value: 'lead_generation', label: 'Generating qualified leads online', automation: 80, time_savings: 20 },
        { value: 'email_sequences', label: 'Setting up email marketing sequences', automation: 90, time_savings: 12 },
        { value: 'social_engagement', label: 'Managing social media engagement and responses', automation: 75, time_savings: 18 },
        { value: 'competitor_tracking', label: 'Tracking competitors and industry trends', automation: 95, time_savings: 8 },
        { value: 'performance_reporting', label: 'Creating marketing performance reports', automation: 90, time_savings: 10 },
        { value: 'none', label: 'Marketing isn\'t a major challenge for us', automation: 0, time_savings: 0 }
      ]
    },
    {
      id: 'current_tools',
      title: 'Which systems does your team currently use?',
      subtitle: 'Select all that apply - more tools often mean more automation opportunities',
      type: 'multiple',
      options: [
        { value: 'crm', label: 'CRM (Salesforce, HubSpot, Pipedrive)', integration: 25, description: 'Great for workflow automation' },
        { value: 'email_marketing', label: 'Email marketing platforms', integration: 20, description: 'Sequence automation potential' },
        { value: 'social_media', label: 'Social media management tools', integration: 30, description: 'Content automation opportunities' },
        { value: 'project_mgmt', label: 'Project management tools (Asana, Monday)', integration: 30, description: 'Task automation opportunities' },
        { value: 'spreadsheets', label: 'Heavy Excel/Google Sheets usage', integration: 35, description: 'High automation potential' },
        { value: 'accounting', label: 'Accounting/ERP software', integration: 25, description: 'Financial process automation' },
        { value: 'basic_only', label: 'Mostly email and basic tools', integration: 10, description: 'Clean slate opportunity' }
      ]
    },
    {
      id: 'growth_pain',
      title: 'What\'s your biggest growth challenge right now?',
      subtitle: 'This helps us prioritize which automations will have the most impact',
      type: 'select',
      options: [
        { value: 'scaling_team', label: 'Can\'t hire and train fast enough', urgency: 90, focus: 'workflow' },
        { value: 'customer_service', label: 'Customer service taking too much time', urgency: 85, focus: 'customer' },
        { value: 'marketing_roi', label: 'Marketing not generating enough quality leads', urgency: 88, focus: 'marketing' },
        { value: 'manual_processes', label: 'Manual processes slowing everything down', urgency: 95, focus: 'process' },
        { value: 'data_chaos', label: 'Information scattered across systems', urgency: 80, focus: 'integration' }
      ]
    },
    {
      id: 'timeline',
      title: 'When are you looking to implement automation solutions?',
      subtitle: 'Honest timeline helps us suggest the right approach',
      type: 'select',
      options: [
        { value: 'asap', label: 'ASAP - this is urgent', priority: 100, timeline: 'immediate' },
        { value: '1-3months', label: 'Within 1-3 months', priority: 80, timeline: 'near' },
        { value: '3-6months', label: '3-6 months out', priority: 60, timeline: 'medium' },
        { value: 'exploring', label: 'Just exploring options for now', priority: 30, timeline: 'future' }
      ]
    },
    {
      id: 'budget_sense',
      title: 'What\'s your sense of monthly budget for automation solutions?',
      subtitle: 'This helps us recommend the right scope of automation',
      type: 'select',
      options: [
        { value: '800-2500', label: '$800 - $2,500/month', tier: 'starter', description: '~1-2 virtual specialists working 24/7' },
        { value: '2500-6000', label: '$2,500 - $6,000/month', tier: 'growth', description: '~2-3 virtual specialists handling core processes' },
        { value: '6000-15000', label: '$6,000 - $15,000/month', tier: 'scale', description: '~3-5 virtual specialists across departments' },
        { value: '15000+', label: '$15,000+/month', tier: 'enterprise', description: 'Full virtual workforce for complex operations' }
      ]
    }
  ];

  const handleAnswer = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const calculateResults = () => {
    // Get company data
    const companyData = questions[0].options.find(o => o.value === answers.company_size) || {};
    const complexity = companyData.complexity || 1;
    
    // Get hours data
    const weeklyHours = questions[1].options.find(o => o.value === answers.manual_hours)?.hours || 0;
    
    // Get automation potential
    const painPoint = questions[2].options.find(o => o.value === answers.biggest_pain) || {};
    const automationPct = painPoint.automation || 50;
    
    // Get marketing automation potential
    const marketingChallenges = answers.marketing_challenges || [];
    const marketingTimeSavings = marketingChallenges.reduce((total, challenge) => {
      const challengeData = questions[3].options.find(o => o.value === challenge);
      return total + (challengeData?.time_savings || 0);
    }, 0);
    
    // Get tool integration score
    const currentTools = answers.current_tools || [];
    const integrationScore = currentTools.reduce((total, tool) => {
      const score = questions[4].options.find(o => o.value === tool)?.integration || 0;
      return total + score;
    }, 0);
    
    // Get urgency and timeline
    const growthPain = questions[5].options.find(o => o.value === answers.growth_pain) || {};
    const urgency = growthPain.urgency || 50;
    
    const timelineData = questions[6].options.find(o => o.value === answers.timeline) || {};
    const priority = timelineData.priority || 50;
    
    // Get budget info
    const budgetData = questions[7].options.find(o => o.value === answers.budget_sense) || {};
    const budgetMidpoint = budgetData.value ? 
      (parseInt(budgetData.value.split('-')[0].replace(/\D/g, '')) + 
       parseInt(budgetData.value.split('-')[1]?.replace(/\D/g, '') || budgetData.value.replace(/\D/g, ''))) / 2 : 3500;
    
    // Simplified calculation for automatable hours
    const baseAutomatableHours = weeklyHours * (automationPct / 100);
    const marketingHoursBonus = marketingChallenges.length > 0 && !marketingChallenges.includes('none') ? 
                                Math.min(marketingTimeSavings * 0.25, 5) : 0; // Cap marketing bonus
    const hoursAutomatable = baseAutomatableHours + marketingHoursBonus;
    
    const hourlyRate = 40; // Baseline hourly rate for manual work
    const weeklyCost = hoursAutomatable * hourlyRate;
    const monthlySavings = Math.round(weeklyCost * 4.33);
    const annualSavings = monthlySavings * 12;
    
    // Opportunity Score Calculation
    const scoreComponents = [
        (automationPct * 0.25),          // 25% - Automation potential of biggest pain
        (urgency * 0.20),                // 20% - Business urgency from growth pain
        (priority * 0.20),               // 20% - Implementation timeline priority
        (Math.min(integrationScore, 100) * 0.15), // 15% - Integration opportunities from current tools
        (Math.min(weeklyHours / 2.5, 40) * 0.10),  // 10% - Volume of manual work (capped contribution)
        (marketingChallenges.length > 0 && !marketingChallenges.includes('none') ? 5 : 0) // Bonus for marketing challenges
    ];
    const opportunityScore = Math.min(100, Math.round(scoreComponents.reduce((a, b) => a + b, 0)));
    
    // ROI and Payback
    const estimatedMonthlyAutomationCost = budgetMidpoint; // Use midpoint of selected budget
    const netMonthlySavings = monthlySavings - estimatedMonthlyAutomationCost;
    const annualBudget = estimatedMonthlyAutomationCost * 12;
    const netAnnualSavings = annualSavings - annualBudget;
    const roiPercentage = annualBudget > 0 ? Math.round((netAnnualSavings / annualBudget) * 100) : (annualSavings > 0 ? 100 : 0); // If no budget, but savings, ROI is high
    
    let paybackMonths = null;
    if (netMonthlySavings > 0) {
      paybackMonths = Math.round((estimatedMonthlyAutomationCost / netMonthlySavings) * 10) / 10;
    }

    return {
      opportunityScore,
      hoursAutomatable: Math.round(hoursAutomatable * 10) / 10,
      marketingTimeSavings, // Keep this for specific marketing recommendations
      weeklySavings: Math.round(weeklyCost),
      monthlySavings: monthlySavings,
      annualSavings: annualSavings,
      automationPct,
      urgency,
      priority,
      integrationScore,
      roiPercentage: roiPercentage,
      paybackMonths: paybackMonths && paybackMonths > 0 && paybackMonths < 60 ? paybackMonths : null, // Extended payback cap
      complexity,
      painPoint: painPoint.label,
      growthFocus: growthPain.focus,
      marketingChallenges,
      budgetTier: budgetData.tier,
      budgetMidpoint // For display or further use
    };
  };


  const getDetailedRecommendations = (results) => {
    const recommendations = [];
    
    if (results.painPoint && results.automationPct >= 70) {
      recommendations.push({
        type: 'quickwin',
        title: `Quick Wins for ${results.painPoint}`,
        priority: 'high',
        timeline: '2-4 weeks',
        items: getQuickWinsByPainPoint(results.painPoint),
        impact: `Up to ${results.automationPct}% efficiency gain in this area`,
        preview: true
      });
    }
    
    if (results.marketingChallenges && results.marketingChallenges.length > 0 && !results.marketingChallenges.includes('none')) {
      recommendations.push({
        type: 'marketing',
        title: 'Marketing & Social Media Automation',
        priority: 'high',
        timeline: '3-6 weeks',
        items: getMarketingAutomations(results.marketingChallenges),
        impact: `Save ~${Math.round(results.marketingTimeSavings * 0.35)}-${Math.round(results.marketingTimeSavings * 0.65)} hrs/week on marketing tasks`, // More realistic range
        preview: true
      });
    }
    
    if (results.integrationScore >= 50) { // Increased threshold for more impactful integrations
      recommendations.push({
        type: 'integration',
        title: 'System Integration Opportunities',
        priority: 'medium',
        timeline: '1-2 months', 
        items: ['Automate data synchronization between key platforms (e.g., CRM & Email Marketing)', 'Create a unified reporting dashboard from multiple sources', 'Implement cross-system workflow triggers for key processes'],
        impact: 'Reduce data silos and improve operational flow',
        preview: false 
      });
    }
    
    if (results.urgency >= 85 && results.growthFocus) { // Higher urgency for scaling
      recommendations.push({
        type: 'scaling',
        title: `Advanced Automation for ${results.growthFocus.charAt(0).toUpperCase() + results.growthFocus.slice(1)} Scaling`,
        priority: 'high',
        timeline: '1-3 months',
        items: getScalingByGrowthFocus(results.growthFocus),
        impact: 'Build robust systems to handle increased operational load',
        preview: false
      });
    }

    if (results.budgetTier) {
      recommendations.push({
        type: 'custom',
        title: `${results.budgetTier.charAt(0).toUpperCase() + results.budgetTier.slice(1)} Tier Solutions`,
        priority: 'custom',
        timeline: '2-4 months',
        items: getCustomSolutionsByTier(results.budgetTier, results.painPoint, results.growthFocus),
        impact: `Tailored strategy to maximize ROI within your ${results.budgetTier} budget`,
        preview: false
      });
    }
     if (recommendations.length === 0) {
        recommendations.push({
            type: 'general',
            title: 'General Automation Starting Points',
            priority: 'medium',
            timeline: '4-8 weeks',
            items: [
                'Automate repetitive email responses and follow-ups.',
                'Implement basic task management automation.',
                'Explore AI tools for content summarization or idea generation.'
            ],
            impact: 'Begin your automation journey with foundational improvements.',
            preview: true
        });
    }


    return recommendations;
  };

  const getMarketingAutomations = (challenges) => {
    const automationMap = {
      'content_creation': 'AI-assisted content generation & repurposing workflows',
      'lead_generation': 'Automated lead capture from website/socials into CRM with basic scoring', 
      'email_sequences': 'Setup of foundational email nurture sequences for new leads/customers',
      'social_engagement': 'Social media scheduling and basic engagement monitoring tools',
      'competitor_tracking': 'Automated alerts for competitor mentions or key industry news',
      'performance_reporting': 'Basic automated marketing KPI dashboard setup'
    };
    
    return challenges.filter(c => c !== 'none').map(challenge => 
      automationMap[challenge] || 'Custom marketing process optimization'
    ).slice(0, 3);
  };

  const getQuickWinsByPainPoint = (painPoint) => {
    const quickWins = {
      'Data entry and file management': ['Automated data extraction from emails/PDFs to spreadsheets', 'Cloud-based file organization with automated tagging', 'Form submission to database/spreadsheet automation'],
      'Customer follow-up and communication': ['Templated email responses for common inquiries', 'Automated appointment reminders', 'Basic chatbot for website FAQs'],
      'Content creation and social media management': ['AI writing assistant for first drafts', 'Social media content scheduling tools', 'Automated image resizing/formatting for different platforms'],
      'Creating reports and dashboards': ['Automated data aggregation into a central spreadsheet', 'Scheduled email delivery of key metrics reports', 'Basic KPI dashboard using Google Sheets or similar'],
      'Lead generation and qualification': ['Automated lead data enrichment (e.g., company size from email)', 'Simple lead scoring based on engagement', 'Automated assignment of new leads to sales team members'],
      'Scheduling and calendar coordination': ['Use of calendar scheduling tools (e.g., Calendly)', 'Automated meeting reminders for attendees', 'Shared team calendars for visibility']
    };
    return quickWins[painPoint] || ['Identify and automate one high-frequency manual task', 'Implement a shared task management tool with basic automation', 'Automate a simple reporting process'];
  };

  const getScalingByGrowthFocus = (growthFocus) => {
    const scalingMap = {
      'workflow': ['Implement a scalable project management system with automated task assignments and progress tracking', 'Automate employee onboarding and offboarding checklists', 'Develop standardized operating procedures (SOPs) with AI-assisted documentation'],
      'customer': ['Deploy an AI-powered chatbot for advanced customer support and triage', 'Automate customer feedback collection and analysis', 'Implement personalized communication workflows based on customer behavior'],
      'marketing': ['Utilize AI for predictive lead scoring and audience segmentation', 'Automate A/B testing for marketing campaigns', 'Implement marketing automation platform for complex customer journeys'],
      'process': ['End-to-end automation of a core business process (e.g., order fulfillment, invoicing)', 'Implement robotic process automation (RPA) for rule-based tasks', 'Use process mining tools to identify further automation opportunities'],
      'integration': ['Develop a central data warehouse or data lake', 'Implement an enterprise service bus (ESB) or iPaaS solution for robust integrations', 'Automate data quality checks and cleansing processes']
    };
    return scalingMap[growthFocus] || ['Comprehensive review of current workflows for automation potential', 'Strategic implementation of AI tools to enhance core operations', 'Development of custom integrations between critical systems'];
  };

  const getCustomSolutionsByTier = (tier, painPoint, growthFocus) => {
    let items = [];
    if (tier === 'starter') {
      items = [
        `Targeted automation for '${painPoint}' using cost-effective tools.`,
        'Setup of 1-2 essential marketing or operational automations.',
        'Monthly check-in and basic optimization report.'
      ];
    } else if (tier === 'growth') {
      items = [
        `Advanced AI solutions for '${painPoint}' and '${growthFocus}'.`,
        'Integration of 2-3 key systems (e.g., CRM, Email, Project Management).',
        'Custom performance dashboard and bi-weekly strategy calls.'
      ];
    } else if (tier === 'scale') {
      items = [
        `Enterprise-grade automation platform implementation for '${painPoint}'.`,
        `Scalable AI workflows supporting multiple aspects of '${growthFocus}'.`,
        'Dedicated automation specialist and ongoing process refinement.'
      ];
    } else if (tier === 'enterprise') {
      items = [
        'Full digital transformation strategy focused on AI and automation.',
        `Custom AI model development for unique challenges related to '${painPoint}' or '${growthFocus}'.`,
        'Dedicated implementation team and C-suite level reporting.'
      ];
    }
    return items.length > 0 ? items : ['Tailored automation strategy based on your specific needs and budget.'];
  };


  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of question area if needed (optional)
      setTimeout(() => {
        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }, 50);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      }, 50);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // IMPORTANT: Replace with your actual webhook URL or backend endpoint
      await fetch('https://www.omivue.com/webhook-test/b7538f67-a5ba-454b-9db6-833f99b87c38', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          answers: answers,
          results: calculateResults(), // Send calculated results
          timestamp: new Date().toISOString(),
          source: 'automation-assessment-tool'
        })
      });

      setShowThankYou(true); // Show thank you message on success
      
    } catch (error) {
      console.error('Error sending data to webhook:', error);
      // Optionally, show an error message to the user here
      setShowThankYou(true); // Still show thank you, or a specific error state
    }
  };

  if (showThankYou) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
        <div className="w-full text-center">
          <div className="p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{background: accentColor+'33'}}> {/* Accent with opacity */}
            <CheckCircle className="w-12 h-12" style={{color: accentColor}} />
          </div>
          <h2 className="text-2xl font-semibold mb-4" style={{color: '#ffffff'}}>Thank You, {name}!</h2>
          <p className="text-sm mb-6 font-normal" style={{color: '#737373'}}>Your personalized automation insights will be sent to {email} shortly. Keep an eye on your inbox!</p>
          <button
            onClick={() => {
              setShowThankYou(false);
              setShowEmailCapture(false); // Go back to results, not email form
              // Not resetting email/name here so user can see what they submitted if they go back
            }}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-200"
            style={{background: accentColor, color: '#ffffff'}}
          >
            Back to My Report
          </button>
        </div>
      </div>
    );
  }

  if (showEmailCapture) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{background: accentColor+'33'}}>
              <Download className="w-10 h-10" style={{color: accentColor}} />
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{color: '#ffffff'}}>Get Your Complete Automation Strategy</h2>
            <p className="text-sm font-normal" style={{color: '#737373'}}>Enter your details to receive a comprehensive report with implementation roadmaps, ROI projections, and specific tool recommendations.</p>
          </div>

          <div className="p-6 rounded-2xl mb-8" style={{background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)'}}>
            <h3 className="font-medium text-base mb-4" style={{color: '#ffffff'}}>🎯 Your Full Report Includes:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {['Detailed Automation Roadmap', 'Quarterly ROI Projections', 'Top Tool Recommendations', 'Step-by-Step Implementation Timeline', 'Risk Mitigation Checklist', 'Key Success Metrics to Track'].map(item => (
                 <div key={item} className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{color: accentColor}} />{item}</div>
              ))}
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="nameInput" className="block text-sm font-medium mb-2" style={{color: '#ffffff'}}>Full Name *</label>
              <input
                id="nameInput"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl focus:ring-2 focus:outline-none"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.1)', ringColor: accentColor}}
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="emailInput" className="block text-sm font-medium mb-2" style={{color: '#ffffff'}}>Business Email *</label>
              <input
                id="emailInput"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl focus:ring-2 focus:outline-none"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.1)', ringColor: accentColor}}
                placeholder="your.email@company.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-xl font-medium transition-colors flex items-center justify-center hover:opacity-90"
              style={{background: accentColor, color: '#ffffff'}}
            >
              <Mail className="w-5 h-5 mr-2" />
              Send My Complete Report
            </button>
          </form>
          <button
              onClick={() => setShowEmailCapture(false)}
              className="w-full mt-3 py-3 px-8 rounded-xl font-medium transition-colors text-sm"
              style={{background: 'transparent', color: '#a3a3a3', border: '1px solid rgba(255,255,255,0.1)'}}
            >
              Back to Summary
            </button>

          <p className="text-center text-xs mt-4 font-normal" style={{color: '#a3a3a3'}}>
            We respect your privacy. Your report will be emailed within 5 minutes.
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const recommendations = getDetailedRecommendations(results);
    const previewRecommendations = recommendations.filter(rec => rec.preview);
    const hiddenRecommendations = recommendations.filter(rec => !rec.preview);
    
    return (
      <div className="w-full min-h-screen overflow-y-auto" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"> {/* Responsive padding */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6" style={{color: '#ffffff', letterSpacing: '-0.025em', lineHeight: '1.1'}}>Your Custom Automation Strategy</h1>
            <p className="text-md sm:text-lg max-w-2xl mx-auto font-normal" style={{color: '#737373', lineHeight: '1.6'}}>Based on your answers, here's a snapshot of what AI automation could achieve for your business.</p>
          </div>

        {/* Key Metrics Section - Adjusted for better symmetry and readability */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 sm:mb-24">
          {/* Time Savings Card */}
          <div className="p-6 sm:p-8 rounded-2xl flex flex-col justify-center text-center" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)'}}>
            <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColor+'26'}}>
              <Clock className="w-6 h-6" style={{color: accentColor}} />
            </div>
            <h3 className="text-base font-medium mb-1" style={{color: '#ffffff'}}>Time Savings Potential</h3>
            <p className="text-4xl font-semibold my-2" style={{color: accentColor, letterSpacing: '-0.02em'}}>{results.hoursAutomatable}h</p>
            <p className="text-sm font-normal" style={{color: '#a3a3a3'}}>Estimated hours per week recoverable through automation.</p>
          </div>

          {/* Cost Savings / ROI Card - Combined for impact */}
          <div className="p-6 sm:p-8 rounded-2xl flex flex-col justify-center text-center md:col-span-1" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)'}}>
            <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColor+'33'}}>
              <DollarSign className="w-6 h-6" style={{color: accentColor}} />
            </div>
            <h3 className="text-base font-medium mb-1" style={{color: '#ffffff'}}>Financial Impact</h3>
             <p className="text-4xl font-semibold my-2" style={{color: accentColor, letterSpacing: '-0.02em'}}>
                {results.roiPercentage > 0 ? `+${results.roiPercentage}% ROI` : 
                 (results.roiPercentage === 0 && results.annualSavings > 0) ? 'Significant ROI' :
                 results.roiPercentage < 0 ? `Analysis Needed` : 'Positive Impact'}
            </p>
            <p className="text-sm font-normal" style={{color: '#a3a3a3'}}>
              Projected return on investment. Monthly savings: <span style={{color: '#ffffff'}}>${results.monthlySavings.toLocaleString()}</span>.
              {results.paybackMonths && <span className="block mt-1">{results.paybackMonths} month payback period.</span>}
            </p>
          </div>
          
          {/* Opportunity Score Card */}
          <div className="p-6 sm:p-8 rounded-2xl flex flex-col justify-center text-center" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)'}}>
            <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColor+'26'}}>
              <TrendingUp className="w-6 h-6" style={{color: accentColor}} />
            </div>
            <h3 className="text-base font-medium mb-1" style={{color: '#ffffff'}}>Automation Opportunity Score</h3>
            <p className="text-4xl font-semibold my-2" style={{color: accentColor, letterSpacing: '-0.02em'}}>{results.opportunityScore}/100</p>
            <p className="text-sm font-normal" style={{color: '#a3a3a3'}}>Your overall potential and readiness for AI automation.</p>
          </div>
        </div>


        {/* Recommendations Section */}
        {previewRecommendations.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center sm:text-left" style={{color: '#ffffff'}}>Top Automation Opportunities (Preview)</h3>
            <div className="space-y-6">
              {previewRecommendations.map((rec, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-2xl transition-colors" style={{background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)'}}>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h4 className="font-medium text-lg sm:text-xl mb-2 flex items-center" style={{color: '#ffffff'}}>
                        <div className={`w-2.5 h-2.5 rounded-full mr-3`} style={{backgroundColor: rec.priority === 'high' ? accentColor : '#737373'}}></div>
                        {rec.title}
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm" style={{color: '#737373'}}>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />{rec.timeline}</span>
                        <span className="flex items-center"><Zap className="w-4 h-4 mr-2" />{rec.impact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rec.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="p-4 rounded-xl text-sm" style={{background: 'rgba(255, 255, 255, 0.04)'}}>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                          <span style={{color: '#ffffff'}}>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blurred Section for Hidden Recommendations */}
        {hiddenRecommendations.length > 0 && (
          <div className="mb-16 sm:mb-20 relative">
            <div className="filter blur-md pointer-events-none"> {/* Increased blur */}
              <h3 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center sm:text-left" style={{color: '#ffffff'}}>Advanced & Custom Strategies</h3>
              <div className="space-y-6">
                {hiddenRecommendations.slice(0, 2).map((rec, index) => ( // Show a couple blurred
                  <div key={index} className="p-6 sm:p-8 rounded-2xl" style={{background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)'}}>
                    {/* Simplified content for blurred state */}
                    <h4 className="font-medium text-lg sm:text-xl mb-2" style={{color: '#737373'}}>{rec.title}</h4>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{background: 'linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(10,10,10,0.6) 100%)'}}>
              <div className="text-center p-6 sm:p-8 rounded-2xl max-w-md" style={{background: 'rgba(30, 30, 30, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)'}}>
                <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{background: accentColor+'33'}}>
                  <Eye className="w-8 h-8" style={{color: accentColor}}/>
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-2" style={{color: '#ffffff'}}>Unlock Your Full Automation Potential</h3>
                <p className="mb-6 text-sm" style={{color: '#a3a3a3'}}>Get the complete, personalized report with detailed strategies, tool recommendations, and ROI breakdowns.</p>
                <button
                  onClick={() => setShowEmailCapture(true)}
                  className="px-6 py-3 rounded-xl font-medium transition-colors flex items-center mx-auto hover:opacity-90"
                  style={{background: accentColor, color: '#ffffff'}}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Get My Full Report
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Final CTA Section */}
        <div className="p-6 sm:p-10 rounded-2xl text-white text-center" style={{background: accentColor+'1A', border: `1px solid ${accentColor}33`}}>
          <h3 className="text-xl sm:text-2xl font-semibold mb-3" style={{color: '#ffffff'}}>Ready to Transform Your Business with AI?</h3>
          <p className="text-sm sm:text-base mb-8 max-w-xl mx-auto font-normal" style={{color: '#d1d5db', lineHeight: '1.5'}}>
            Let's turn this analysis into action. Schedule a free, no-obligation strategy call to discuss a tailored implementation plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => { /* Placeholder for actual scheduling link/modal */ alert('Schedule Call functionality to be implemented.'); }}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 w-full sm:w-auto" 
              style={{background: accentColor, color: '#ffffff'}}
            >
              Schedule Free Strategy Call
            </button>
            <button 
              onClick={() => setShowEmailCapture(true)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-white/10 w-full sm:w-auto"
              style={{background: 'transparent', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)'}}
            >
              Download Full Report Again
            </button>
          </div>
          <p className="text-xs mt-4 font-normal" style={{color: '#a3a3a3'}}>Personalized consultation • Custom roadmap discussion • No pressure</p>
        </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isAnswered = currentQuestion.type === 'multiple' 
    ? (answers[currentQuestion.id] && answers[currentQuestion.id].length > 0)
    : answers[currentQuestion.id];

  return (
    <div className="w-full h-screen flex flex-col" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
      {/* Header with Progress */}
      <div className="flex-shrink-0 p-4 sm:p-6 sticky top-0 z-10" style={{borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(10px)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold" style={{color: '#ffffff', letterSpacing: '-0.01em'}}>AI Automation Assessment</h1>
              <p className="mt-1 text-xs sm:text-sm font-normal" style={{color: '#737373'}}>Discover your custom automation potential.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium" style={{color: '#a3a3a3'}}>Step {currentStep + 1} of {questions.length}</span>
              <div className="text-lg sm:text-xl font-semibold" style={{color: accentColor}}>{Math.round(((currentStep + 1) / questions.length) * 100)}%</div>
            </div>
          </div>
          <div className="w-full rounded-full h-1.5 sm:h-2" style={{backgroundColor: 'rgba(255,255,255,0.08)'}}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentStep + 1) / questions.length) * 100}%`,
                backgroundColor: accentColor // Use accent color for progress
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6"> {/* Slightly reduced max-width for question area */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3" style={{color: '#ffffff', letterSpacing: '-0.01em'}}>{currentQuestion.title}</h2>
            {currentQuestion.subtitle && (
              <p className="mb-6 sm:mb-8 text-sm sm:text-base font-normal" style={{color: '#737373', lineHeight: '1.6'}}>{currentQuestion.subtitle}</p>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentQuestion.type === 'multiple'
                  ? (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option.value))
                  : answers[currentQuestion.id] === option.value;
                
                return (
                  <label key={index} className="block cursor-pointer group">
                    <div 
                      className={`p-4 sm:p-5 rounded-xl transition-all duration-200 flex items-center group-hover:bg-opacity-20 ${
                        isSelected ? 'transform translate-x-0.5 sm:translate-x-1 shadow-md' : '' // Subtle transform and shadow
                      }`}
                      style={{
                        border: '1px solid',
                        borderColor: isSelected ? accentColor : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: isSelected ? accentColor+'26' : 'rgba(255, 255, 255, 0.03)', // Accent with opacity for selected
                        minHeight: '64px', // Adjusted min height
                      }}
                    >
                      <input
                        type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                        name={currentQuestion.id}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                        className="mr-3 sm:mr-4 mt-0.5 scale-105 sm:scale-110 flex-shrink-0"
                        style={{accentColor: accentColor}} // Use accent color for checkbox/radio itself
                      />
                      <div className="flex-1">
                        <span className="font-medium text-sm sm:text-base" style={{color: '#ffffff'}}>{option.label}</span>
                        {option.description && (
                          <p className="text-xs sm:text-sm mt-1 font-normal" style={{color: '#a3a3a3'}}>{option.description}</p>
                        )}
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

      {/* Footer Navigation */}
      <div className="flex-shrink-0 p-4 sm:p-6 sticky bottom-0 z-10" style={{borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(10px)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/10'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: currentStep === 0 ? '#737373' : '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={!isAnswered}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center transition-all duration-200 ${
                !isAnswered ? 'cursor-not-allowed opacity-50' : `hover:opacity-90`
              }`}
              style={{
                background: !isAnswered ? 'rgba(255, 255, 255, 0.08)' : accentColor, // Use accent color for active button
                color: !isAnswered ? '#737373' : '#ffffff', // White text on accent color
                border: !isAnswered ? '1px solid rgba(255, 255, 255, 0.1)' : `1px solid ${accentColor}`
              }}
            >
              {currentStep === questions.length - 1 ? 'Get My Custom Analysis' : 'Continue'}
              <ChevronRight className="w-5 h-5 ml-1.5 sm:ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationOpportunityFinder;
