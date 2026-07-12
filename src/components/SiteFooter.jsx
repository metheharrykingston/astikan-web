import React from 'react';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import AstikanLogo from './AstikanLogo';

const footerColumns = [
  ['CARE', [
    ['Find a Doctor', '/#ecosystem'],
    ['Hospitals', '/#ecosystem'],
    ['Diagnostics', '/#ecosystem'],
    ['Emergency Support', '/#ecosystem'],
    ['Care Programs', '/#ecosystem'],
  ]],
  ['TECHNOLOGY', [
    ['Our Technology', '/technology'],
    ['Health App', '/technology#building-now'],
    ['Astikan Pay', '/technology#building-now'],
    ['Health Kiosks', '/technology#health-kiosk'],
    ['Future Research', '/technology#future'],
  ]],
  ['PARTNERS', [
    ['Partner With Us', '/partners'],
    ['For Hospitals', '/partners#partner-paths'],
    ['For Doctors', '/partners#partner-paths'],
    ['For Labs', '/partners#partner-paths'],
    ['Partner Portal', '/partners#partner-portal'],
  ]],
  ['TRUST', [
    ['Our Care Standards', '/trust#care-standards'],
    ['Clear Care Journeys', '/trust'],
    ['Quality & Safety', '/trust#care-standards'],
    ['Support & Resolution', '/trust'],
    ['Feedback & Improvement', '/trust'],
  ]],
  ['INSIGHTS', [
    ['Health Library', '/#insights'],
    ['News & Stories', '/#insights'],
    ['Research', '/#insights'],
    ['Reports', '/#insights'],
    ['Events', '/#insights'],
  ]],
  ['CONTACT', [
    ['Help Center', '/#contact'],
    ['Care Team', '/#contact'],
    ['Feedback', '/#contact'],
    ['Media Inquiries', '/#contact'],
    ['Contact Us', '/#contact'],
  ]],
];

export default function SiteFooter() {
  return (
    <footer id="insights" className="bg-[#031a3b] pt-12 text-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-5 lg:grid-cols-[1.25fr_3.75fr] lg:px-8">
        <div>
          <span onClick={(event) => { event.preventDefault(); window.location.assign('/'); }} className="inline-block cursor-pointer"><AstikanLogo light /></span>
          <p className="mt-5 max-w-xs text-sm leading-6 text-blue-100/70">
            Astikan is building a connected healthcare future through care, technology, research, and compassion.
          </p>
          <div className="mt-6 flex gap-3">
            {[[FaLinkedinIn, 'LinkedIn'], [FaXTwitter, 'X'], [FaYoutube, 'YouTube'], [FaInstagram, 'Instagram']].map(([Icon, label]) => (
              <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-blue-100 transition hover:bg-white hover:text-navy-900">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 lg:grid-cols-6">
          {footerColumns.map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-extrabold tracking-wider text-white">{title}</h4>
              <ul className="mt-4 space-y-3">
                {items.map(([label, to]) => (
                  <li key={label}>
                    <a href={to} className="text-xs text-blue-100/70 hover:text-white">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1380px] flex-col gap-3 border-t border-white/10 px-5 py-5 text-[11px] text-blue-100/55 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>© 2026 Astikan Healthcare Trust. All rights reserved.</span>
        <span>Proudly building a healthier world. 💙</span>
      </div>
    </footer>
  );
}
