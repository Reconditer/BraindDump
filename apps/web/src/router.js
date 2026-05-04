import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate, } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CaptureRoute } from './features/capture/CaptureRoute';
import { TimelineRoute } from './features/timeline/TimelineRoute';
import { DetailRoute } from './features/detail/DetailRoute';
import { SettingsRoute } from './features/settings/SettingsRoute';
import { OnboardingRoute, hasSeenOnboarding } from './features/onboarding/OnboardingRoute';
const routes = [
    {
        path: '/onboarding',
        element: _jsx(OnboardingRoute, {}),
    },
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            {
                index: true,
                // Redirect to onboarding on very first visit
                element: hasSeenOnboarding() ? _jsx(CaptureRoute, {}) : _jsx(Navigate, { to: "/onboarding", replace: true }),
            },
            { path: 'capture', element: _jsx(CaptureRoute, {}) },
            { path: 'timeline', element: _jsx(TimelineRoute, {}) },
            { path: 'thought/:id', element: _jsx(DetailRoute, {}) },
            { path: 'settings', element: _jsx(SettingsRoute, {}) },
            { path: '*', element: _jsx(Navigate, { to: "/", replace: true }) },
        ],
    },
];
export const router = createBrowserRouter(routes);
//# sourceMappingURL=router.js.map