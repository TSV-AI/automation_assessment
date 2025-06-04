import React, { useState } from 'react';
import { ChevronRight, Clock, DollarSign, Users, TrendingUp, CheckCircle, AlertCircle, Zap, Target, Eye, EyeOff, Download, Mail } from 'lucide-react';

const AutomationOpportunityFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

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
        { value: '2000-8000', label: '$2,000 - $8,000/month', tier: 'starter' },
        { value: '8000-20000', label: '$8,000 - $20,000/month', tier: 'growth' },
        { value: '20000-50000', label: '$20,000 - $50,000/month', tier: 'scale' },
        { value: '50000+', label: '$50,000+/month', tier: 'enterprise' }
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
    const avgWage = companyData.avgWage || 50;
    
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
    
    const timeline = questions[6].options.find(o => o.value === answers.timeline) || {};
    const priority = timeline.priority || 50;
    
    // CONSERVATIVE REALISTIC CALCULATIONS
    // Cap automation at 60% of total reported hours (more realistic)
    const maxAutomatableHours = weeklyHours * 0.6;
    const effectiveHours = Math.min(weeklyHours * (automationPct / 100), maxAutomatableHours);
    
    // Cap marketing time savings (prevent over-promising)
    const marketingHours = Math.min(marketingTimeSavings * 0.4, 8); // Max 8 hours/week from marketing
    
    // Total realistic automatable hours
    const hoursAutomatable = effectiveHours + marketingHours;
    
    // Base weekly savings with conservative hourly rate
    const conservativeWage = avgWage * 0.85; // 15% discount for realistic costing
    const baseSavings = hoursAutomatable * conservativeWage;
    
    // Apply modest complexity factor
    const complexitySavings = baseSavings * complexity;
    
    // Monthly and annual projections
    const monthlySavings = complexitySavings * 4.33;
    const annualSavings = monthlySavings * 12;
    
    // Calculate opportunity score with better weighting
    const marketingBonus = marketingChallenges.length > 0 && !marketingChallenges.includes('none') ? 15 : 0;
    const opportunityScore = Math.min(100, Math.round(
      (automationPct * 0.25) +           // 25% - automation potential
      (urgency * 0.25) +                 // 25% - business urgency  
      (priority * 0.25) +                // 25% - implementation timeline
      (Math.min(integrationScore, 100) * 0.15) + // 15% - integration opportunities
      (Math.min(weeklyHours / 2, 50) * 0.10) +   // 10% - volume of work
      marketingBonus                     // Bonus for marketing automation needs
    ));
    
    // ROI calculation based on typical implementation costs
    const budgetData = questions[7].options.find(o => o.value === answers.budget_sense) || {};
    const budgetMidpoint = budgetData.value ? 
      (parseInt(budgetData.value.split('-')[0].replace(/\D/g, '')) + 
       parseInt(budgetData.value.split('-')[1]?.replace(/\D/g, '') || budgetData.value.replace(/\D/g, ''))) / 2 : 15000;
    
    // Calculate ROI properly: (savings - costs) / costs * 100
    const annualBudget = budgetMidpoint * 12;
    const netAnnualSavings = annualSavings - annualBudget;
    const roiPercentage = annualBudget > 0 ? Math.round((netAnnualSavings / annualBudget) * 100) : 0;
    
    // Payback period: how many months to recover investment
    const paybackMonths = monthlySavings > 0 ? Math.round((budgetMidpoint / monthlySavings) * 10) / 10 : null;

    return {
      opportunityScore,
      hoursAutomatable: Math.round(hoursAutomatable * 10) / 10,
      marketingTimeSavings,
      weeklySavings: Math.round(complexitySavings),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      automationPct,
      urgency,
      priority,
      integrationScore,
      roiPercentage: roiPercentage,
      paybackMonths: paybackMonths && paybackMonths > 0 && paybackMonths < 36 ? paybackMonths : null,
      complexity,
      painPoint: painPoint.label,
      growthFocus: growthPain.focus,
      marketingChallenges,
      budgetTier: budgetData.tier
    };
  };

  const getDetailedRecommendations = (results) => {
    const recommendations = [];
    
    // Quick wins based on pain point
    if (results.automationPct >= 80) {
      recommendations.push({
        type: 'quickwin',
        title: 'Immediate Quick Wins',
        priority: 'high',
        timeline: '2-4 weeks',
        items: getQuickWinsByPainPoint(results.painPoint),
        impact: '20-40% time savings',
        preview: true
      });
    }
    
    // Marketing automation opportunities
    if (results.marketingTimeSavings > 10) {
      recommendations.push({
        type: 'marketing',
        title: 'Marketing & Social Media Automation',
        priority: 'high',
        timeline: '3-6 weeks',
        items: getMarketingAutomations(results.marketingChallenges),
        impact: `${results.marketingTimeSavings}+ hours/week saved`,
        preview: true
      });
    }
    
    // Integration opportunities
    if (results.integrationScore >= 40) {
      recommendations.push({
        type: 'integration',
        title: 'System Integration Opportunities',
        priority: 'medium',
        timeline: '1-2 months', 
        items: ['Automated data sync between platforms', 'Unified reporting dashboard', 'Cross-system workflow triggers'],
        impact: '30-50% efficiency gain',
        preview: false
      });
    }
    
    // Advanced scaling solutions
    if (results.urgency >= 80) {
      recommendations.push({
        type: 'scaling',
        title: 'Advanced Scaling Automations',
        priority: 'high',
        timeline: '1-3 months',
        items: getScalingByGrowthFocus(results.growthFocus),
        impact: '2-5x capacity increase',
        preview: false
      });
    }

    // Custom solutions based on budget tier
    if (results.budgetTier) {
      recommendations.push({
        type: 'custom',
        title: `${results.budgetTier.charAt(0).toUpperCase() + results.budgetTier.slice(1)} Package Opportunities`,
        priority: 'custom',
        timeline: '2-4 months',
        items: getCustomSolutionsByTier(results.budgetTier),
        impact: 'Custom ROI analysis',
        preview: false
      });
    }

    return recommendations;
  };

  const getMarketingAutomations = (challenges) => {
    const automationMap = {
      'content_creation': 'AI-powered content calendar with cross-platform posting',
      'lead_generation': 'Automated LinkedIn outreach and lead qualification workflows', 
      'email_sequences': 'Smart email nurture sequences with behavioral triggers',
      'social_engagement': 'Automated social media monitoring and response system',
      'competitor_tracking': 'AI competitor analysis and trend monitoring dashboard',
      'performance_reporting': 'Automated marketing ROI and performance reporting'
    };
    
    return challenges.filter(c => c !== 'none').map(challenge => 
      automationMap[challenge] || 'Custom marketing automation workflow'
    ).slice(0, 3);
  };

  const getQuickWinsByPainPoint = (painPoint) => {
    const quickWins = {
      'Data entry and file management': ['Automated file organization system', 'Form-to-database automation', 'Data validation workflows'],
      'Customer follow-up and communication': ['Smart email sequence automation', 'Automated appointment booking system', 'Customer status update workflows'],
      'Content creation and social media management': ['AI content generation workflows', 'Cross-platform posting automation', 'Social media scheduling system'],
      'Creating reports and dashboards': ['Automated report generation', 'Real-time KPI dashboard setup', 'Scheduled report delivery system'],
      'Lead generation and qualification': ['Lead scoring automation', 'Automatic lead routing system', 'Follow-up sequence triggers']
    };
    return quickWins[painPoint] || ['Process automation workflows', 'Data integration systems', 'Notification automations'];
  };

  const getScalingByGrowthFocus = (growthFocus) => {
    const scalingMap = {
      'workflow': ['Advanced employee onboarding automation', 'Performance tracking and analytics', 'Skills-based task routing'],
      'customer': ['Intelligent customer service chatbots', 'Escalation management systems', 'Customer success automation'],
      'marketing': ['Advanced lead scoring algorithms', 'Multi-touch attribution modeling', 'Personalization engines'],
      'process': ['End-to-end workflow orchestration', 'Quality assurance automation', 'Bottleneck prediction systems'],
      'integration': ['Enterprise data architecture', 'API orchestration platform', 'Real-time synchronization systems']
    };
    return scalingMap[growthFocus] || ['Custom workflow automation', 'Process optimization', 'Performance monitoring'];
  };

  const getCustomSolutionsByTier = (tier) => {
    const tierMap = {
      'starter': ['Basic workflow automations', 'Essential integrations', 'Monthly optimization reviews'],
      'growth': ['Advanced AI implementations', 'Custom dashboard development', 'Dedicated automation specialist'],
      'scale': ['Enterprise-grade solutions', 'Multi-department integrations', 'C-suite analytics and reporting'],
      'enterprise': ['Full digital transformation', 'Custom AI model development', 'Dedicated implementation team']
    };
    return tierMap[tier] || ['Custom automation solutions', 'Tailored implementation', 'Ongoing optimization'];
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the email to your backend
    console.log('Email submitted:', { name, email, answers });
    alert('Thank you! Your complete automation strategy report will be emailed to you within 5 minutes.');
    setShowEmailCapture(false);
  };

  if (showEmailCapture) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{backgroundColor: '#151515', color: '#ffffff'}}>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
              <Download className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{color: '#ffffff'}}>Get Your Complete Automation Strategy</h2>
            <p className="text-lg" style={{color: '#b8b8b8'}}>Your personalized 15-page report includes detailed implementation roadmaps, ROI projections, and vendor recommendations.</p>
          </div>

          <div className="p-6 rounded-2xl mb-8" style={{background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
            <h3 className="font-bold text-lg mb-4" style={{color: '#ffffff'}}>🎯 Your Complete Report Includes:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Detailed automation roadmap</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />ROI projections by quarter</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Vendor comparison matrix</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Implementation timeline</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Risk mitigation strategies</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Success metrics framework</div>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#e5e5e5'}}>Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl"
                style={{backgroundColor: '#242424', border: '2px solid #404040', color: '#ffffff'}}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#e5e5e5'}}>Business Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl"
                style={{backgroundColor: '#242424', border: '2px solid #404040', color: '#ffffff'}}
                placeholder="your.email@company.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
              style={{background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', color: '#ffffff'}}
            >
              <Mail className="w-5 h-5 mr-2" />
              Send My Complete Report
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{color: '#888888'}}>
            We'll email your report within 5 minutes. No spam, unsubscribe anytime.
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
      <div className="max-w-5xl mx-auto p-6 min-h-screen" style={{backgroundColor: '#151515', color: '#ffffff'}}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{color: '#ffffff'}}>Your Custom Automation Strategy</h1>
          <p className="text-xl max-w-3xl mx-auto" style={{color: '#b8b8b8'}}>Based on your specific business needs, here's what AI automation could do for your company</p>
        </div>

{/* Key Metrics Dashboard */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-2xl" style={{background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)'}}>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl mr-4" style={{backgroundColor: '#22c55e'}}>
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{color: '#ffffff'}}>Opportunity Score</h3>
                <p className="text-sm" style={{color: '#b8b8b8'}}>Implementation readiness</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">{results.opportunityScore}/100</div>
            <p className="text-sm" style={{color: '#b8b8b8'}}>
              {results.opportunityScore >= 80 ? '🚀 Excellent potential!' : 
               results.opportunityScore >= 65 ? '✅ Strong opportunities' : 
               results.opportunityScore >= 45 ? '⚡ Good potential' :
               '💡 Some opportunities'}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{background: 'rgba(22, 163, 74, 0.15)', border: '1px solid rgba(22, 163, 74, 0.4)'}}>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl mr-4" style={{backgroundColor: '#16a34a'}}>
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{color: '#ffffff'}}>Time Savings</h3>
                <p className="text-sm" style={{color: '#b8b8b8'}}>Weekly hours recovered</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">{results.hoursAutomatable}h</div>
            <p className="text-sm" style={{color: '#b8b8b8'}}>Per week that can be automated</p>
          </div>

          <div className="p-6 rounded-2xl" style={{background: 'rgba(21, 128, 61, 0.15)', border: '1px solid rgba(21, 128, 61, 0.4)'}}>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl mr-4" style={{backgroundColor: '#15803d'}}>
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{color: '#ffffff'}}>Monthly Impact</h3>
                <p className="text-sm" style={{color: '#b8b8b8'}}>Cost savings potential</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">${results.monthlySavings.toLocaleString()}</div>
            <p className="text-sm" style={{color: '#b8b8b8'}}>Estimated monthly savings</p>
          </div>

          <div className="p-6 rounded-2xl" style={{background: 'rgba(20, 83, 45, 0.15)', border: '1px solid rgba(20, 83, 45, 0.4)'}}>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl mr-4" style={{backgroundColor: '#14532d'}}>
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{color: '#ffffff'}}>ROI Potential</h3>
                <p className="text-sm" style={{color: '#b8b8b8'}}>Return percentage</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">
              {results.roiPercentage > 0 ? `+${results.roiPercentage}%` : 
               results.roiPercentage < 0 ? `${results.roiPercentage}%` : 'TBD'}
            </div>
            <p className="text-sm" style={{color: '#b8b8b8'}}>
              {results.paybackMonths ? `${results.paybackMonths} month payback` : 
               results.roiPercentage > 0 ? 'Positive ROI projected' :
               results.roiPercentage < 0 ? 'Custom analysis needed' : 'Analysis needed'}
            </p>
          </div>
        </div>

        {/* Preview Recommendations */}
        {previewRecommendations.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6" style={{color: '#ffffff'}}>Your Top Automation Opportunities</h3>
            <div className="space-y-6">
              {previewRecommendations.map((rec, index) => (
                <div key={index} className="p-6 rounded-xl transition-colors" style={{backgroundColor: '#2a2a2a', border: '2px solid #404040'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl mb-2 flex items-center" style={{color: '#ffffff'}}>
                        <div className={`w-3 h-3 rounded-full mr-3`} style={{backgroundColor: rec.priority === 'high' ? '#ef4444' : '#f97316'}}></div>
                        {rec.title}
                      </h4>
                      <div className="flex gap-4 text-sm" style={{color: '#b8b8b8'}}>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{rec.timeline}</span>
                        <span className="flex items-center"><Zap className="w-4 h-4 mr-1" />{rec.impact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {rec.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="p-3 rounded-lg text-sm" style={{backgroundColor: '#242424'}}>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span style={{color: '#e5e5e5'}}>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blurred Hidden Content */}
        {hiddenRecommendations.length > 0 && (
          <div className="mb-10 relative">
            <div className="filter blur-sm">
              <h3 className="text-2xl font-bold mb-6" style={{color: '#ffffff'}}>Advanced Automation Strategies</h3>
              <div className="space-y-6">
                {hiddenRecommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="p-6 rounded-xl" style={{backgroundColor: '#2a2a2a', border: '2px solid #404040'}}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-xl mb-2 flex items-center" style={{color: '#ffffff'}}>
                          <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#3b82f6'}}></div>
                          {rec.title}
                        </h4>
                        <div className="flex gap-4 text-sm" style={{color: '#b8b8b8'}}>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{rec.timeline}</span>
                          <span className="flex items-center"><Zap className="w-4 h-4 mr-1" />{rec.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      {rec.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="p-3 rounded-lg text-sm" style={{backgroundColor: '#242424'}}>
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span style={{color: '#e5e5e5'}}>{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Overlay with CTA */}
            <div className="absolute inset-0 flex items-center justify-center" style={{background: 'linear-gradient(to top, rgba(21, 21, 21, 0.95), rgba(21, 21, 21, 0.8), transparent)'}}>
              <div className="text-center p-8 rounded-2xl max-w-md" style={{backgroundColor: '#2a2a2a', border: '2px solid rgba(59, 130, 246, 0.5)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'}}>
                <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)'}}>
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#ffffff'}}>Want to See Everything?</h3>
                <p className="mb-4" style={{color: '#b8b8b8'}}>Get your complete automation strategy with detailed implementation guides, vendor comparisons, and ROI projections.</p>
                <button
                  onClick={() => setShowEmailCapture(true)}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
                  style={{background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', color: '#ffffff'}}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Get Full Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Annual Projection */}
        <div className="p-8 rounded-2xl text-white mb-8" style={{background: 'linear-gradient(to right, #111827, #1e3a8a)'}}>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">${results.annualSavings.toLocaleString()}</div>
              <div className="text-blue-200">Projected Annual Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{Math.round(results.hoursAutomatable * 52)}</div>
              <div className="text-blue-200">Hours Saved Per Year</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{results.automationPct}%</div>
              <div className="text-blue-200">Process Automation Potential</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 rounded-2xl text-white text-center" style={{background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'}}>
          <h3 className="text-2xl font-bold mb-3">Ready to Turn This Analysis Into Reality?</h3>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Get a detailed implementation plan tailored specifically to your business processes and goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 rounded-xl font-bold text-lg transition-colors" style={{backgroundColor: '#ffffff', color: '#3b82f6'}}>
              Schedule Free Strategy Call
            </button>
            <button 
              onClick={() => setShowEmailCapture(true)}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              style={{border: '2px solid #ffffff', color: '#ffffff', backgroundColor: 'transparent'}}
            >
              Download Full Report
            </button>
          </div>
          <p className="text-sm mt-4 opacity-75">60-minute consultation • Custom roadmap included • No sales pressure</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isAnswered = currentQuestion.type === 'multiple' 
    ? (answers[currentQuestion.id] && answers[currentQuestion.id].length > 0)
    : answers[currentQuestion.id];

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen" style={{backgroundColor: '#151515', color: '#ffffff'}}>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{color: '#ffffff'}}>AI Automation Opportunity Assessment</h1>
            <p className="mt-2" style={{color: '#b8b8b8'}}>Discover your custom automation potential in 8 questions</p>
          </div>
          <div className="text-right">
            <span className="text-sm" style={{color: '#888888'}}>Step {currentStep + 1} of {questions.length}</span>
            <div className="text-2xl font-bold text-blue-400">{Math.round(((currentStep + 1) / questions.length) * 100)}%</div>
          </div>
        </div>
        <div className="w-full rounded-full h-3" style={{backgroundColor: '#404040'}}>
          <div 
            className="h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${((currentStep + 1) / questions.length) * 100}%`,
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
            }}
          ></div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-3" style={{color: '#ffffff'}}>{currentQuestion.title}</h2>
        {currentQuestion.subtitle && (
          <p className="mb-8" style={{color: '#b8b8b8'}}>{currentQuestion.subtitle}</p>
        )}
        
<div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="block cursor-pointer">
              <div 
                className={`p-5 rounded-xl transition-all ${
                  currentQuestion.type === 'multiple'
                    ? (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option.value))
                      ? 'shadow-md'
                      : ''
                    : answers[currentQuestion.id] === option.value
                      ? 'shadow-md'
                      : ''
                }`}
                style={{
                  border: '2px solid',
                  borderColor: (currentQuestion.type === 'multiple'
                    ? (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option.value))
                      ? '#3b82f6'
                      : '#404040'
                    : answers[currentQuestion.id] === option.value
                      ? '#3b82f6'
                      : '#404040'),
                  backgroundColor: (currentQuestion.type === 'multiple'
                    ? (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option.value))
                      ? 'rgba(59, 130, 246, 0.1)'
                      : '#2a2a2a'
                    : answers[currentQuestion.id] === option.value
                      ? 'rgba(59, 130, 246, 0.1)'
                      : '#2a2a2a'),
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div className="flex items-start w-full">
                  <input
                    type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                    name={currentQuestion.id}
                    value={option.value}
                    checked={
                      currentQuestion.type === 'multiple'
                        ? (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option.value))
                        : answers[currentQuestion.id] === option.value
                    }
                    onChange={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                    className="mr-4 mt-1 scale-125 flex-shrink-0"
                    style={{accentColor: '#3b82f6'}}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-lg" style={{color: '#ffffff'}}>{option.label}</span>
                    {option.description && (
                      <p className="text-sm mt-1" style={{color: '#b8b8b8'}}>{option.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-8 py-3 rounded-xl font-medium transition-colors ${
            currentStep === 0
              ? 'cursor-not-allowed'
              : ''
          }`}
          style={{
            backgroundColor: currentStep === 0 ? '#333333' : '#404040',
            color: currentStep === 0 ? '#666666' : '#e5e5e5'
          }}
        >
          Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={!isAnswered}
          className={`px-8 py-3 rounded-xl font-medium flex items-center transition-colors ${
            !isAnswered ? 'cursor-not-allowed' : ''
          }`}
          style={{
            background: !isAnswered ? '#333333' : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: !isAnswered ? '#666666' : '#ffffff',
            boxShadow: !isAnswered ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}
        >
          {currentStep === questions.length - 1 ? 'Get My Custom Analysis' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AutomationOpportunityFinder;
