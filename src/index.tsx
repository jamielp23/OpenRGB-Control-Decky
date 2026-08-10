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

type ProfileName = "Steam" | "Xbox" | "Rainbow" | "White" | "Off";

function ProfileIcon({ name }: { name: ProfileName }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 485.09 485.09",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    style: { flexShrink: 0, display: "block" },
  } as const;

  if (name === "Steam") {
    return (
      <svg {...common}>
        <path fill="#1a9fff" d="M333.16,245.05c0,48.67-39.46,88.13-88.13,88.13s-88.13-39.46-88.13-88.13,39.46-88.13,88.13-88.13,88.13,39.46,88.13,88.13Z" />
        <path fill="#fff" d="M431.12,45.52c4.66,0,8.44,3.78,8.44,8.44v377.16c0,4.66-3.78,8.44-8.44,8.44H53.96c-4.66,0-8.44-3.78-8.44-8.44V53.96c0-4.66,3.78-8.44,8.44-8.44h377.16ZM245.03,125.45c-66.05,0-119.6,53.55-119.6,119.6,0,66.05,53.55,119.6,119.6,119.6s119.6-53.55,119.6-119.6-53.55-119.6-119.6-119.6Z" />
      </svg>
    );
  }

  if (name === "Xbox") {
    return (
      <svg {...common}>
        <path fill="#107c10" d="M333.16,245.05c0,48.67-39.46,88.13-88.13,88.13s-88.13-39.46-88.13-88.13,39.46-88.13,88.13-88.13,88.13,39.46,88.13,88.13Z" />
        <path fill="#fff" d="M431.12,45.52c4.66,0,8.44,3.78,8.44,8.44v377.16c0,4.66-3.78,8.44-8.44,8.44H53.96c-4.66,0-8.44-3.78-8.44-8.44V53.96c0-4.66,3.78-8.44,8.44-8.44h377.16ZM245.03,125.45c-66.05,0-119.6,53.55-119.6,119.6,0,66.05,53.55,119.6,119.6,119.6s119.6-53.55,119.6-119.6-53.55-119.6-119.6-119.6Z" />
      </svg>
    );
  }

  if (name === "Rainbow") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="openrgb-spectrum" x1="245.03" y1="333.17" x2="245.03" y2="156.92" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00a8de" />
            <stop offset=".2" stopColor="#333391" />
            <stop offset=".4" stopColor="#e91388" />
            <stop offset=".6" stopColor="#eb2d2e" />
            <stop offset=".8" stopColor="#fde92b" />
            <stop offset="1" stopColor="#009e54" />
          </linearGradient>
        </defs>
        <path fill="url(#openrgb-spectrum)" d="M333.16,245.05c0,48.67-39.46,88.13-88.13,88.13s-88.13-39.46-88.13-88.13,39.46-88.13,88.13-88.13,88.13,39.46,88.13,88.13Z" />
        <path fill="#fff" d="M431.12,45.52c4.66,0,8.44,3.78,8.44,8.44v377.16c0,4.66-3.78,8.44-8.44,8.44H53.96c-4.66,0-8.44-3.78-8.44-8.44V53.96c0-4.66,3.78-8.44,8.44-8.44h377.16ZM245.03,125.45c-66.05,0-119.6,53.55-119.6,119.6,0,66.05,53.55,119.6,119.6,119.6s119.6-53.55,119.6-119.6-53.55-119.6-119.6-119.6Z" />
      </svg>
    );
  }

  if (name === "White") {
    return (
      <svg {...common}>
        <path fill="#fff" d="M333.16,245.05c0,48.67-39.46,88.13-88.13,88.13s-88.13-39.46-88.13-88.13,39.46-88.13,88.13-88.13,88.13,39.46,88.13,88.13Z" />
        <path fill="#fff" d="M431.12,45.52c4.66,0,8.44,3.78,8.44,8.44v377.16c0,4.66-3.78,8.44-8.44,8.44H53.96c-4.66,0-8.44-3.78-8.44-8.44V53.96c0-4.66,3.78-8.44,8.44-8.44h377.16ZM245.03,125.45c-66.05,0-119.6,53.55-119.6,119.6,0,66.05,53.55,119.6,119.6,119.6s119.6-53.55,119.6-119.6-53.55-119.6-119.6-119.6Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path fill="#f15a29" d="M333.16,245.05c0,48.67-39.46,88.13-88.13,88.13s-88.13-39.46-88.13-88.13,39.46-88.13,88.13-88.13,88.13,39.46,88.13,88.13Z" />
      <path fill="#fff" d="M431.12,45.52c4.66,0,8.44,3.78,8.44,8.44v377.16c0,4.66-3.78,8.44-8.44,8.44H53.96c-4.66,0-8.44-3.78-8.44-8.44V53.96c0-4.66,3.78-8.44,8.44-8.44h377.16ZM245.03,125.45c-66.05,0-119.6,53.55-119.6,119.6,0,66.05,53.55,119.6,119.6,119.6s119.6-53.55,119.6-119.6-53.55-119.6-119.6-119.6Z" />
    </svg>
  );
}

const PROFILES: ProfileName[] = ["Steam", "Xbox", "Rainbow", "White", "Off"];

function ProfileButton({ name, onClick }: { name: ProfileName; onClick: () => void }) {
  return (
    <ButtonItem layout="below" onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ProfileIcon name={name} />
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

  const apply = async (name: ProfileName) => {
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
        <PanelSectionRow key={profile}>
          <ProfileButton name={profile} onClick={() => apply(profile)} />
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
