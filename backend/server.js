import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/*
-------------------------------------
Health Route
-------------------------------------
*/

app.get("/", (req, res) => {

    res.json({

        status: "Running",

        message: "AI Assistant Backend"

    });

});

/*
-------------------------------------
Chat Route
-------------------------------------
*/

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({

                error: "Message Required"

            });

        }

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: message,

        });

        res.status(200).json({

            success: true,

            reply: response.text,

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            reply: "Something went wrong."

        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on Port ${PORT}`);

});