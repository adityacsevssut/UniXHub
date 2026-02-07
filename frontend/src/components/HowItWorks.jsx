import React, { useState } from 'react';
import { ClipboardList, Users, CheckCircle2 } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
    // Track active step for interactivity (optional click persistence)
    const [activeStep, setActiveStep] = useState(null);

    const steps = [
        {
            id: 1,
            number: 1,
            title: "Post Your Requirement",
            desc: "Describe your project details, deadline, and budget to get started.",
            icon: <ClipboardList size={32} strokeWidth={1.5} />,
            positionClass: "step-1"
        },
        {
            id: 2,
            number: 2,
            title: "Get Matched",
            desc: "Our algorithm connects you with the most skilled students for your needs.",
            icon: <Users size={32} strokeWidth={1.5} />,
            positionClass: "step-2"
        },
        {
            id: 3,
            number: 3,
            title: "Receive Work",
            desc: "Get high-quality, professional work delivered on time, every time.",
            icon: <CheckCircle2 size={32} strokeWidth={1.5} />,
            positionClass: "step-3"
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="hiw-container">
                <h1 className="about-main-title">How UniX<span className="highlight-gradient">Hub</span> Works</h1>

                <div className="hiw-visual-wrapper">
                    {/* SVG Curve - Hidden on mobile via CSS */}
                    <svg className="hiw-curve-svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        {/* The Path: A smooth sine wave passing through 20%,50%; 50%,150%; 80%,50% roughly inside the 0-200 coord space 
                Let's calibrate: 
                Width 1000.
                Step 1: left ~20% (x=200). y should be somewhat high? CSS top:40% -> relative to 400px height is ~160px.
                Step 2: left ~50% (x=500). CSS top:60% -> ~240px. 
                Wait, SVG viewBox is 0-200. Let's map it.
                Center y=100.
                Start (0, 100).
                Pt1 (200, 80).
                Pt2 (500, 120).
                Pt3 (800, 80).
                End (1000, 100).
            */}
                        <path
                            className="path-base"
                            d="M0,100 C150,100 150,60 200,60 C350,60 400,140 500,140 C600,140 650,60 800,60 C900,60 900,100 1000,100"
                        />
                        <path
                            className="path-active"
                            id="hiw-curve-path"
                            d="M0,100 C150,100 150,60 200,60 C350,60 400,140 500,140 C600,140 650,60 800,60 C900,60 900,100 1000,100"
                        />
                        <circle r="6" className="path-particle">
                            <animateMotion
                                dur="4s"
                                repeatCount="indefinite"
                                calcMode="spline"
                                keyTimes="0;1"
                                keySplines="0.4 0 0.2 1"
                            >
                                <mpath href="#hiw-curve-path" />
                            </animateMotion>
                        </circle>
                    </svg>

                    <div className="hiw-steps-container">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`hiw-step-node ${step.positionClass} ${activeStep === step.id ? 'active' : ''}`}
                                onMouseEnter={() => setActiveStep(step.id)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                <div className="node-circle">
                                    <span className="step-number">{step.number}</span>
                                    <div className="node-icon">{step.icon}</div>
                                </div>
                                <div className="node-content">
                                    <h3 className="node-title">{step.title}</h3>
                                    <p className="node-desc">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
