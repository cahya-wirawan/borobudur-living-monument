/**
 * Telemetry is a no-op by default (PRD §8). No analytics provider is
 * configured, nothing leaves the browser, and the app behaves identically
 * with or without it. Wire a privacy-reviewed sink here only after a consent
 * decision (see AGENTS.md "Stop and ask").
 */
export type TelemetryEvent =
  | 'experience_started'
  | 'chapter_viewed'
  | 'era_selected'
  | 'relief_opened'
  | 'source_opened'
  | 'experience_completed'
  | 'fallback_used';

export function track(event: TelemetryEvent, detail?: Record<string, string>): void {
  // Intentionally a no-op.
  void event;
  void detail;
}
