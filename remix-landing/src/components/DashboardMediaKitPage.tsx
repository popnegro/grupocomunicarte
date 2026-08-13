import { MediaKitAudienceSelector } from './MediaKitAudienceSelector';
import { MediaKitStudio } from './MediaKitStudio';
import { MediaKitHistory } from './MediaKitHistory';
import './dashboard-media-kit.css';

/**
 * Media Kit Studio, audience context and persistent history inside the
 * shared Dashboard shell.
 */
export function DashboardMediaKitPage() {
  return (
    <div className="dashboard-media-kit-embedded space-y-8">
      <MediaKitAudienceSelector />
      <MediaKitStudio />
      <MediaKitHistory />
    </div>
  );
}
