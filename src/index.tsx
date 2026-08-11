import { useEffect, useMemo, useState } from "react";
import {
  ButtonItem,
  Dropdown,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ToggleField,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FaLightbulb } from "react-icons/fa";

const setProfile = callable<[name: string], boolean>("set_profile");
const applySettings = callable<
  [profile: string, color: string, brightness: number, speed: number],
  boolean
>("apply_settings");

type ProfileName = "Steam" | "Xbox" | "Rainbow" | "White";

const PROFILES: ProfileName[] = ["Steam", "Xbox", "Rainbow", "White"];
const profileOptions = PROFILES.map((profile) => ({ data: profile, label: profile }));

function hueToRgb(hue: number): string {
  const h = ((hue % 360) + 360) % 360;
  const x = 1 - Math.abs(((h / 60) % 2) - 1);
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [1, x, 0];
  else if (h < 120) [r, g, b] = [x, 1, 0];
  else if (h < 180) [r, g, b] = [0, 1, x];
  else if (h < 240) [r, g, b] = [0, x, 1];
  else if (h < 300) [r, g, b] = [x, 0, 1];
  else [r, g, b] = [1, 0, x];

  return [r, g, b]
    .map((value) => Math.round(value * 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

const SPECTRUM =
  "linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";

function ColorControl({ hue, onChange }: { hue: number; onChange: (value: number) => void }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: "14px", marginBottom: "4px" }}>Color</div>
      <input
        aria-label="Color"
        type="range"
        min={0}
        max={360}
        step={1}
        value={hue}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        style={{
          width: "100%",
          height: "18px",
          margin: "2px 0 0 0",
          padding: 0,
          appearance: "none",
          WebkitAppearance: "none",
          background: SPECTRUM,
          borderRadius: "9px",
          border: "0",
          outline: "none",
          cursor: "pointer",
          accentColor: `rgb(${parseInt(hueToRgb(hue).slice(0, 2), 16)}, ${parseInt(
            hueToRgb(hue).slice(2, 4),
            16,
          )}, ${parseInt(hueToRgb(hue).slice(4, 6), 16)})`,
        }}
      />
    </div>
  );
}

function Content() {
  const [enabled, setEnabled] = useState(true);
  const [profile, setProfileState] = useState<ProfileName>("Steam");
  const [hue, setHue] = useState(240);
  const [brightness, setBrightness] = useState(75);
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    setProfile("Steam").catch((error) => {
      console.error("Front Lights: failed to apply Steam profile", error);
    });
  }, []);

  const color = useMemo(() => hueToRgb(hue), [hue]);

  const handleEnabledChange = async (nextEnabled: boolean) => {
    setEnabled(nextEnabled);
    try {
      await setProfile(nextEnabled ? profile : "Off");
      toaster.toast({
        title: "Front Lights",
        body: nextEnabled ? `Enabled: ${profile}` : "Disabled",
      });
    } catch (error) {
      setEnabled(!nextEnabled);
      toaster.toast({ title: "Front Lights error", body: String(error) });
    }
  };

  const handleProfileChange = async (nextProfile: ProfileName) => {
    setProfileState(nextProfile);
    if (!enabled) return;

    try {
      await setProfile(nextProfile);
      toaster.toast({ title: "Front Lights", body: `Profile: ${nextProfile}` });
    } catch (error) {
      toaster.toast({ title: "Front Lights error", body: String(error) });
    }
  };

  const apply = async () => {
    if (!enabled) return;

    try {
      await applySettings(profile, color, brightness, speed);
      toaster.toast({ title: "Front Lights", body: `${profile} customization applied` });
    } catch (error) {
      toaster.toast({ title: "Front Lights error", body: String(error) });
    }
  };

  return (
    <PanelSection title="Customization">
      <PanelSectionRow>
        <ToggleField
          label="Enable Front Lights"
          checked={enabled}
          onChange={handleEnabledChange}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>Profile</div>
          <Dropdown
            rgOptions={profileOptions}
            selectedOption={profile}
            onChange={(option) => handleProfileChange(option.data as ProfileName)}
            strDefaultLabel="Select profile"
          />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ColorControl hue={hue} onChange={setHue} />
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label="Brightness"
          value={brightness}
          min={0}
          max={100}
          step={5}
          showValue={false}
          onChange={setBrightness}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label="Speed"
          value={speed}
          min={0}
          max={100}
          step={5}
          showValue={false}
          onChange={setSpeed}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          label="Apply"
          onClick={apply}
          disabled={!enabled}
          style={{
            width: "100%",
            maxWidth: "140px",
            minWidth: 0,
            boxSizing: "border-box",
            margin: "8px auto 0 auto",
          }}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Front Lights",
  titleView: <div className={staticClasses.Title}>Customization</div>,
  content: <Content />,
  icon: <FaLightbulb />,
}));
