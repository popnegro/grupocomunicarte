import { MediaKitStudio } from './MediaKitStudio';
import './dashboard-media-kit.css';

/**
 * Embeds the Media Kit Studio inside the shared Dashboard shell.
 * The Studio retains its business logic and export engine while the
 * administrative shell owns navigation, spacing and page chrome.
 */
export function DashboardMediaKitPage() {
  return (
    <div className="dashboard-media-kit-embedded">
      <MediaKitStudio />
    </div>
  );
}
