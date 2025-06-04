import React, { useState } from 'react';
import { ChevronRight, Clock, DollarSign, TrendingUp, CheckCircle, Zap, Eye, Download, Mail, ArrowDownCircle, RefreshCw } from 'lucide-react'; // Added ArrowDownCircle, RefreshCw for new card

const AutomationOpportunityFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [name, setName] = useState('');

  // Define your new accent color here
  const accentColor = '#78ad9f'; // New Teal-like color
  // Opacity versions for backgrounds/borders (hexadecimal: 1A=10%, 26=15%, 33=20%)
  const accentColorBgLowOpacity = accentColor + '1A';
  const accentColorBgMediumOpacity = accentColor + '26';
  const accentColorBorderLowOpacity = accentColor + '33';


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
    const companyData = questions[0].options.find(o => o.value === answers.company_size) || {};
    const complexity = companyData.complexity || 1;
    const weeklyHours = questions[1].options.find(o => o.value === answers.manual_hours)?.hours || 0;
    const painPoint = questions[2].options.find(o => o.value === answers.biggest_pain) || {};
    const automationPct = painPoint.automation || 50;
    const marketingChallenges = answers.marketing_challenges || [];
    const marketingTimeSavings = marketingChallenges.reduce((total, challenge) => {
      const challengeData = questions[3].options.find(o => o.value === challenge);
      return total + (challengeData?.time_savings || 0);
    }, 0);
    const currentTools = answers.current_tools || [];
    const integrationScore = currentTools.reduce((total, tool) => {
      const score = questions[4].options.find(o => o.value === tool)?.integration || 0;
      return total + score;
    }, 0);
    const growthPain = questions[5].options.find(o => o.value === answers.growth_pain) || {};
    const urgency = growthPain.urgency || 50;
    const timelineData = questions[6].options.find(o => o.value === answers.timeline) || {};
    const priority = timelineData.priority || 50;
    const budgetData = questions[7].options.find(o => o.value === answers.budget_sense) || {};
    const budgetMidpoint = budgetData.value ? 
      (parseInt(budgetData.value.split('-')[0].replace(/\D/g, '')) + 
       parseInt(budgetData.value.split('-')[1]?.replace(/\D/g, '') || budgetData.value.replace(/\D/g, ''))) / 2 : 3500;
    
    const baseAutomatableHours = weeklyHours * (automationPct / 100);
    const marketingHoursBonus = marketingChallenges.length > 0 && !marketingChallenges.includes('none') ? 
                                Math.min(marketingTimeSavings * 0.25, 5) : 0;
    const hoursAutomatable = baseAutomatableHours + marketingHoursBonus;
    
    const hourlyRate = 40;
    const weeklyCost = hoursAutomatable * hourlyRate;
    const currentManualMonthlyCost = Math.round(weeklyCost * 4.33); // This is the "Monthly Savings" if all automated for free
    const annualSavingsIfFree = currentManualMonthlyCost * 12;
    
    const scoreComponents = [
        (automationPct * 0.25),
        (urgency * 0.20),
        (priority * 0.20),
        (Math.min(integrationScore, 100) * 0.15),
        (Math.min(weeklyHours / 2.5, 40) * 0.10),
        (marketingChallenges.length > 0 && !marketingChallenges.includes('none') ? 5 : 0)
    ];
    const opportunityScore = Math.min(100, Math.round(scoreComponents.reduce((a, b) => a + b, 0)));
    
    const estimatedMonthlyAutomationCost = budgetMidpoint;
    const netMonthlySavingsFromAutomation = currentManualMonthlyCost - estimatedMonthlyAutomationCost;
    const annualBudgetForAutomation = estimatedMonthlyAutomationCost * 12;
    const netAnnualSavingsFromAutomation = annualSavingsIfFree - annualBudgetForAutomation;
    
    const roiPercentage = annualBudgetForAutomation > 0 ? Math.round((netAnnualSavingsFromAutomation / annualBudgetForAutomation) * 100) : (annualSavingsIfFree > 0 ? 1000 : 0); // High ROI if free and savings exist
    
    let paybackMonths = null;
    if (netMonthlySavingsFromAutomation > 0 && estimatedMonthlyAutomationCost > 0) {
      paybackMonths = Math.round((estimatedMonthlyAutomationCost / netMonthlySavingsFromAutomation) * 10) / 10;
    }

    const percentageSaving = currentManualMonthlyCost > 0 ? Math.round(((currentManualMonthlyCost - estimatedMonthlyAutomationCost) / currentManualMonthlyCost) * 100) : 0;

    return {
      opportunityScore,
      hoursAutomatable: Math.round(hoursAutomatable * 10) / 10,
      marketingTimeSavings,
      currentManualMonthlyCost: currentManualMonthlyCost, // For the new card
      estimatedMonthlyAutomationCost: estimatedMonthlyAutomationCost, // For the new card
      percentageSaving: percentageSaving, // For the new card's big number
      annualSavings: netAnnualSavingsFromAutomation, // Actual net annual savings after automation cost
      roiPercentage: roiPercentage,
      paybackMonths: paybackMonths && paybackMonths > 0 && paybackMonths < 60 ? paybackMonths : null,
      complexity,
      painPoint: painPoint.label,
      growthFocus: growthPain.focus,
      marketingChallenges,
      budgetTier: budgetData.tier,
    };
  };

  const getDetailedRecommendations = (results) => {
    const recommendations = [];
    if (results.painPoint && results.automationPct >= 70) {
      recommendations.push({
        type: 'quickwin', title: `Quick Wins for ${results.painPoint}`, priority: 'high', timeline: '2-4 weeks',
        items: getQuickWinsByPainPoint(results.painPoint), impact: `Up to ${results.automationPct}% efficiency gain in this area`, preview: true
      });
    }
    if (results.marketingChallenges && results.marketingChallenges.length > 0 && !results.marketingChallenges.includes('none')) {
      recommendations.push({
        type: 'marketing', title: 'Marketing & Social Media Automation', priority: 'high', timeline: '3-6 weeks',
        items: getMarketingAutomations(results.marketingChallenges), impact: `Save ~${Math.round(results.marketingTimeSavings * 0.35)}-${Math.round(results.marketingTimeSavings * 0.65)} hrs/week`, preview: true
      });
    }
    if (results.integrationScore >= 50) {
      recommendations.push({
        type: 'integration', title: 'System Integration Opportunities', priority: 'medium', timeline: '1-2 months', 
        items: ['Automate data sync (CRM & Email Marketing)', 'Unified reporting dashboard', 'Cross-system workflow triggers'],
        impact: 'Reduce data silos, improve flow', preview: false 
      });
    }
    if (results.urgency >= 85 && results.growthFocus) {
      recommendations.push({
        type: 'scaling', title: `Advanced Automation for ${results.growthFocus.charAt(0).toUpperCase() + results.growthFocus.slice(1)} Scaling`, priority: 'high', timeline: '1-3 months',
        items: getScalingByGrowthFocus(results.growthFocus), impact: 'Build robust systems for increased load', preview: false
      });
    }
    if (results.budgetTier) {
      recommendations.push({
        type: 'custom', title: `${results.budgetTier.charAt(0).toUpperCase() + results.budgetTier.slice(1)} Tier Solutions`, priority: 'custom', timeline: '2-4 months',
        items: getCustomSolutionsByTier(results.budgetTier, results.painPoint, results.growthFocus), impact: `Tailored strategy for max ROI`, preview: false
      });
    }
    if (recommendations.length === 0) {
        recommendations.push({
            type: 'general', title: 'General Automation Starting Points', priority: 'medium', timeline: '4-8 weeks',
            items: ['Automate repetitive email responses', 'Implement basic task automation', 'Explore AI for content summarization'],
            impact: 'Begin your automation journey.', preview: true
        });
    }
    return recommendations;
  };

  const getMarketingAutomations = (challenges) => {
    const map = { 'content_creation': 'AI-assisted content generation', 'lead_generation': 'Automated lead capture & basic scoring', 'email_sequences': 'Foundational email nurture sequences', 'social_engagement': 'Social media scheduling & monitoring', 'competitor_tracking': 'Automated alerts for competitor news', 'performance_reporting': 'Basic automated marketing KPI dashboard' };
    return challenges.filter(c => c !== 'none').map(c => map[c] || 'Custom marketing process optimization').slice(0, 3);
  };
  const getQuickWinsByPainPoint = (painPoint) => {
    const map = { 'Data entry and file management': ['Automated data extraction (email/PDF)', 'Cloud file organization & tagging', 'Form submission to database/sheet'], 'Customer follow-up and communication': ['Templated email responses', 'Automated appointment reminders', 'Basic website FAQ chatbot'], 'Content creation and social media management': ['AI writing assistant for drafts', 'Social media content scheduling', 'Automated image resizing'], 'Creating reports and dashboards': ['Automated data aggregation', 'Scheduled email delivery of reports', 'Basic KPI dashboard (Sheets)'], 'Lead generation and qualification': ['Automated lead data enrichment', 'Simple lead scoring', 'Auto-assignment of new leads'], 'Scheduling and calendar coordination': ['Use calendar scheduling tools', 'Automated meeting reminders', 'Shared team calendars'] };
    return map[painPoint] || ['Identify one high-frequency manual task', 'Implement shared task management', 'Automate a simple report'];
  };
  const getScalingByGrowthFocus = (growthFocus) => {
    const map = { 'workflow': ['Scalable PM system with auto tasks', 'Automate employee onboarding/offboarding', 'AI-assisted SOP documentation'], 'customer': ['AI chatbot for advanced support', 'Automate customer feedback analysis', 'Personalized communication workflows'], 'marketing': ['AI for predictive lead scoring', 'Automate A/B testing', 'Marketing automation platform for journeys'], 'process': ['End-to-end automation of core process', 'Robotic Process Automation (RPA)', 'Process mining for opportunities'], 'integration': ['Central data warehouse/lake', 'ESB or iPaaS solution', 'Automate data quality checks'] };
    return map[growthFocus] || ['Comprehensive workflow review', 'Strategic AI tool implementation', 'Custom critical system integrations'];
  };
  const getCustomSolutionsByTier = (tier, painPoint, growthFocus) => {
    if (tier === 'starter') return [`Targeted automation for '${painPoint}'`, '1-2 essential automations', 'Monthly optimization report.'];
    if (tier === 'growth') return [`Advanced AI for '${painPoint}' & '${growthFocus}'`, 'Integrate 2-3 key systems', 'Custom dashboard & bi-weekly calls.'];
    if (tier === 'scale') return [`Enterprise automation for '${painPoint}'`, `Scalable AI for '${growthFocus}'`, 'Dedicated specialist & refinement.'];
    if (tier === 'enterprise') return ['Full digital transformation strategy', `Custom AI for '${painPoint}'/'${growthFocus}'`, 'Dedicated team & C-suite reporting.'];
    return ['Tailored automation strategy.'];
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) setCurrentStep(s => s + 1); else setShowResults(true);
    setTimeout(() => document.querySelector('.flex-1.overflow-y-auto')?.scrollTo(0,0), 50);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
    setTimeout(() => document.querySelector('.flex-1.overflow-y-auto')?.scrollTo(0,0), 50);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://www.omivue.com/webhook-test/b7538f67-a5ba-454b-9db6-833f99b87c38', { // Replace with your webhook
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers, results: calculateResults(), timestamp: new Date().toISOString(), source: 'automation-assessment-v3' })
      });
      setShowThankYou(true);
    } catch (error) { console.error('Webhook error:', error); setShowThankYou(true); } // Show thank you even on error for now
  };

  if (showThankYou) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="w-full text-center">
          <div className="p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
            <CheckCircle className="w-12 h-12" style={{color: accentColor}} />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Thank You, {name}!</h2>
          <p className="text-sm mb-6 text-gray-400">Your personalized insights for {email} will arrive shortly.</p>
          <button onClick={() => { setShowThankYou(false); setShowEmailCapture(false); }}
            className="px-6 py-3 rounded-xl font-medium" style={{background: accentColor, color: '#ffffff'}}>
            Back to My Report
          </button>
        </div>
      </div>
    );
  }

  if (showEmailCapture) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif'}}>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
              <Download className="w-10 h-10" style={{color: accentColor}} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Get Your Complete Automation Strategy</h2>
            <p className="text-sm text-gray-400">Enter details for a full report: roadmaps, ROI, tool recommendations.</p>
          </div>
          <div className="p-6 rounded-2xl mb-8 bg-gray-800/30 border border-gray-700/50">
            <h3 className="font-medium text-base mb-4">🎯 Full Report Includes:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {['Roadmap', 'ROI Projections', 'Tool Recommendations', 'Implementation Timeline', 'Risk Checklist', 'Success Metrics'].map(item => (
                 <div key={item} className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" style={{color: accentColor}} />{item}</div>
              ))}
            </div>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input id="nameInput" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                   className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700/60 focus:ring-2 outline-none" style={{borderColor: 'rgba(255,255,255,0.1)', ringColor: accentColor}}/>
            <input id="emailInput" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Business Email"
                   className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700/60 focus:ring-2 outline-none" style={{borderColor: 'rgba(255,255,255,0.1)', ringColor: accentColor}}/>
            <button type="submit" className="w-full py-4 px-8 rounded-xl font-medium flex items-center justify-center hover:opacity-90" style={{background: accentColor, color: '#ffffff'}}>
              <Mail className="w-5 h-5 mr-2" />Send My Report
            </button>
          </form>
          <button onClick={() => setShowEmailCapture(false)} className="w-full mt-3 py-3 rounded-xl font-medium text-sm text-gray-400 border border-gray-700/50 hover:bg-gray-700/30">
            Back to Summary
          </button>
          <p className="text-center text-xs mt-4 text-gray-500">Report emailed in 5 mins. We respect your privacy.</p>
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
      <div className="w-full min-h-screen overflow-y-auto bg-[#0a0a0a] text-white font-['Inter,_system-ui,sans-serif']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight leading-tight">Your Custom Automation Strategy</h1>
            <p className="text-md sm:text-lg max-w-2xl mx-auto text-gray-400 leading-relaxed">Snapshot of AI automation's potential for your business, based on your answers.</p>
          </div>

          {/* --- REVISED TOP CARDS --- */}
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-24">
            {/* Left Card: Hours Saved */}
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-gray-800/30 border border-gray-700/50">
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <Clock className="w-6 h-6" style={{color: accentColor}} />
              </div>
              <h3 className="text-base font-medium mb-1">Time Savings Potential</h3>
              <p className="text-4xl font-semibold my-2 tracking-tight" style={{color: accentColor}}>{results.hoursAutomatable}h</p>
              <p className="text-sm text-gray-400">Est. weekly hours recoverable.</p>
            </div>

            {/* Middle Card: Cost Comparison & % Saving */}
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-gray-800/50 border border-gray-700/70"> {/* Slightly more prominent */}
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <ArrowDownCircle className="w-6 h-6" style={{color: accentColor}} /> {/* Changed Icon */}
              </div>
              <h3 className="text-base font-medium mb-1">Monthly Cost Reduction</h3>
              <p className="text-5xl font-bold my-3 tracking-tighter" style={{color: accentColor}}>{results.percentageSaving}%</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Manual: <span className="font-medium text-gray-300">${results.currentManualMonthlyCost.toLocaleString()}</span></p>
                <p>With AI: <span className="font-medium text-gray-300">${results.estimatedMonthlyAutomationCost.toLocaleString()}</span></p>
              </div>
            </div>
            
            {/* Right Card: ROI Potential */}
            <div className="p-6 rounded-2xl flex flex-col justify-center text-center bg-gray-800/30 border border-gray-700/50">
              <div className="w-12 h-12 mx-auto rounded-xl mb-4 flex items-center justify-center" style={{backgroundColor: accentColorBgMediumOpacity}}>
                <TrendingUp className="w-6 h-6" style={{color: accentColor}} />
              </div>
              <h3 className="text-base font-medium mb-1">ROI Potential</h3>
              <p className="text-4xl font-semibold my-2 tracking-tight" style={{color: accentColor}}>
                {results.roiPercentage > 0 ? `+${results.roiPercentage}%` : (results.roiPercentage === 0 && results.annualSavings > 0) ? 'High' : 'Calc...'}
              </p>
              <p className="text-sm text-gray-400">
                {results.paybackMonths ? `${results.paybackMonths} month payback` : results.roiPercentage >=0 ? 'Positive Outlook' : 'Details in full report'}
              </p>
            </div>
          </div>
          {/* --- END OF REVISED TOP CARDS --- */}

          {previewRecs.length > 0 && (
            <div className="mb-16 sm:mb-20">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center sm:text-left">Top Automation Opportunities (Preview)</h3>
              <div className="space-y-6">
                {previewRecs.map((rec, index) => (
                  <div key={index} className="p-6 sm:p-8 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
                      <div>
                        <h4 className="font-medium text-lg sm:text-xl mb-2 flex items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mr-3`} style={{backgroundColor: rec.priority === 'high' ? accentColor : '#6b7280'}}></div>
                          {rec.title}
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-gray-400">
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" />{rec.timeline}</span>
                          <span className="flex items-center"><Zap className="w-4 h-4 mr-1.5" />{rec.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rec.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="p-4 rounded-xl text-sm" style={{backgroundColor: accentColorBgLowOpacity, border: `1px solid ${accentColorBorderLowOpacity}`}}> {/* Inner box with accent shade */}
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" style={{color: accentColor}} />
                            <span>{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hiddenRecs.length > 0 && (
            <div className="mb-16 sm:mb-20 relative">
              {/* Blurred content slightly more visible */}
              <div className="filter blur-sm pointer-events-none"> 
                <h3 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-center sm:text-left">Advanced & Custom Strategies</h3>
                <div className="space-y-6">
                  {hiddenRecs.slice(0, 2).map((rec, index) => (
                    <div key={index} className="p-6 sm:p-8 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                      <h4 className="font-medium text-lg sm:text-xl mb-2 text-gray-500">{rec.title}</h4>
                      <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Overlay less opaque */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 40%, rgba(10,10,10,0.3) 100%)'}}>
                <div className="text-center p-6 sm:p-8 rounded-2xl max-w-md bg-gray-800/70 border border-gray-700/60 backdrop-blur-sm">
                  <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{background: accentColorBgMediumOpacity}}>
                    <Eye className="w-8 h-8" style={{color: accentColor}}/>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2">Unlock Your Full Potential</h3>
                  <p className="mb-6 text-sm text-gray-300">Get the complete report: detailed strategies, tools, ROI.</p>
                  <button onClick={() => setShowEmailCapture(true)}
                    className="px-6 py-3 rounded-xl font-medium flex items-center mx-auto hover:opacity-90" style={{background: accentColor, color: 'white'}}>
                    <Download className="w-4 h-4 mr-2" />Get My Full Report
                  </button>
                </div>
              </div>
            </div>
          )}
        
          <div className="p-6 sm:p-10 rounded-2xl text-center" style={{background: accentColorBgLowOpacity, border: `1px solid ${accentColorBorderLowOpacity}`}}>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3">Ready to Transform Your Business?</h3>
            <p className="text-sm sm:text-base mb-8 max-w-xl mx-auto text-gray-300 leading-relaxed">
              Turn analysis into action. Schedule a free strategy call for a tailored implementation plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button onClick={() => alert('Schedule Call function to be implemented.')}
                className="px-6 py-3 rounded-xl font-medium w-full sm:w-auto hover:opacity-90" style={{background: accentColor, color: 'white'}}>
                Schedule Free Strategy Call
              </button>
              <button onClick={() => setShowEmailCapture(true)}
                className="px-6 py-3 rounded-xl font-medium w-full sm:w-auto text-white border border-gray-400/40 hover:bg-white/10">
                Download Report Again
              </button>
            </div>
            <p className="text-xs mt-4 text-gray-500">Personalized consultation • Custom roadmap • No pressure</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isAnswered = currentQuestion.type === 'multiple' ? (answers[currentQuestion.id]?.length > 0) : answers[currentQuestion.id];

  return (
    <div className="w-full h-screen flex flex-col bg-[#0a0a0a] text-white font-['Inter,_system-ui,sans-serif']">
      <div className="flex-shrink-0 p-4 sm:p-6 sticky top-0 z-10 border-b border-gray-700/50 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">AI Automation Assessment</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-400">Discover your custom automation potential.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-400">Step {currentStep + 1} of {questions.length}</span>
              <div className="text-lg sm:text-xl font-semibold" style={{color: accentColor}}>{Math.round(((currentStep + 1) / questions.length) * 100)}%</div>
            </div>
          </div>
          <div className="w-full rounded-full h-1.5 sm:h-2 bg-gray-700/50">
            <div className="h-full rounded-full transition-all duration-300"
                 style={{ width: `${((currentStep + 1) / questions.length) * 100}%`, backgroundColor: accentColor }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 tracking-tight">{currentQuestion.title}</h2>
            {currentQuestion.subtitle && <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-400 leading-relaxed">{currentQuestion.subtitle}</p>}
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === 'multiple' ? (answers[currentQuestion.id]?.includes(option.value)) : (answers[currentQuestion.id] === option.value);
                return (
                  <label key={option.value} className="block cursor-pointer group">
                    <div className={`p-4 sm:p-5 rounded-xl transition-all duration-200 flex items-center border hover:border-opacity-70 ${isSelected ? 'shadow-md' : ''}`}
                         style={{ borderColor: isSelected ? accentColor : 'rgba(255,255,255,0.15)', backgroundColor: isSelected ? accentColorBgLowOpacity : 'rgba(255,255,255,0.04)', minHeight: '64px' }}>
                      <input type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'} name={currentQuestion.id} value={option.value} checked={isSelected}
                             onChange={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                             className="mr-3 sm:mr-4 mt-0.5 scale-105 sm:scale-110 flex-shrink-0" style={{accentColor: accentColor}}/>
                      <div className="flex-1">
                        <span className="font-medium text-sm sm:text-base">{option.label}</span>
                        {option.description && <p className="text-xs sm:text-sm mt-1 text-gray-400">{option.description}</p>}
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

      <div className="flex-shrink-0 p-4 sm:p-6 sticky bottom-0 z-10 border-t border-gray-700/50 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button onClick={prevStep} disabled={currentStep === 0}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors border border-gray-600/70 hover:bg-gray-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: 'rgba(255,255,255,0.06)', color: currentStep === 0 ? '#737373' : 'white'}}>
            Previous
          </button>
          <button onClick={nextStep} disabled={!isAnswered}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: !isAnswered ? 'rgba(255,255,255,0.1)' : accentColor, color: !isAnswered ? '#737373' : 'white', border: `1px solid ${!isAnswered ? 'rgba(255,255,255,0.1)' : accentColor}`}}>
            {currentStep === questions.length - 1 ? 'Get My Analysis' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-1.5 sm:ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationOpportunityFinder;
