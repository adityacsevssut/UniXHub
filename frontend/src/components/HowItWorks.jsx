import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
    // Track active step for interactivity (hover) or simulation (auto-play)
    const [activeStep, setActiveStep] = useState(null);
    const [simStep, setSimStep] = useState(1);

    const pathRef = useRef(null);
    const circleRef = useRef(null);

    // Sync simulation step with JS-driven animation for perfect timing
    useEffect(() => {
        const duration = 12000; // 12s loop
        const startTime = Date.now();
        let animationFrameId;

        const path = pathRef.current;
        const circle = circleRef.current;

        // Safety check if refs are available
        if (!path || !circle) return;

        const totalLength = path.getTotalLength();

        // Target X coordinates for steps (based on CSS positions: 8%, 34%, 60%, 88%)
        // ViewBox is 1100 wide -> x = 88, 374, 660, 968
        const targets = [88, 374, 660, 968];
        const hitRadius = 60; // Slightly wider window for smooth activation

        const updateSimulation = () => {
            const elapsed = (Date.now() - startTime) % duration;
            const progress = elapsed / duration;
            const currentDist = progress * totalLength;

            // Move the circle
            const point = path.getPointAtLength(currentDist);
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);

            // Robust proximity check based on X-coordinate
            // This works regardless of the path's curve length changes
            if (Math.abs(point.x - targets[0]) < hitRadius) {
                setSimStep(1);
            } else if (Math.abs(point.x - targets[1]) < hitRadius) {
                setSimStep(2);
            } else if (Math.abs(point.x - targets[2]) < hitRadius) {
                setSimStep(3);
            } else if (Math.abs(point.x - targets[3]) < hitRadius) {
                setSimStep(4);
            } else {
                setSimStep(null);
            }

            animationFrameId = requestAnimationFrame(updateSimulation);
        };

        animationFrameId = requestAnimationFrame(updateSimulation);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const steps = [
        {
            id: 1,
            number: 1,
            title: "Post Requirement",
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
        },
        {
            id: 4,
            number: 4,
            title: "Secure Payment",
            desc: "Release funds only when you're 100% satisfied with the work.",
            icon: <ShieldCheck size={32} strokeWidth={1.5} />,
            positionClass: "step-4"
        }
    ];

    // Determine which step to highlight: User hover overrides simulation
    const currentActive = activeStep || simStep;

    return (
        <section className="how-it-works-section">
            <div className="hiw-container">
                <h1 className="about-main-title">How UniX<span className="highlight-gradient">Hub</span> Works</h1>

                <div className="hiw-visual-wrapper">
                    {/* SVG Graph Line - Hidden on mobile via CSS */}
                    <svg className="hiw-curve-svg" viewBox="0 0 1100 200" preserveAspectRatio="none">
                        <defs>
                            <marker
                                id="arrowhead"
                                viewBox="0 0 12 12"
                                markerWidth="6"
                                markerHeight="6"
                                refX="10"
                                refY="6"
                                orient="auto"
                            >
                                <path d="M0,0 L12,6 L0,12 L3,6 Z" fill="#60a5fa" />
                            </marker>
                        </defs>
                        {/* 
                            Smooth Bezier Curve (Scaled to 1100 width):
                            Step 1: 8% (x=88), y=80% (160)
                            Step 2: 34% (x=374), y=40% (80)
                            Step 3: 60% (x=660), y=70% (140)
                            Step 4: 88% (x=968), y=15% (30)
                            End: x=1058
                        */}
                        <path
                            className="path-base"
                            d="M88,160 C231,160 231,80 374,80 S517,140 660,140 S814,30 1058,10"
                        />
                        <path
                            className="path-active"
                            ref={pathRef}
                            id="hiw-graph-path"
                            d="M88,160 C231,160 231,80 374,80 S517,140 660,140 S814,30 1058,10"
                            markerEnd="url(#arrowhead)"
                        />
                        <circle r="6" className="path-particle" ref={circleRef} />
                    </svg>

                    <div className="hiw-steps-container">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`hiw-step-node ${step.positionClass} ${currentActive === step.id ? 'active' : ''}`}
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
