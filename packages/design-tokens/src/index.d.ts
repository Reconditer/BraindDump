/**
 * BrainDump Design Tokens
 * Aus handoff/DESIGN-TOKENS.md
 */
export declare const color: {
    readonly bg: {
        readonly default: "#fdfaf6";
        readonly card: "#ffffff";
        readonly subtle: "#fbf8f3";
    };
    readonly ink: {
        readonly default: "#2a2138";
        readonly soft: "#5d5168";
        readonly faint: "#9a8fa8";
        readonly veryFaint: "#cfc6d8";
    };
    readonly accent: {
        readonly default: "#b67cf5";
        readonly deep: "#7c4dd8";
        readonly soft: "#ead9ff";
    };
    readonly secondary: {
        readonly pink: "#f5a6b8";
        readonly pinkSoft: "#fde4ea";
        readonly peach: "#f7b59a";
        readonly peachSoft: "#fde4d8";
        readonly sky: "#88b6ec";
        readonly skySoft: "#d8e6f8";
        readonly mint: "#9bd4b5";
        readonly mintSoft: "#dcf0e4";
    };
    readonly rule: {
        readonly default: "rgba(42,33,56,0.08)";
        readonly strong: "rgba(42,33,56,0.14)";
    };
    readonly gradient: {
        readonly bg: "linear-gradient(165deg, #ffe5dc 0%, #ffd0e2 30%, #e1d2ff 65%, #cfe5ff 100%)";
        readonly bgSoft: "linear-gradient(165deg, #fff4ee 0%, #ffe4ee 55%, #ece2ff 100%)";
        readonly accent: "linear-gradient(135deg, #b67cf5, #7c4dd8)";
    };
};
export declare const font: {
    readonly display: "\"Fraunces\", \"Source Serif Pro\", Georgia, serif";
    readonly ui: "\"Plus Jakarta Sans\", -apple-system, \"Segoe UI\", sans-serif";
};
export declare const radius: {
    readonly sm: 8;
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 22;
    readonly pill: 999;
};
export declare const shadow: {
    readonly sm: "0 1px 2px rgba(80,50,120,0.08)";
    readonly md: "0 3px 10px rgba(80,50,120,0.10)";
    readonly lg: "0 6px 24px rgba(80,50,120,0.12)";
    readonly xl: "0 20px 60px rgba(80,50,120,0.25)";
};
export declare const type: {
    readonly display: {
        readonly size: 28;
        readonly weight: 500;
        readonly lineHeight: 1.2;
        readonly tracking: "-0.02em";
    };
    readonly h2: {
        readonly size: 22;
        readonly weight: 500;
        readonly lineHeight: 1.25;
        readonly tracking: "-0.01em";
    };
    readonly body: {
        readonly size: 14;
        readonly weight: 400;
        readonly lineHeight: 1.55;
        readonly tracking: "-0.005em";
    };
    readonly bodySmall: {
        readonly size: 12;
        readonly weight: 400;
        readonly lineHeight: 1.5;
    };
    readonly label: {
        readonly size: 11;
        readonly weight: 600;
        readonly lineHeight: 1.4;
    };
    readonly meta: {
        readonly size: 10;
        readonly weight: 600;
        readonly lineHeight: 1.2;
        readonly tracking: "0.08em";
        readonly transform: "uppercase";
    };
};
export declare const breakpoints: {
    readonly mobile: 0;
    readonly tablet: 640;
    readonly desktop: 768;
    readonly wide: 1024;
};
/** Max content width on desktop to avoid full-bleed gradient on 1920px monitors */
export declare const maxContentWidth = 840;
//# sourceMappingURL=index.d.ts.map