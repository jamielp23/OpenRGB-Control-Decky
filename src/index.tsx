import { useEffect } from "react";
import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FaLightbulb } from "react-icons/fa";

const setProfile = callable<[name: string], boolean>("set_profile");

// The supplied artwork is embedded as complete SVG data URIs. This avoids
// relying on Decky/SteamUI to resolve external SVG files at runtime.
const svgData = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const ICONS = {
  Steam: svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.09 485.09"><path fill="#1a9fff" d="M333.16 245.05c0 48.67-39.46 88.13-88.13 88.13s-88.13-39.46-88.13-88.13 39.46-88.13 88.13-88.13 88.13 39.46 88.13 88.13Z"/><path fill="#fff" d="M431.12 45.52c4.66 0 8.44 3.78 8.44 8.44v377.16c0 4.66-3.78 8.44-8.44 8.44H53.96c-4.66 0-8.44-3.78-8.44-8.44V53.96c0-4.66 3.78-8.44 8.44-8.44h377.16ZM245.03 125.45c-66.05 0-119.6 53.55-119.6 119.6s53.55 119.6 119.6 119.6 119.6-53.55 119.6-119.6-53.55-119.6-119.6-119.6Z"/></svg>`),
  Xbox: svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.09 485.09"><path fill="#107c10" d="M333.16 245.05c0 48.67-39.46 88.13-88.13 88.13s-88.13-39.46-88.13-88.13 39.46-88.13 88.13-88.13 88.13 39.46 88.13 88.13Z"/><path fill="#fff" d="M431.12 45.52c4.66 0 8.44 3.78 8.44 8.44v377.16c0 4.66-3.78 8.44-8.44 8.44H53.96c-4.66 0-8.44-3.78-8.44-8.44V53.96c0-4.66 3.78-8.44 8.44-8.44h377.16ZM245.03 125.45c-66.05 0-119.6 53.55-119.6 119.6s53.55 119.6 119.6 119.6 119.6-53.55 119.6-119.6-53.55-119.6-119.6-119.6Z"/></svg>`),
  Rainbow: svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.09 485.09"><defs><linearGradient id="Spectrum" x1="245.03" y1="333.17" x2="245.03" y2="156.92" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00a8de"/><stop offset=".2" stop-color="#333391"/><stop offset=".4" stop-color="#e91388"/><stop offset=".6" stop-color="#eb2d2e"/><stop offset=".8" stop-color="#fde92b"/><stop offset="1" stop-color="#009e54"/></linearGradient></defs><path fill="url(#Spectrum)" d="M333.16 245.05c0 48.67-39.46 88.13-88.13 88.13s-88.13-39.46-88.13-88.13 39.46-88.13 88.13-88.13 88.13 39.46 88.13 88.13Z"/><path fill="#fff" d="M431.12 45.52c4.66 0 8.44 3.78 8.44 8.44v377.16c0 4.66-3.78 8.44-8.44 8.44H53.96c-4.66 0-8.44-3.78-8.44-8.44V53.96c0-4.66 3.78-8.44 8.44-8.44h377.16ZM245.03 125.45c-66.05 0-119.6 53.55-119.6 119.6s53.55 119.6 119.6 119.6 119.6-53.55 119.6-119.6-53.55-119.6-119.6-119.6Z"/></svg>`),
  White: svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.09 485.09"><path fill="#fff" d="M333.16 245.05c0 48.67-39.46 88.13-88.13 88.13s-88.13-39.46-88.13-88.13 39.46-88.13 88.13-88.13 88.13 39.46 88.13 88.13Z"/><path fill="#fff" d="M431.12 45.52c4.66 0 8.44 3.78 8.44 8.44v377.16c0 4.66-3.78 8.44-8.44 8.44H53.96c-4.66 0-8.44-3.78-8.44-8.44V53.96c0-4.66 3.78-8.44 8.44-8.44h377.16ZM245.03 125.45c-66.05 0-119.6 53.55-119.6 119.6s53.55 119.6 119.6 119.6 119.6-53.55 119.6-119.6-53.55-119.6-119.6-119.6Z"/></svg>`),
  Off: svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.09 485.09"><path fill="#f15a29" d="M333.16 245.05c0 48.67-39.46 88.13-88.13 88.13s-88.13-39.46-88.13-88.13 39.46-88.13 88.13-88.13 88.13 39.46 88.13 88.13Z"/><path fill="#fff" d="M431.12 45.52c4.66 0 8.44 3.78 8.44 8.44v377.16c0 4.66-3.78 8.44-8.44 8.44H53.96c-4.66 0-8.44-3.78-8.44-8.44V53.96c0-4.66 3.78-8.44 8.44-8.44h377.16ZM245.03 125.45c-66.05 0-119.6 53.55-119.6 119.6s53.55 119.6 119.6 119.6 119.6-53.55 119.6-119.6-53.55-119.6-119.6-119.6Z"/></svg>`),
} as const;

const PROFILES = [
  { name: "Steam", icon: ICONS.Steam },
  { name: "Xbox", icon: ICONS.Xbox },
  { name: "Rainbow", icon: ICONS.Rainbow },
  { name: "White", icon: ICONS.White },
  { name: "Off", icon: ICONS.Off },
];

function ProfileButton({ name, icon, onClick }: { name: string; icon: string; onClick: () => void }) {
  return (
    <ButtonItem layout="below" onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={icon} alt="" aria-hidden="true" style={{ width: "28px", height: "28px", objectFit: "contain", flexShrink: 0 }} />
        <span>{name}</span>
      </div>
    </ButtonItem>
  );
}

function Content() {
  useEffect(() => {
    setProfile("Steam").catch((error) => {
      console.error("OpenRGB Control: failed to apply Steam profile", error);
    });
  }, []);

  const apply = async (name: string) => {
    try {
      await setProfile(name);
      toaster.toast({ title: "RGB changed", body: name });
    } catch (error) {
      toaster.toast({ title: "OpenRGB error", body: String(error) });
    }
  };

  return (
    <PanelSection title="OpenRGB">
      {PROFILES.map((profile) => (
        <PanelSectionRow key={profile.name}>
          <ProfileButton name={profile.name} icon={profile.icon} onClick={() => apply(profile.name)} />
        </PanelSectionRow>
      ))}
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "RGB Control",
  titleView: <div className={staticClasses.Title}>OpenRGB Control</div>,
  content: <Content />,
  icon: <FaLightbulb />,
}));
