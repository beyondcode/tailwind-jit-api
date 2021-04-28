import Cors from "cors";
import tailwindcss from "tailwindcss";
import postcss from "postcss";
import * as path from "path";
import axios from "axios";
import { tmpdir } from "os";
import { writeAsync } from "fs-jetpack";
import initMiddleware from "../../lib/init-middleware";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async (req, res) => {
  // Run cors
  await cors(req, res);

  try {
    // Fetch URL
    const targetFile = path.join(tmpdir(), "tailwind.html");
    let html = "";

    if (req.body.url !== undefined) {
      const pageResult = await axios.get(req.body.url);
      html = pageResult.data;
    } else {
      html = req.body.html;
    }

    await writeAsync(targetFile, html);

    // Pass to Tailwind JIT
    const result = await postcss([
      tailwindcss({
        mode: "jit",
        purge: [targetFile],
        theme: {},
        plugins: [],
      }),
    ]).process(
      `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    `,
      {
        from: `${path.resolve(__filename)}`,
      }
    );

    // Return JIT CSS
    res.setHeader("Content-Type", "text/css");
    res.status(200).send(result.css);
  } catch (err) {
    console.log(err);
    res.status(500).send("Uh Oh");
  }
};
