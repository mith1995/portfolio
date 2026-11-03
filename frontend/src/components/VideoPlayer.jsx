import { useEffect, useRef, useState } from "react";

/**
 * One recording per language. The language buttons switch the whole video
 * (so the visitor hears you in that language) and keep the playback position.
 *
 * videos = [{ language: "en", label: "English", video: url, subtitles: url | null }, ...]
 */
export default function VideoPlayer({ videos, poster }) {
  const videoRef = useRef(null);
  // where to continue after switching language: { ratio: 0..1, playing: bool }
  const resume = useRef(null);

  const [lang, setLang] = useState(videos[0].language);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const current = videos.find((v) => v.language === lang) ?? videos[0];

  function switchLanguage(code) {
    if (code === lang) return;
    const el = videoRef.current;
    if (el && el.duration) {
      // Use a ratio, because two recordings are rarely exactly the same length
      resume.current = { ratio: el.currentTime / el.duration, playing: !el.paused };
    }
    setLang(code);
  }

  // Runs when the NEW language's video has loaded: jump to the same place.
  function handleLoadedMetadata() {
    const el = videoRef.current;
    const saved = resume.current;
    resume.current = null;
    if (!el || !saved) return;
    el.currentTime = saved.ratio * el.duration;
    if (saved.playing) el.play().catch(() => {});
  }

  // Subtitles On/Off for the current video's track
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    const apply = () => {
      for (const track of el.textTracks) {
        track.mode = showSubtitles ? "showing" : "hidden";
      }
    };
    apply();
    el.textTracks.addEventListener("addtrack", apply);
    return () => el.textTracks.removeEventListener("addtrack", apply);
  }, [showSubtitles, current.language]);

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-cyan-950/30">
        {/* key={language} loads a fresh <video> for the chosen language.
            crossOrigin is REQUIRED for .vtt files served from the Django origin. */}
        <video
          key={current.language}
          ref={videoRef}
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          poster={poster || undefined}
          aria-label={`Project walkthrough video (${current.label})`}
          onLoadedMetadata={handleLoadedMetadata}
        >
          <source
            src={current.video}
            type={current.video.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4"}
          />
          {current.subtitles && (
            <track
              kind="subtitles"
              srcLang={current.language}
              label={current.label}
              src={current.subtitles}
            />
          )}
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        {videos.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Language:</span>
            {videos.map(({ language, label }) => (
              <button
                key={language}
                type="button"
                onClick={() => switchLanguage(language)}
                aria-pressed={lang === language}
                className={`rounded-full border px-4 py-1.5 font-medium transition ${
                  lang === language
                    ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                    : "border-slate-700 text-slate-300 hover:border-cyan-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {current.subtitles && (
          <button
            type="button"
            onClick={() => setShowSubtitles((v) => !v)}
            aria-pressed={showSubtitles}
            className={`rounded-full border px-4 py-1.5 font-medium transition ${
              showSubtitles
                ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                : "border-slate-700 text-slate-300 hover:border-cyan-300"
            }`}
          >
            Subtitles: {showSubtitles ? "On" : "Off"}
          </button>
        )}
      </div>
    </div>
  );
}
