import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CaptureRoute } from './features/capture/CaptureRoute';
import { TimelineRoute } from './features/timeline/TimelineRoute';
import { DetailRoute } from './features/detail/DetailRoute';
import { SettingsRoute } from './features/settings/SettingsRoute';
import { OnboardingRoute, hasSeenOnboarding } from './features/onboarding/OnboardingRoute';

// IndexRoute: reaktiv prüfen ob Onboarding gesehen wurde.
// Nicht statisch im Router-Array auswerten — sonst wird der Check
// beim App-Start eingefroren und navigate() nach Onboarding zeigt
// wieder die Weiterleitung statt CaptureRoute.
function IndexRoute() {
  return hasSeenOnboarding() ? <CaptureRoute /> : <Navigate to="/onboarding" replace />;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <IndexRoute /> },
      { path: 'onboarding', element: <OnboardingRoute /> },
      { path: 'capture', element: <CaptureRoute /> },
      { path: 'timeline', element: <TimelineRoute /> },
      { path: 'thought/:id', element: <DetailRoute /> },
      { path: 'settings', element: <SettingsRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);
