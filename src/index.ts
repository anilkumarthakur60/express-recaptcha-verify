import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;

/* Enable CORS for all routes */
app.use(cors());

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("Express server is running");
});

/* Define a new route for the path ("/dummy")
 using the HTTP GET method that returns a JSON object */
app.get("/dummy", (req: Request, res: Response) => {
  const dummyObject = {
    message: "This is a dummy object",
    status: "success"
  };
  res.json(dummyObject);
});

/* Middleware to parse JSON bodies */
app.use(express.json());

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

/* Define a new route for the path ("/verify-captcha")
 using the HTTP POST method that verifies reCAPTCHA */
app.post("/verify-captcha", async (req: Request, res: Response) => {
  const recaptchaResponse = req.body.captcha_token;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!recaptchaResponse) {
    return res.status(400).json({ message: "recaptchaResponse is required" });
  }
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: secretKey,
          response: recaptchaResponse
        }
      }
    );
    console.log("response", response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
