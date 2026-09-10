const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")


// ─────────────────────────────────────────────────────────────────────────────
// Gemini Client
// ─────────────────────────────────────────────────────────────────────────────

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// ─────────────────────────────────────────────────────────────────────────────
// Interview Report Schema
// ─────────────────────────────────────────────────────────────────────────────

const interviewReportSchema = z.object({

    matchScore: z.number()
        .min(0)
        .max(100)
        .describe(
            "Realistic candidate-to-job match score from 0 to 100."
        ),

    technicalQuestions: z.array(
        z.object({

            question: z.string()
                .describe(
                    "Personalized technical interview question."
                ),

            intention: z.string()
                .describe(
                    "What the interviewer is evaluating."
                ),

            answer: z.string()
                .describe(
                    "Concise candidate answer covering key concepts, approach, relevant example, trade-offs, and common mistakes."
                )

        })
    )
        .length(15)
        .describe(
            "Exactly 15 personalized technical questions."
        ),

    behavioralQuestions: z.array(
        z.object({

            question: z.string()
                .describe(
                    "Personalized behavioral interview question."
                ),

            intention: z.string()
                .describe(
                    "What the interviewer is evaluating."
                ),

            answer: z.string()
                .describe(
                    "Concise answer structure, using STAR when appropriate."
                )

        })
    )
        .length(8)
        .describe(
            "Exactly 8 personalized behavioral questions."
        ),

    skillGaps: z.array(
        z.object({

            skill: z.string()
                .describe(
                    "Important skill gap relevant to the target role."
                ),

            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
                .describe(
                    "Importance of the skill gap."
                )

        })
    )
        .describe(
            "Only important skill gaps that could affect interview performance."
        ),

    preparationPlan: z.array(
        z.object({

            day: z.number()
                .int()
                .min(1)
                .max(14)
                .describe(
                    "Preparation day from 1 to 14."
                ),

            focus: z.string()
                .describe(
                    "Main focus of the day."
                ),

            tasks: z.array(
                z.string()
            )
                .length(3)
                .describe(
                    "Exactly 3 concrete actionable tasks."
                ),

            estimatedHours: z.number()
                .min(2)
                .max(3)
                .describe(
                    "Preparation time in hours, between 2 and 3."
                ),

            expectedOutcome: z.string()
                .describe(
                    "What the candidate should achieve that day."
                )

        })
    )
        .length(14)
        .describe(
            "Exactly 14 personalized preparation days."
        ),

    title: z.string()
        .describe(
            "Target job title."
        )

})


// ─────────────────────────────────────────────────────────────────────────────
// Resume PDF Schema
// ─────────────────────────────────────────────────────────────────────────────

const resumePdfSchema = z.object({

    html: z.string()
        .describe(
            "Complete self-contained HTML document for a professional ATS-friendly resume."
        )

})


// ─────────────────────────────────────────────────────────────────────────────
// Sleep Helper
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


// ─────────────────────────────────────────────────────────────────────────────
// Gemini Models
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_MODELS = [
    "gemini-3-flash-preview",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash"
]


// ─────────────────────────────────────────────────────────────────────────────
// Error Helpers
// ─────────────────────────────────────────────────────────────────────────────

const getErrorStatus = (error) => {

    return (
        error?.status ??
        error?.code ??
        error?.response?.status ??
        null
    )

}


const getErrorMessage = (error) => {

    return String(
        error?.message ||
        error?.error?.message ||
        ""
    )

}


// ─────────────────────────────────────────────────────────────────────────────
// Temporary Error Detection
// ─────────────────────────────────────────────────────────────────────────────

const isTemporaryError = (error) => {

    const status = getErrorStatus(error)
    const message = getErrorMessage(error)

    return (

        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||

        message.includes("429") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("503") ||
        message.includes("504") ||

        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("UNAVAILABLE") ||
        message.includes("OVERLOADED") ||
        message.includes("overloaded") ||
        message.includes("temporarily unavailable")

    )

}


// ─────────────────────────────────────────────────────────────────────────────
// Model Availability Detection
// ─────────────────────────────────────────────────────────────────────────────

const isModelUnavailable = (error) => {

    const status = getErrorStatus(error)
    const message = getErrorMessage(error)

    return (

        status === 404 ||
        message.includes("NOT_FOUND") ||
        message.includes("not found") ||
        message.includes("Model not found") ||
        message.includes("model does not exist")

    )

}


// ─────────────────────────────────────────────────────────────────────────────
// Gemini Generation With Retry + Fallback
// ─────────────────────────────────────────────────────────────────────────────

const generateWithRetry = async (request) => {

    let lastError = null

    for (const model of GEMINI_MODELS) {

        console.log(`\n🤖 Trying Gemini model: ${model}`)

        for (let attempt = 1; attempt <= 2; attempt++) {

            try {

                console.log(`   Attempt ${attempt}/2`)

                const response = await ai.models.generateContent({

                    ...request,

                    model

                })

                console.log(`   ✅ Success using ${model}`)

                return response

            } catch (error) {

                lastError = error

                const status = getErrorStatus(error)
                const message = getErrorMessage(error)

                console.error(`   ❌ ${model} failed`)
                console.error(`   Status: ${status}`)
                console.error(`   Message: ${message}`)


                // Model unavailable
                if (isModelUnavailable(error)) {

                    console.log(
                        `   ⚠️ ${model} unavailable. Moving to next model...`
                    )

                    break
                }


                // Permanent error
                if (!isTemporaryError(error)) {

                    console.error(
                        "   ❌ Permanent Gemini error."
                    )

                    throw error
                }


                // Retry temporary error
                if (attempt < 2) {

                    const delay = 2000 * attempt

                    console.log(
                        `   ⏳ Retrying in ${delay}ms...`
                    )

                    await sleep(delay)

                } else {

                    console.log(
                        `   ⚠️ ${model} failed twice. Trying next model...`
                    )

                }

            }

        }

    }

    throw lastError || new Error(
        "All Gemini models are currently unavailable. Please try again later."
    )

}


// ─────────────────────────────────────────────────────────────────────────────
// Generate Interview Report
// ─────────────────────────────────────────────────────────────────────────────

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    // Validate input

    if (!resume && !selfDescription) {

        throw new Error(
            "Candidate information is required to generate an interview report."
        )

    }

    if (!jobDescription) {

        throw new Error(
            "Job description is required to generate an interview report."
        )

    }


    // ─────────────────────────────────────────────────────────────────────────
    // Optimized Interview Prompt
    // ─────────────────────────────────────────────────────────────────────────

    const prompt = `
You are an experienced technical interviewer and interview coach.

Create a highly personalized interview preparation report using:

1. Candidate resume
2. Candidate self-description
3. Target job description

Do not create generic content.

CANDIDATE RESUME:
${resume || "No resume provided."}

CANDIDATE SELF DESCRIPTION:
${selfDescription || "No self description provided."}

TARGET JOB DESCRIPTION:
${jobDescription || "No job description provided."}


PERSONALIZATION RULES:

- Separate what the candidate knows, what the job requires, and what they need to improve.
- Use only information supported by the resume or self-description.
- NEVER invent experience, projects, technologies, certifications, achievements, companies, education, responsibilities, or job titles.
- A technology appearing only in the JD should be treated as a potential skill gap, not existing candidate knowledge.
- Do not mark a skill as missing when the candidate clearly demonstrates it.


MATCH SCORE:

Give a realistic 0–100 score based on:
- Technical skills
- Relevant projects
- Experience
- Job responsibilities
- Tools/technologies
- Missing requirements
- Ability to perform the role

Do not inflate the score for general programming knowledge.


TECHNICAL QUESTIONS:

Generate EXACTLY 15 personalized technical questions.

Difficulty:
- 4 easy/foundation
- 6 medium
- 5 hard/advanced

Use relevant areas such as:
programming, role-specific technologies, APIs, databases, authentication, security, debugging, performance, scalability, architecture, system design, projects, and JD requirements.

Requirements:
- At least 5 questions must relate directly to the candidate's resume/projects.
- At least 5 must derive directly from the JD.
- Avoid repeated concepts.
- Avoid generic questions unless directly relevant.
- Questions should resemble real interviews.

For every question provide:
- question
- intention
- answer

Technical answers must be concise, approximately 80–150 words, covering the key concepts, practical approach, relevant example, trade-offs, and common mistakes.


BEHAVIORAL QUESTIONS:

Generate EXACTLY 8 personalized behavioral questions.

Cover varied topics such as:
projects, difficult problems, failure, teamwork, conflict, pressure, learning, ownership, communication, adaptability, motivation, strengths/weaknesses, and career goals.

Connect questions to the candidate and target role whenever possible.

For every question provide:
- question
- intention
- answer

Behavioral answers should be approximately 60–120 words and use STAR when appropriate.

Never invent achievements or experiences.


SKILL GAPS:

Identify only the most important gaps that could affect interview performance.

Do not list every missing technology.

Use:
- low
- medium
- high

based on importance to the target role.


14-DAY PREPARATION PLAN:

Create EXACTLY 14 days.

Each day:
- focus
- exactly 3 actionable tasks
- estimatedHours between 2 and 3
- expectedOutcome

Keep the roadmap personalized to the target role, candidate skills, projects, experience, and skill gaps.

Progress generally from:
understanding → learning → practice → project preparation → technical practice → behavioral preparation → mock interviews → final revision.

Customize the order when necessary.


ROLE-SPECIFIC TOPICS:

Frontend:
React, JavaScript, CSS, browser concepts, state management, performance, accessibility, architecture.

Backend:
APIs, databases, authentication, caching, scalability, system design, testing.

DevOps:
Linux, networking, Docker, Kubernetes, CI/CD, cloud, monitoring, infrastructure as code.

QA:
testing strategy, test cases, API testing, SQL, automation, regression, bugs, performance.

Full Stack:
frontend, backend, databases, APIs, authentication, deployment, testing, system design.

Only include topics relevant to the target role.


QUALITY:

The report must be:
- personalized
- realistic
- technically accurate
- actionable
- appropriate for the candidate's experience

Avoid repetition and vague tasks.

Return ONLY valid JSON matching the provided response schema.
`


    // ─────────────────────────────────────────────────────────────────────────
    // Generate
    // ─────────────────────────────────────────────────────────────────────────

    const response = await generateWithRetry({

        contents: prompt,

        config: {

            responseMimeType: "application/json",

            responseSchema: zodToJsonSchema(
                interviewReportSchema
            )

        }

    })


    // ─────────────────────────────────────────────────────────────────────────
    // Parse JSON
    // ─────────────────────────────────────────────────────────────────────────

    let report

    try {

        report = JSON.parse(response.text)

    } catch (error) {

        console.error(
            "❌ Gemini returned invalid interview JSON."
        )

        console.error(response.text)

        throw new Error(
            "Gemini returned an invalid interview report."
        )

    }


    // ─────────────────────────────────────────────────────────────────────────
    // Validate
    // ─────────────────────────────────────────────────────────────────────────

    const validationResult =
        interviewReportSchema.safeParse(report)


    if (!validationResult.success) {

        console.error(
            "❌ Interview report validation failed."
        )

        console.error(
            validationResult.error.format()
        )

        throw new Error(
            "Generated interview report did not match the expected format."
        )

    }


    return validationResult.data

}


// ─────────────────────────────────────────────────────────────────────────────
// Generate PDF From HTML
// ─────────────────────────────────────────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true
    })

    try {
        const page = await browser.newPage()

        console.log("📄 Loading resume HTML...")

        await page.setContent(htmlContent, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        })

        console.log("✅ Resume HTML loaded")

        await page.emulateMediaType("print")

        console.log("🖨️ Generating PDF...")

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: "12mm",
                bottom: "12mm",
                left: "12mm",
                right: "12mm"
            }
        })

        console.log("✅ PDF generated successfully")

        return pdfBuffer

    } catch (error) {

        console.error("❌ PDF generation failed:")
        console.error(error)

        throw error

    } finally {
        await browser.close()
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// Generate Resume PDF
// ─────────────────────────────────────────────────────────────────────────────

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Create a professional, ATS-friendly resume tailored specifically to the target job.

CANDIDATE RESUME:
${resume || "No resume provided."}

CANDIDATE SELF DESCRIPTION:
${selfDescription || "No self description provided."}

TARGET JOB DESCRIPTION:
${jobDescription || "No job description provided."}

REQUIREMENTS:

PERSONALIZATION:
- Tailor the resume to the target job.
- Prioritize relevant skills, projects, experience, and achievements.
- Use only information supported by the candidate's information.
- NEVER invent jobs, companies, projects, technologies, certifications, education, achievements, metrics, responsibilities, or experience.
- Do not claim unsupported skills.

CONTENT:
- Write concise, professional, human-sounding content.
- Use strong action-oriented language when supported by actual experience.
- Prioritize accurate JD keywords.
- Avoid keyword stuffing and repetition.
- Keep the resume approximately 1–2 pages.

ATS:
- Use simple semantic HTML.
- Use standard sections such as Summary, Skills, Experience, Projects, Education, and Certifications when applicable.
- Avoid tables, images, icons, graphics, columns, and complex layouts.
- Keep important information as normal text.

DESIGN:
- Clean professional A4 layout.
- Readable typography and spacing.
- Minimal styling and colors.
- Prioritize readability.
- Do not use external assets.

OUTPUT:

Return ONLY valid JSON:

{
  "html": "..."
}

The html field must contain a complete self-contained HTML document that can be rendered directly by Puppeteer.
`;

    // Gemini call comes AFTER the prompt
    const response = await generateWithRetry({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    });

    const jsonContent = JSON.parse(response.text);

    const validationResult = resumePdfSchema.safeParse(jsonContent);

    if (!validationResult.success) {
        throw new Error("Invalid resume HTML generated by AI");
    }

    const pdfBuffer = await generatePdfFromHtml(
        validationResult.data.html
    );

    return pdfBuffer;
}


// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    generateInterviewReport,
    generateResumePdf
}