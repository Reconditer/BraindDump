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

const routes: RouteObject[] = [
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        // Redirect to onboarding on very first visit
        element: hasSeenOnboarding() ? <CaptureRoute /> : <Navigate to="/onboarding" replace />,
      },
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
