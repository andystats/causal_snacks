import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Circle, AlertTriangle, BookOpen, Lightbulb, FileText, Download } from 'lucide-react';

// Synthesized Causal Roadmap Steps
const ROADMAP_STEPS = [
  {
    id: 1,
    title: "Define Causal Question",
    subtitle: "Target Trial Protocol + ICH E9(R1)",
    description: "Specify the research question using both Target Trial Emulation and ICH E9(R1) frameworks to ensure clarity and regulatory alignment.",
    fields: [
      { key: "population", label: "Population / Eligibility Criteria", placeholder: "Who is included? What are the inclusion/exclusion criteria?", type: "textarea" },
      { key: "treatment", label: "Treatment Strategies", placeholder: "What interventions are being compared? Include baseline and post-baseline interventions.", type: "textarea" },
      { key: "comparator", label: "Comparator", placeholder: "What is the reference group?", type: "textarea" },
      { key: "outcome", label: "Outcome", placeholder: "What is the primary outcome? At what time point?", type: "textarea" },
      { key: "followup", label: "Follow-up Period", placeholder: "Start and end of follow-up, censoring events", type: "textarea" },
      { key: "summary_measure", label: "Summary Measure (Causal Contrast)", placeholder: "e.g., Risk difference, relative risk, hazard ratio", type: "input" }
    ],
    example: {
      title: "NSAID vs Opioid on AKI (Williamson et al.)",
      content: {
        population: "Medicare beneficiaries linked to EHR from Mass General Brigham, with continuous enrollment in Parts A, B, D for 365 days prior, diagnosed with osteoarthritis",
        treatment: "New-user of NSAID after 365-day washout of any opioid or NSAID",
        comparator: "New-user of opioid after 365-day washout",
        outcome: "Acute kidney injury (AKI) within 6 months",
        followup: "From treatment initiation to 6 months, censored at death or disenrollment",
        summary_measure: "6-month risk difference"
      }
    },
    guidance: [
      "Use the Target Trial framework to think about what ideal RCT would answer your question",
      "Ensure time zero is well-defined and aligned with treatment initiation",
      "Consider whether ITT or per-protocol effect is more appropriate"
    ]
  },
  {
    id: 2,
    title: "Specify Causal Model",
    subtitle: "DAG & Background Knowledge",
    description: "Construct a causal graph (DAG) representing your assumptions about relationships between treatment, outcome, confounders, and other variables.",
    fields: [
      { key: "study_type", label: "Study Type", placeholder: "e.g., Retrospective cohort, pragmatic trial, target trial emulation", type: "input" },
      { key: "confounders", label: "Measured Confounders (W)", placeholder: "Variables affecting both treatment and outcome", type: "textarea" },
      { key: "unmeasured", label: "Potential Unmeasured Confounders", placeholder: "What important variables might be missing?", type: "textarea" },
      { key: "mediators", label: "Mediators / Colliders", placeholder: "Variables on the causal pathway or affected by both treatment and outcome", type: "textarea" },
      { key: "censoring", label: "Censoring Mechanism", placeholder: "What causes loss to follow-up? Is it differential?", type: "textarea" },
      { key: "dag_description", label: "DAG Description", placeholder: "Describe the key causal pathways: A → Y, W → A, W → Y, etc.", type: "textarea" }
    ],
    example: {
      title: "NSAID vs Opioid Study DAG",
      content: {
        study_type: "Retrospective cohort (Target Trial Emulation)",
        confounders: "91 investigator-specified variables + 14,938 proxy features from claims/EHR codes",
        unmeasured: "Access to healthcare, socioeconomic factors, lifestyle factors",
        mediators: "None considered in point-treatment analysis",
        censoring: "Death or disenrollment (<4% censored), assumed non-differential",
        dag_description: "W → A, W → Y, A → Y, W → C (simplified DAG assuming no selection bias after adjusting for W)"
      }
    },
    guidance: [
      "Include all variables that could affect treatment, outcome, or both",
      "Be explicit about unmeasured confounders—this informs sensitivity analysis",
      "Consider time-varying confounding if exposure varies over time"
    ]
  },
  {
    id: 3,
    title: "Consider Observed Data",
    subtitle: "Data Structure & Measurement",
    description: "Document the actual data available, how variables are measured, and any discrepancies between ideal and observed data.",
    fields: [
      { key: "data_source", label: "Data Source", placeholder: "Database name, time period, size", type: "textarea" },
      { key: "sample_size", label: "Sample Size", placeholder: "N total, N treated, N comparator, N events", type: "textarea" },
      { key: "exposure_def", label: "Exposure Definition", placeholder: "How is treatment operationalized in the data?", type: "textarea" },
      { key: "outcome_def", label: "Outcome Definition", placeholder: "Codes, algorithms, validation status", type: "textarea" },
      { key: "covariate_measurement", label: "Covariate Measurement", placeholder: "Lookback windows, code types, data quality", type: "textarea" },
      { key: "time_zero", label: "Time Zero Definition", placeholder: "How is baseline/index date defined?", type: "textarea" }
    ],
    example: {
      title: "Linked Medicare-EHR Data",
      content: {
        data_source: "Medicare claims linked to Research Patient Data Registry (RPDR) at Mass General Brigham, 2007-2017",
        sample_size: "N=21,343 (36.4% NSAID initiators, 63.6% opioid initiators), 899 (4.2%) AKI events",
        exposure_def: "Prescription fill for NSAID or opioid after 365-day washout (new-user design)",
        outcome_def: "AKI diagnosis code within 6 months (previously validated algorithm)",
        covariate_measurement: "365-day lookback for osteoarthritis diagnosis and baseline characteristics",
        time_zero: "Date of first qualifying prescription fill"
      }
    },
    guidance: [
      "Verify that time zero in data matches target trial protocol",
      "Document outcome validation status (PPV, sensitivity)",
      "Note differences in measurement across data sources or time periods"
    ]
  },
  {
    id: 4,
    title: "Assess Identifiability",
    subtitle: "Can We Answer the Causal Question?",
    description: "Evaluate whether the causal estimand can be identified from observed data. Document the assumptions required and their plausibility.",
    fields: [
      { key: "exchangeability", label: "Exchangeability (No Unmeasured Confounding)", placeholder: "Is conditional exchangeability plausible? What's the evidence?", type: "textarea" },
      { key: "positivity", label: "Positivity (Overlap)", placeholder: "Do all covariate strata have positive probability of each treatment?", type: "textarea" },
      { key: "consistency", label: "Consistency (Well-defined Intervention)", placeholder: "Is there a single version of treatment? Any measurement error?", type: "textarea" },
      { key: "no_interference", label: "No Interference (SUTVA)", placeholder: "Does one person's treatment affect another's outcome?", type: "textarea" },
      { key: "causal_gap", label: "Assessment of Causal Gap", placeholder: "If assumptions violated, what is the likely magnitude and direction of bias?", type: "textarea" },
      { key: "modifications", label: "Modifications to Reduce Gap", placeholder: "Can we change the question, population, or data to improve identification?", type: "textarea" }
    ],
    example: {
      title: "Identifiability Assessment",
      content: {
        exchangeability: "Unlikely to be fully satisfied—some unmeasured confounding expected. Large-scale covariate adjustment used to capture proxy confounders.",
        positivity: "Evaluated via propensity score distribution; cross-fitting used to reduce extreme weights",
        consistency: "AKI diagnosis codes are highly sensitive and specific (validated); consistency likely satisfied",
        no_interference: "Plausible—individual medication choice unlikely to affect others' kidney outcomes",
        causal_gap: "Non-zero gap expected due to residual confounding. Sensitivity analysis will quantify plausible range.",
        modifications: "Applied high-dimensional proxy adjustment to reduce confounding; restricted to new-users"
      }
    },
    guidance: [
      "Be honest about assumption violations—this informs interpretation",
      "Consider whether a weaker question could be more credibly identified",
      "Document reasoning clearly for stakeholders and regulators"
    ]
  },
  {
    id: 5,
    title: "Define Statistical Estimand",
    subtitle: "From Causal to Statistical Parameter",
    description: "Translate the causal estimand into a statistical parameter that can be estimated from observed data under identification assumptions.",
    fields: [
      { key: "causal_estimand", label: "Causal Estimand", placeholder: "ψ = E[Y^(a=1)] - E[Y^(a=0)] (in notation)", type: "textarea" },
      { key: "statistical_estimand", label: "Statistical Estimand", placeholder: "ψ = E_W[E(Y|A=1,W) - E(Y|A=0,W)]", type: "textarea" },
      { key: "link_to_causal", label: "Link to Causal Under Identification", placeholder: "Statistical = Causal if exchangeability, positivity, consistency hold", type: "textarea" },
      { key: "censoring_handling", label: "Censoring Adjustment", placeholder: "How is censoring handled in the estimand?", type: "textarea" }
    ],
    example: {
      title: "NSAID Study Statistical Estimand",
      content: {
        causal_estimand: "ψ_causal = E(Y^{A=1,C=1}) - E(Y^{A=0,C=1}) — 6-month risk difference under no censoring",
        statistical_estimand: "ψ_obs = E_W[E(Y*|C=1,A=1,W) - E(Y*|C=1,A=0,W)] — adjusted risk difference in observed population",
        link_to_causal: "Equal under exchangeability (no unmeasured confounding), positivity, consistency, and uninformative censoring (MCAR)",
        censoring_handling: "Complete case analysis (omitting <4% censored); MCAR assumption made given low censoring and similar rates across arms"
      }
    },
    guidance: [
      "The statistical estimand should be a well-defined function of the observed data distribution",
      "Avoid defining the estimand as a coefficient in a regression model",
      "Consider whether marginal or conditional effects are of interest"
    ]
  },
  {
    id: 6,
    title: "Choose Estimator",
    subtitle: "Statistical Model & Estimation Strategy",
    description: "Select an estimator based on statistical properties. Use outcome-blind simulations to compare candidates and prespecify the analysis.",
    fields: [
      { key: "estimator", label: "Primary Estimator", placeholder: "e.g., TMLE, AIPW, IPW, G-computation", type: "input" },
      { key: "nuisance_models", label: "Nuisance Model Specification", placeholder: "Propensity score model, outcome model, machine learning approaches", type: "textarea" },
      { key: "variable_selection", label: "Variable Selection Strategy", placeholder: "How are confounders selected? Data-adaptive vs. pre-specified?", type: "textarea" },
      { key: "simulation_results", label: "Outcome-Blind Simulation Results", placeholder: "What did simulations show about bias, MSE, coverage?", type: "textarea" },
      { key: "ci_method", label: "Confidence Interval Method", placeholder: "Influence curve, bootstrap, etc.", type: "input" },
      { key: "prespecification", label: "Prespecification Status", placeholder: "Was analysis plan registered? SAP available?", type: "textarea" }
    ],
    example: {
      title: "TMLE with Large-Scale Covariate Adjustment",
      content: {
        estimator: "Targeted Minimum Loss-Based Estimation (TMLE)",
        nuisance_models: "Outcome: Lasso regression. Propensity score: 8 Lasso variants compared (Traditional, Outcome-Adaptive, Collaborative-Controlled, with/without cross-fitting)",
        variable_selection: "91 investigator-specified + 14,938 data-driven proxies. Collaborative-controlled Lasso for PS with cross-fitting selected.",
        simulation_results: "Outcome-blind simulations showed Collaborative-Controlled Outcome-Adaptive Lasso with cross-fitting (Model 8) had best performance: lowest bias, MSE, and proper coverage",
        ci_method: "Influence curve-based standard errors",
        prespecification: "Analysis plan developed before examining treatment-outcome association; model selected via outcome-blind simulation"
      }
    },
    guidance: [
      "Prefer doubly-robust estimators (TMLE, AIPW) that allow for flexible modeling",
      "Use cross-validation or outcome-blind simulations to select among candidate approaches",
      "Ensure all analytic decisions are made without knowledge of treatment-outcome association"
    ]
  },
  {
    id: 7,
    title: "Sensitivity Analysis",
    subtitle: "Quantifying the Causal Gap",
    description: "Prespecify sensitivity analyses to assess how violations of identification assumptions would impact conclusions.",
    fields: [
      { key: "primary_sensitivity", label: "Primary Sensitivity Analysis Approach", placeholder: "e.g., E-value, bias factor, negative controls", type: "textarea" },
      { key: "unmeasured_confounding", label: "Sensitivity to Unmeasured Confounding", placeholder: "What unmeasured confounder strength would nullify the result?", type: "textarea" },
      { key: "outcome_misclassification", label: "Sensitivity to Outcome Misclassification", placeholder: "Impact of PPV and sensitivity on estimates", type: "textarea" },
      { key: "selection_bias", label: "Sensitivity to Selection Bias", placeholder: "Impact of informative censoring or sample selection", type: "textarea" },
      { key: "g_value", label: "G-value (or E-value)", placeholder: "Minimal causal gap to negate finding", type: "input" },
      { key: "negative_controls", label: "Negative Control Analyses", placeholder: "Exposure or outcome negative controls used?", type: "textarea" }
    ],
    example: {
      title: "Sensitivity Analysis for NSAID Study",
      content: {
        primary_sensitivity: "Nonparametric sensitivity analysis showing impact of causal gap on point estimate and confidence intervals",
        unmeasured_confounding: "Sensitivity plot generated across range of gap sizes, expressed in effect size units (δ) and relative to measured confounding adjustment",
        outcome_misclassification: "AKI codes previously validated with high sensitivity/specificity; consistency assumption likely satisfied",
        selection_bias: "Low censoring (<4%) makes selection bias unlikely to be substantial",
        g_value: "G-value = 0.027 on risk difference scale — relatively small unmeasured confounding would negate null finding",
        negative_controls: "Not explicitly reported in this study"
      }
    },
    guidance: [
      "Sensitivity analyses should be prespecified before examining results",
      "Use domain knowledge to bound plausible causal gap sizes",
      "Consider multiple sources of bias (confounding, selection, measurement error)"
    ]
  },
  {
    id: 8,
    title: "Results & Interpretation",
    subtitle: "Compare Designs & Draw Conclusions",
    description: "Report results with appropriate interpretation given the identification assumptions and sensitivity analyses.",
    fields: [
      { key: "primary_result", label: "Primary Result", placeholder: "Point estimate and 95% CI", type: "textarea" },
      { key: "unadjusted_result", label: "Unadjusted Result (for comparison)", placeholder: "Before confounding adjustment", type: "textarea" },
      { key: "interpretation_level", label: "Interpretation Level", placeholder: "Causal effect, association, or in-between?", type: "textarea" },
      { key: "alternative_designs", label: "Comparison to Alternative Designs", placeholder: "How does this compare to RCT or other feasible designs?", type: "textarea" },
      { key: "limitations", label: "Key Limitations", placeholder: "What could bias results? What is unknown?", type: "textarea" },
      { key: "conclusions", label: "Conclusions", placeholder: "What can be concluded given all prior steps?", type: "textarea" }
    ],
    example: {
      title: "NSAID vs Opioid Study Results",
      content: {
        primary_result: "Adjusted risk difference: 0.005 (95% CI: -0.027, 0.038) — no evidence of increased AKI risk with NSAIDs vs opioids",
        unadjusted_result: "Unadjusted risk difference: 0.024 (0.018, 0.030) — apparent increased risk before adjustment",
        interpretation_level: "Association after extensive confounding adjustment. Causal interpretation limited by potential residual confounding, but sensitivity analysis suggests bias would need to be large to explain away null finding.",
        alternative_designs: "RCT not feasible for this question in this population. Target trial emulation with large-scale adjustment represents best available evidence.",
        limitations: "Unmeasured confounding possible (e.g., access to healthcare); censoring assumed MCAR; single data source",
        conclusions: "No evidence of increased short-term AKI risk with NSAIDs vs opioids in osteoarthritis patients. Finding robust to sensitivity analysis within plausible bias ranges."
      }
    },
    guidance: [
      "Match interpretation strength to assumption plausibility",
      "Distinguish between 'no effect' and 'insufficient evidence of effect'",
      "Consider real-world implications even when causal identification is uncertain"
    ]
  }
];

export default function CausalRoadmapApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [showExample, setShowExample] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const step = ROADMAP_STEPS[currentStep];

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [step.id]: {
        ...prev[step.id],
        [key]: value
      }
    }));
  };

  const getValue = (key) => {
    return formData[step.id]?.[key] || '';
  };

  const markComplete = () => {
    setCompletedSteps(prev => new Set([...prev, step.id]));
    if (currentStep < ROADMAP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const loadExample = () => {
    setFormData(prev => ({
      ...prev,
      [step.id]: step.example.content
    }));
    setShowExample(false);
  };

  const exportRoadmap = () => {
    let markdown = `# Causal Roadmap Analysis\n\nGenerated: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    
    ROADMAP_STEPS.forEach(s => {
      markdown += `## Step ${s.id}: ${s.title}\n\n`;
      markdown += `*${s.subtitle}*\n\n`;
      
      s.fields.forEach(field => {
        const value = formData[s.id]?.[field.key] || '(Not completed)';
        markdown += `### ${field.label}\n\n${value}\n\n`;
      });
      
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'causal_roadmap_analysis.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {/* Header */}
      <header className="bg-stone-900 text-stone-100 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500 rounded-sm flex items-center justify-center">
              <FileText className="w-6 h-6 text-stone-900" />
            </div>
            <h1 className="text-3xl font-light tracking-tight">The Causal Roadmap</h1>
          </div>
          <p className="text-stone-400 text-lg ml-13" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            A structured guide for generating high-quality real-world evidence
          </p>
          <p className="text-stone-500 text-sm mt-2 ml-13" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Based on van der Laan, Dang et al. (2023) • Target Trial Emulation Framework
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {ROADMAP_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  currentStep === idx 
                    ? 'bg-amber-500 text-stone-900 scale-110 shadow-lg' 
                    : completedSteps.has(s.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                }`}
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {completedSteps.has(s.id) ? <Check className="w-5 h-5" /> : s.id}
              </button>
            ))}
          </div>
          <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / ROADMAP_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
              {/* Step Header */}
              <div className="bg-stone-800 text-white px-6 py-5">
                <div className="flex items-center gap-2 text-amber-400 text-sm mb-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <span>Step {step.id} of {ROADMAP_STEPS.length}</span>
                </div>
                <h2 className="text-2xl font-medium">{step.title}</h2>
                <p className="text-stone-400 mt-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{step.subtitle}</p>
              </div>

              {/* Description */}
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200">
                <p className="text-stone-600 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {step.description}
                </p>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-5">
                {step.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={getValue(field.key)}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-stone-800"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={getValue(field.key)}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-stone-800"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExample(!showExample)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Example
                  </button>

                  {currentStep === ROADMAP_STEPS.length - 1 ? (
                    <button
                      onClick={exportRoadmap}
                      className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  ) : (
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-stone-900 rounded-lg hover:bg-amber-400 transition-colors font-medium"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Example Panel */}
            {showExample && (
              <div className="mt-6 bg-amber-50 rounded-lg border border-amber-200 overflow-hidden">
                <div className="px-5 py-3 bg-amber-100 border-b border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-800" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {step.example.title}
                    </span>
                  </div>
                  <button
                    onClick={loadExample}
                    className="text-sm px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    Load Example
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  {step.fields.map((field) => (
                    <div key={field.key}>
                      <span className="text-xs font-medium text-amber-700 uppercase tracking-wide" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {field.label}
                      </span>
                      <p className="text-stone-700 text-sm mt-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {step.example.content[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Guidance */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Guidance Panel */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden mb-6">
                <div className="px-5 py-3 bg-stone-100 border-b border-stone-200">
                  <h3 className="font-medium text-stone-800 flex items-center gap-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Key Considerations
                  </h3>
                </div>
                <ul className="p-5 space-y-3">
                  {step.guidance.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-stone-600" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      <Circle className="w-2 h-2 mt-1.5 text-amber-500 flex-shrink-0 fill-current" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Reference */}
              <div className="bg-stone-800 rounded-lg p-5 text-stone-300">
                <h4 className="text-white font-medium mb-3" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Roadmap Overview
                </h4>
                <ol className="space-y-2 text-sm" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {ROADMAP_STEPS.map((s, idx) => (
                    <li 
                      key={s.id}
                      className={`flex items-center gap-2 ${currentStep === idx ? 'text-amber-400' : ''}`}
                    >
                      <span className={`w-5 h-5 rounded text-xs flex items-center justify-center ${
                        completedSteps.has(s.id) ? 'bg-emerald-600 text-white' :
                        currentStep === idx ? 'bg-amber-500 text-stone-900' : 'bg-stone-700'
                      }`}>
                        {completedSteps.has(s.id) ? '✓' : s.id}
                      </span>
                      {s.title}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Citation */}
              <div className="mt-6 text-xs text-stone-500 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                <p className="font-medium text-stone-600 mb-1">References:</p>
                <p>Dang LE et al. (2023) JCTS. "A causal roadmap for generating high-quality RWE"</p>
                <p className="mt-1">Williamson BD et al. (2023) JCTS. "Application in safety monitoring"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-stone-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Based on the Causal Roadmap framework by van der Laan, Petersen, and collaborators at UC Berkeley
        </div>
      </footer>
    </div>
  );
}
