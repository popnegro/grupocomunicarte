import { MediaKitStudio } from './MediaKitStudio';
import { MediaKitHistory } from './MediaKitHistory';
import './dashboard-media-kit.css';

/**
 * Media Kit Studio and persistent history inside the shared Dashboard shell.
 */
export function DashboardMediaKitPage() {
  return (
    <div className="dashboard-media-kit-embedded space-y-8">
      <MediaKitStudio />
      <MediaKitHistory />
    </div>
  );
}
