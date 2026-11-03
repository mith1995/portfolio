import { Link } from "react-router-dom";
import { useProfile } from "../ProfileContext.js";

export default function Footer() {
  const profile = useProfile();
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {profile.full_name}. All rights reserved.
        </p>
        <div className="flex gap-6">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-white">
              LinkedIn
            </a>
          )}
          <Link to="/#projects" className="hover:text-white">Projects</Link>
          <Link to="/#contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
