import { useEffect, useState } from "react";
import {
  ButtonItem,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  SliderField,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FaLightbulb } from "react-icons/fa";

const setProfile = callable<[name: string], boolean>("set_profile");
const applySettings = callable<
  [profile: string, effect: string, color: string, brightness: number, speed: number],
  boolean
>("apply_settings");

type ProfileName = "Steam" | "Xbox" | "Rainbow" | "White" | "Off";

const PROFILES: ProfileName[] = ["Steam", "Xbox", "Rainbow", "White", "Off"];
const EFFECTS = [
  "Off",
  "Static",
  "Breathing",
  "Flashing",
  "Spectrum Cycle",
  "Rainbow",
  "Chase Fade",
  "Chase",
];

const profileOptions = PROFILES.map((profile) => ({ data: profile, label: profile }));
const effectOptions = EFFECTS.map((effect) => ({ data: effect, label: effect }));

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

function hueName(hue: number): string {
  const names = ["Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Magenta"];
  return names[Math.round((((hue % 360) + 360) % 360) / 45) % names.length];
}

function ColourControl({ hue, onChange }: { hue: number; onChange: (value: number) => void }) {
  return (
    <div>
      <SliderField
        label={`COLOUR  ${hueName(hue)}`}
        value={hue}
        min={0}
        max={360}
        step={1}
        showValue={false}
        onChange={onChange}
      />
      <div
        aria-hidden="true"
        style={{
          height: "8px",
          borderRadius: "4px",
          margin: "-2px 12px 8px 12px",
          background:
            "linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
        }}
      />
    </div>
  );
}

function Content() {
  const [profile, setProfileState] = useState<ProfileName>("Steam");
  const [effect, setEffect] = useState("Spectrum Cycle");
  const [hue, setHue] = useState(240);
  const [brightness, setBrightness] = useState(75);
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    setProfile("Steam").catch((error) => {
      console.error("Front Lights: failed to apply Steam profile", error);
    });
  }, []);

  const apply = async () => {
    try {
      await applySettings(profile, effect, hueToRgb(hue), brightness, speed);
      toaster.toast({ title: "Front Lights", body: `${profile} • ${effect}` });
    } catch (error) {
      toaster.toast({ title: "Front Lights error", body: String(error) });
    }
  };

  return (
    <PanelSection title="Front Lights">
      <PanelSectionRow>
        <DropdownItem
          label="PROFILE"
          rgOptions={profileOptions}
          selectedOption={profile}
          onChange={(option) => setProfileState(option.data as ProfileName)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem
          label="EFFECT"
          rgOptions={effectOptions}
          selectedOption={effect}
          onChange={(option) => setEffect(option.data as string)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ColourControl hue={hue} onChange={setHue} />
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label="BRIGHTNESS"
          value={brightness}
          min={0}
          max={100}
          step={5}
          showValue={true}
          valueSuffix="%"
          onChange={setBrightness}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <SliderField
          label="SPEED"
          value={speed}
          min={0}
          max={100}
          step={5}
          showValue={true}
          valueSuffix="%"
          onChange={setSpeed}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem onClick={apply}>APPLY</ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Front Lights",
  titleView: <div className={staticClasses.Title}>Front Lights</div>,
  content: <Content />,
  icon: <FaLightbulb />,
}));
