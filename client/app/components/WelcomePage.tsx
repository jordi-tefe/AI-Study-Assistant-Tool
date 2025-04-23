import React from "react";
import { BookOpenCheck, MessagesSquare, FileText } from "lucide-react";
import styles from "../../styles/WelcomePage.module.css";

const features = [
  {
    icon: <BookOpenCheck className="feature-icon" />,
    title: "Short Note Generator",
    description: "Generate concise, AI-powered notes from your uploaded materials — ideal for quick revision and concept recall."
  },
  {
    icon: <FileText className="feature-icon" />,
    title: "Quiz Generator",
    description: "Transform your documents into engaging quizzes to reinforce your learning and improve retention."
  },
  {
    icon: <MessagesSquare className="feature-icon" />,
    title: "Smart Chatbot",
    description: "Ask questions and receive answers directly from your uploaded files — just like chatting with your notes."
  }
];

const WelcomePage = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  return (
    <div className="welcome-container">
      {/* <header className="header">
        <h1 className="main-heading">
          Welcome to <span className="brand-accent">AI Study Tools</span>
        </h1>
        <p className="subtitle">
          Your personal AI assistant for faster, smarter studying.
        </p>
        <button onClick={onGetStartedClick} className="get-started-btn">
          🚀 Start Learning Now
        </button>
      </header> */}
      <section className={styles.welcomeContainer}>
  <div className={styles.welcomeContent}>
    <h1 className={styles.title}>
      Meet Your <span className={styles.highlight}>AI Study Assistant</span>
    </h1>
    <p className={styles.subtitle}> ... </p>
    <button onClick={onGetStartedClick} className={styles.getStartedBtn}>
      Start Learning Now
    </button>
  </div>

  <div className={styles.featureGrid}>
    {features.map((feature, index) => (
      <div key={index} className={styles.featureCard}>
        <div className={styles.featureIcon}>{feature.icon}</div>
        <h3 className={styles.featureTitle}>{feature.title}</h3>
        <p className={styles.featureDescription}>{feature.description}</p>
      </div>
    ))}
  </div>
</section>
    </div>
  );
};

export default WelcomePage;
