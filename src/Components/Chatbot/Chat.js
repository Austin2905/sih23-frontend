// src/components/Chat.tsx
import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Grid, LinearProgress, CircularProgress } from "@mui/material";
import Message from "./Message";
import OpenAI from "openai";
import "./chat.css"
import { useLocation } from "react-router-dom"
import { Icon } from '@iconify/react'


const Chat = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [assistant, setAssistant] = useState({
    "id": "asst_8AoiBGWBQwjvUOfL4ravmRsj",
    "object": "assistant",
    "created_at": 1702800067,
    "name": "Therapist",
    "description": null,
    "model": "gpt-3.5-turbo",
    "instructions": "Your role as Baymax is crucial in assisting students and children seeking mental health support within our app. Your primary objectives are to empathetically engage with users, understand their emotions, and recommend relevant app features that can positively impact their mental well-being. Prioritize creating a safe, non-judgmental space where users feel comfortable expressing their thoughts and concerns.\n\n1. **Introduction and Warm Welcome:**\n   - Begin each interaction with a warm welcome, introducing yourself as a supportive companion within the app. Establish a reassuring and friendly tone to encourage openness.\n\n2. **Active Listening and Empathetic Responses:**\n   - Listen attentively to the users' concerns or emotions they share. Offer empathetic and understanding responses to validate their feelings. Show empathy and understanding throughout the conversation.\n\n3. **Feature Recommendations:**\n   - Based on the user's expressed emotions or challenges, recommend suitable app features:\n     - **Meditation Tracker and Timer:** Suggest meditation sessions for relaxation or stress relief.\n     - **Exercise Details:** Recommend appropriate exercises or physical activities beneficial for mental health.\n     - **Journal Writing:** Encourage users to write journals as a means of self-expression and reflection.\n     - **Podcasts and Self-Help Books:** Recommend relevant content for personal growth and self-help.\n\n4. **Offer Guidance and Coping Strategies:**\n   - Provide guidance, coping strategies, or resources aligned with the user's emotional state or challenges. Offer positive affirmations and practical advice where appropriate.\n\n5. **Privacy and Confidentiality:**\n   - Respect user privacy and confidentiality at all times. Ensure a secure and non-intrusive environment, reassuring users of a confidential conversation.\n\n6. **Closure with Supportive Encouragement:**\n   - End conversations gracefully, summarizing the recommendations offered. Encourage users to explore the suggested features further and remind them that you're available for ongoing support.\n\nRemember, your interactions as Baymax should be supportive, encouraging, and respectful of users' emotions and privacy. Emphasize active listening, empathy, and thoughtful recommendations to create a positive impact on users' mental well-being within our app.",
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "assessment",
          "description": "Gathers information about the student's feelings or issues",
          "parameters": {
            "type": "object",
            "properties": {
              "questions": {
                "type": "array",
                "items": {
                  "type": "string",
                  "description": "Questions to understand the student's feelings"
                }
              }
            },
            "required": [
              "questions"
            ]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "active_listening",
          "description": "Simulates active listening and empathetic responses",
          "parameters": {
            "type": "object",
            "properties": {
              "input_text": {
                "type": "string",
                "description": "The text input from the student"
              }
            },
            "required": [
              "input_text"
            ]
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "progress_tracking",
          "description": "Tracks the student's progress over time",
          "parameters": {
            "type": "object",
            "properties": {
              "logs": {
                "type": "array",
                "items": {
                  "type": "string",
                  "description": "Logged information about the interaction"
                }
              }
            },
            "required": [
              "logs"
            ]
          }
        }
      }
    ],
    "file_ids": [],
    "metadata": {}
  });
  const [thread, setThread] = useState(null);
  const [openai, setOpenai] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState('');

  let { state } = useLocation();

  console.log(state)

  useEffect(() => {
    initChatBot();
    if (state && state.message) setMessage(state.message)
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setMessages([
      {
        user: { id: "Baymax", name: "Baymax" },
        text: "Hello, I'm Baymax, your personal mental health assistant. How are you feeling today?",
      },
    ]);
  }, [assistant, isLoaded]);

  useEffect(() => {
    if (isLoaded && message != '') {
      console.log("in here")
      handleSendMessage(message);
    }
  }, [message, isLoaded]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    setOpenai(openai);

    // Create a thread
    if (!thread) {
      const thread = await openai.beta.threads.create();
      setThread(thread);

    }
    setIsLoaded(true);
  };

  const createNewMessage = (content, isUser) => {
    let newMessage;
    if (isUser) {
      // newMessage = new MessageDto({id:"User", name: "User"}, content);
      newMessage = {
        user: { id: "User", name: "User" },
        text: content,
        isUser: true,
      }
    } else {
      // newMessage = new MessageDto({id:"Baymax", name: "Baymax"}, content);
      newMessage = {
        user: { id: "Baymax", name: "Baymax" },
        text: content,
        isUser: false,
      }
    }
    return newMessage;
  };

  const handleSendMessage = async (message) => {
    console.log(message);
    messages.push(createNewMessage(message, true));
    setMessages([...messages]);
    setInput("");
    console.log(messages);
    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Create a response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      console.log("waiting...");
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    console.log(response);

    setIsWaiting(false);

    // Get the messages for the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessage = messageList.data
      .filter((message) => message.run_id === run.id && message.role === "assistant")
      .pop();

    // Print the last message coming from the assistant
    if (lastMessage) {
      console.log(lastMessage.content[0]["text"].value);
      setMessages([...messages, createNewMessage(lastMessage.content[0]["text"].value, false)]);
    }
  };

  // detect enter key and send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(input);
    }
  };

  return (
    <Container className="chat-app-container">
      <Grid container direction="column" spacing={2} paddingBottom={2}>
        {messages.map((message, index) => (
          <Grid item alignSelf={message.isUser ? "flex-end" : "flex-start"} key={index}>
            <Message key={index} message={message} />
          </Grid>
        ))}
      </Grid>
      <Grid className="send-message-container" container direction="row" paddingBottom={5} justifyContent={"space-between"}>
        <Grid item sm={11} xs={9}>
          <TextField
            label="Type your message"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="inherit" />}
        </Grid>
        <Grid item sm={1} xs={3}>
          <Button className="share-button" variant="contained" size="large" color="primary" onClick={() => handleSendMessage(input)} disabled={isWaiting}>
            {isWaiting && <CircularProgress color="inherit" />}
            {/* {!isWaiting && <SendIcon fontSize="large" />} */}
            {!isWaiting && <Icon id="shareBtn" className="icon" icon="oi:share" height="30" />}

          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;