const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Create the model configuration objects.
const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "application/json",
};

const generationConfig1 = {
  temperature: 0.95,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Enhanced Course Outline Model: Now integrates both user input and extracted PDF content.
// It instructs the model to add extra topics or chapters if necessary.
export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text:
            "Generate a study material for the provided content which includes both user input and extracted PDF content. " +
            "Enhance the response with additional chapters or topics if required. " +
            "The study material should include: a course title, a summary of the course, and a list of chapters. " +
            "Each chapter must include a chapter title, a chapter summary, an emoji icon, and a list of topics in JSON format. " +
            "If the PDF content suggests more detailed topics or additional chapters, please include them.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "```json\n" +
            '{\n' +
            '  "courseSummary": "This course offers an enhanced and comprehensive study material by combining user input with detailed insights from extracted PDF content. It dynamically expands on topics and chapters as needed.",\n' +
            '  "chapters": [\n' +
            '    {\n' +
            '      "chapterTitle": "Introduction",\n' +
            '      "chapterSummary": "An overview of the course, integrating core concepts and PDF insights for a robust introduction.",\n' +
            '      "emoji": "📖",\n' +
            '      "topics": ["Course Overview", "Objectives", "PDF Key Highlights"]\n' +
            '    },\n' +
            '    {\n' +
            '      "chapterTitle": "Core Concepts",\n' +
            '      "chapterSummary": "This chapter delves into the essential concepts, with added details and extra topics based on the enhanced PDF content.",\n' +
            '      "emoji": "🧠",\n' +
            '      "topics": ["Fundamental Theories", "Detailed Explanations", "Additional Insights", "Supplementary Topics"]\n' +
            '    },\n' +
            '    {\n' +
            '      "chapterTitle": "Advanced Topics",\n' +
            '      "chapterSummary": "Advanced material that builds upon core ideas, enriched by the extracted PDF data. More chapters and topics may be added if necessary.",\n' +
            '      "emoji": "🚀",\n' +
            '      "topics": ["Advanced Techniques", "In-depth Analysis", "Extra Topics from PDFs"]\n' +
            '    }\n' +
            "  ]\n" +
            "}\n" +
            "```",
        },
      ],
    },
  ],
});

// Enhanced Detailed Notes Model: Generates detailed exam material content in HTML format,
// instructing the AI to incorporate additional insights from the extracted PDFs.
export const generateNotesAiModel = model.startChat({
  generationConfig1,
  history: [
    {
      role: "user",
      parts: [
        {
          text:
            'Generate exam material detail content for each chapter. Include all topic points and provide a detailed explanation for each topic point. ' +
            'Enhance the content by incorporating additional insights from the extracted PDF content. ' +
            'Output must be in HTML format (do not include <html>, <head>, <body>, or <title> tags). ' +
            'Use <h3> for chapter titles, <h4> for topics, and <p> for content.',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "```html\n" +
            "<h3>Introduction</h3>\n" +
            "<p>This chapter introduces the course and integrates key insights from the extracted PDF content to offer a robust overview. " +
            "It outlines the course objectives and core topics.</p>\n\n" +
            "<h4>Overview</h4>\n" +
            "<p>An introductory explanation enhanced with additional details from PDF data.</p>\n\n" +
            "<h4>Key Concepts</h4>\n" +
            "<p>A detailed description of fundamental concepts, incorporating extra context and examples from the PDFs.</p>\n" +
            "```",
        },
      ],
    },
  ],
});

// Enhanced Flashcard Model: Generates flashcards (maximum 15 cards) and incorporates PDF enhancements.
export const GenerateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text:
            "Generate flashcards on topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation. " +
            "Output the flashcards in JSON format with each card having 'front' and 'back' content. " +
            "Maximum 15 cards. Enhance the flashcards by integrating insights from the extracted PDF content if applicable.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "```json\n" +
            "[\n" +
            '  {"front": "What is a Widget in Flutter?", "back": "Widgets are the basic building blocks of Flutter\'s UI. They define the interface based on their configuration. PDF insights provide additional usage tips and best practices."},\n' +
            '  {"front": "Name three common layout widgets.", "back": "Common layout widgets include Container, Row, and Column. Extra PDF details may offer additional examples and layout strategies."},\n' +
            '  {"front": "What is the purpose of the Scaffold widget?", "back": "Scaffold provides a basic visual structure with elements like an AppBar. PDF content might also include customization options and design patterns."},\n' +
            '  {"front": "What are Stateless and Stateful Widgets?", "back": "Stateless widgets are immutable, while Stateful widgets maintain state. Additional PDF examples illustrate their use cases."},\n' +
            '  {"front": "How do you update text in a Text widget?", "back": "By passing a new string value to the Text widget. PDF enhancements could include best practices for text styling."},\n' +
            '  {"front": "Which widget is used to display an image?", "back": "The Image widget displays images, with options for network or asset images. PDF insights can provide more details on image optimization."},\n' +
            '  {"front": "How do you handle user input with a text field?", "back": "Using a TextField widget and managing it with a TextEditingController. PDF enhancements may cover validation techniques."},\n' +
            '  {"front": "What is AppBar and where is it located?", "back": "AppBar typically appears at the top of the screen, offering navigation and branding. Additional insights from PDFs can detail design variations."},\n' +
            '  {"front": "How is navigation handled in Flutter?", "back": "Navigation is managed using the Navigator widget with push and pop operations. Extra PDF insights might discuss advanced navigation strategies."},\n' +
            '  {"front": "What is a route in Flutter?", "back": "A route is a unique identifier for a screen. PDF enhancements might include more complex routing scenarios."},\n' +
            '  {"front": "Explain MaterialPageRoute.", "back": "MaterialPageRoute provides platform-specific transition animations. PDFs can offer further customization insights."},\n' +
            '  {"front": "What does Navigator.pushNamed do?", "back": "It navigates to a new screen based on a named route. PDF details might elaborate on configuration options."},\n' +
            '  {"front": "What are named routes?", "back": "Named routes simplify navigation by using string identifiers. PDF content may add examples for clarity."},\n' +
            '  {"front": "How do you pass data to a new screen?", "back": "Data is passed as arguments when navigating. Enhanced PDF insights may include advanced techniques."},\n' +
            '  {"front": "What does Navigator.pop do?", "back": "It removes the current screen from the stack. Additional PDF details might provide usage tips."}\n' +
            "]\n" +
            "```",
        },
      ],
    },
  ],
});

// Enhanced Quiz Model: Generates a quiz in JSON format with title, description, and questions. 
// Each question contains keys: question, options, and answer, with additional PDF insights.
export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text:
            "Generate a quiz on the topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format. " +
            "The quiz should include a title, a description, and an array of questions. " +
            "Each question should be an object with keys: question, options, and answer. " +
            "Enhance the quiz questions with additional insights from the extracted PDF content if applicable.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "```json\n" +
            "{\n" +
            '  "quizTitle": "Flutter Fundamentals: UI Development & Basic Navigation",\n' +
            '  "description": "Test your knowledge on Flutter UI concepts and basic navigation. Additional insights from PDF content are incorporated for enhanced understanding.",\n' +
            '  "questions": [\n' +
            '    {\n' +
            '      "question": "What is the primary purpose of a Widget in Flutter?",\n' +
            '      "options": [\n' +
            '        "To handle network requests.",\n' +
            '        "To manage state.",\n' +
            '        "To describe the UI.",\n' +
            '        "To perform database operations."\n' +
            "      ],\n" +
            '      "answer": "To describe the UI."\n' +
            "    },\n" +
            '    {\n' +
            '      "question": "Which widget is commonly used for arranging children in a layout?",\n' +
            '      "options": [\n' +
            '        "Container",\n' +
            '        "Text",\n' +
            '        "Row/Column",\n' +
            '        "Image"\n' +
            "      ],\n" +
            '      "answer": "Row/Column"\n' +
            "    },\n" +
            '    {\n' +
            '      "question": "What role does BuildContext play in Flutter?",\n' +
            '      "options": [\n' +
            '        "To store data.",\n' +
            '        "To locate a widget in the tree.",\n' +
            '        "To manage widget state.",\n' +
            '        "To perform animations."\n' +
            "      ],\n" +
            '      "answer": "To locate a widget in the tree."\n' +
            "    },\n" +
            '    {\n' +
            '      "question": "How does Navigator.pushNamed function in Flutter?",\n' +
            '      "options": [\n' +
            '        "It pushes a new route onto the stack.",\n' +
            '        "It replaces the current route.",\n' +
            '        "It pops the current route.",\n' +
            '        "It resets the navigator."\n' +
            "      ],\n" +
            '      "answer": "It pushes a new route onto the stack."\n' +
            "    },\n" +
            '    {\n' +
            '      "question": "What is the function of MaterialApp in Flutter?",\n' +
            '      "options": [\n' +
            '        "To display images.",\n' +
            '        "To manage network requests.",\n' +
            '        "To set up themes and routing.",\n' +
            '        "To handle database operations."\n' +
            "      ],\n" +
            '      "answer": "To set up themes and routing."\n' +
            "    },\n" +
            '    {\n' +
            '      "question": "Which widget is primarily used for navigation in Flutter apps?",\n' +
            '      "options": [\n' +
            '        "Text",\n' +
            '        "Container",\n' +
            '        "Navigator",\n' +
            '        "Scaffold"\n' +
            "      ],\n" +
            '      "answer": "Navigator"\n' +
            "    }\n" +
            "  ]\n" +
            "}\n" +
            "```",
        },
      ],
    },
  ],
});

// Enhanced QnA Model: Generates a list of 10 Q&A pairs in JSON format. 
// Each entry includes a question and a detailed answer that incorporates PDF-enhanced insights.
export const GenerateQnAAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text:
            "Generate a list of 10 question and answer pairs on the topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format. " +
            "Each Q&A should include a question and a detailed descriptive answer. " +
            "Enhance the answers with insights from the extracted PDF data where applicable.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text:
            "```json\n" +
            "[\n" +
            '  {"question": "What is a Widget in Flutter and why are they important?", "answer": "Widgets are the building blocks of a Flutter UI, defining both structure and appearance. Additional insights from PDFs provide practical examples and usage scenarios."},\n' +
            '  {"question": "How do StatelessWidget and StatefulWidget differ?", "answer": "StatelessWidget is immutable while StatefulWidget can maintain state. Enhanced PDF content offers detailed use-case scenarios."},\n' +
            '  {"question": "What is the significance of the build method in Flutter?", "answer": "The build method constructs the UI each time it is called. PDF insights may provide tips on optimizing widget rebuilds."},\n' +
            '  {"question": "How does the MaterialApp widget facilitate app design in Flutter?", "answer": "MaterialApp sets up themes, routing, and overall structure. Additional PDF enhancements may detail design guidelines."},\n' +
            '  {"question": "How is navigation managed in Flutter using the Navigator widget?", "answer": "Navigator manages screen transitions via a stack model. Extra PDF insights might cover advanced navigation techniques."},\n' +
            '  {"question": "What role does BuildContext play in Flutter development?", "answer": "BuildContext provides information about a widget’s location in the widget tree, allowing access to theme and configuration data. PDFs can expand on its utility."},\n' +
            '  {"question": "How do you pass data between screens in Flutter?", "answer": "Data is passed using Navigator methods with arguments. Enhanced PDF insights might suggest best practices."},\n' +
            '  {"question": "What is the purpose of the Scaffold widget?", "answer": "Scaffold provides the basic material design layout structure, including an AppBar and body. PDF content can offer additional layout suggestions."},\n' +
            '  {"question": "When should Navigator.pushReplacementNamed be used?", "answer": "It replaces the current screen with a new one, ensuring the previous screen is removed from the stack. PDFs may provide context for its optimal use."},\n' +
            '  {"question": "How can insights from extracted PDFs enhance study material on Flutter UI development?", "answer": "Extracted PDFs provide real-world examples, detailed explanations, and advanced techniques that enrich the basic topics for a deeper understanding."}\n' +
            "]\n" +
            "```",
        },
      ],
    },
  ],
});
