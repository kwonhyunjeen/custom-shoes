import fs from "fs";
import { execSync } from "child_process";

fs.readdirSync("./supabase/functions", { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .forEach((dir) => {
    const path = `./supabase/functions/${dir.name}`;
    console.log(path);
    if (fs.existsSync(`${path}/deno.json`)) {
      console.log(`Installing deps for ${dir.name}...`);
      execSync("../../../../node_modules/.bin/deno cache index.ts", {
        cwd: path,
        stdio: "inherit",
      });
    }
  });
