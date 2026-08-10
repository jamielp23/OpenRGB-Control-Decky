import asyncio
import decky

PROFILES = {
    "Steam": "Steam.orp",
    "Xbox": "Xbox.orp",
    "Rainbow": "Rainbow.orp",
    "White": "White.orp",
    "Off": "Off.orp",
}

class Plugin:
    async def set_profile(self, name: str) -> bool:
        if name not in PROFILES:
            raise ValueError(f"Unknown OpenRGB profile: {name}")

        profile = PROFILES[name]

        process = await asyncio.create_subprocess_exec(
            "/usr/bin/flatpak",
            "run",
            "org.openrgb.OpenRGB",
            "--profile",
            profile,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            error = stderr.decode(errors="replace").strip()
            decky.logger.error(f"OpenRGB failed for {profile}: {error}")
            raise RuntimeError(error or f"OpenRGB exited with code {process.returncode}")

        decky.logger.info(f"OpenRGB profile applied: {profile}")
        return True

    async def _main(self):
        decky.logger.info("OpenRGB Control loaded")

    async def _unload(self):
        pass
