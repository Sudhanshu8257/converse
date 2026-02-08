const baseUrl = "https://converse-chatbot.netlify.app";

export const HomePagePersonSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Converse AI",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  url: "https://converse-chatbot.netlify.app/",
  description:
    "An intelligent AI chatbot platform featuring persona-driven interactions with celebrities and fictional characters.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export const HomeFaqs = [
  {
    _id: "faq-1",
    question: "What is Converse AI and how does it work?",
    answer:
      "Converse AI is an intelligent chatbot platform built on the MERN stack that allows you to chat with realistic AI personas. It uses advanced natural language processing to simulate conversations with celebrities and fictional characters, providing a seamless and engaging interactive experience directly in your browser.",
  },
  {
    _id: "faq-2",
    question: "Is it free to chat with characters on Converse?",
    answer:
      "Yes, Converse AI offers free access to a wide range of AI personalities. You can start chatting immediately with featured characters like Luffy or Zoro without any hidden costs, making it one of the most accessible platforms for persona-based AI interaction available today.",
  },
  {
    _id: "faq-3",
    question: "Can I use Converse AI on my mobile phone?",
    answer:
      "Absolutely. Converse is fully optimized for mobile devices, ensuring a fast and responsive chat experience on both iOS and Android. The interface adapts to any screen size, allowing you to converse with your favorite AI characters on the go without losing functionality.",
  },
  {
    _id: "faq-4",
    question: "What makes Converse different from other AI chatbots?",
    answer:
      "Converse stands out by focusing on high-fidelity persona modeling and a community-driven character library. Unlike generic AI assistants, our platform is designed for immersive roleplay and personality-driven dialogue, specifically tailored for fans of anime, movies, and pop culture.",
  },
  {
    _id: "faq-5",
    question: "Are the conversations on Converse private?",
    answer:
      "User privacy is a top priority. Your conversations are processed securely and we implement strict data protection measures to ensure your interactions remain private. We focus on providing a safe environment for creative and intelligent conversation with our AI models.",
  },
];

export const HomeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HomeFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export const CelebritiesFaqs = [
  {
    _id: "faq-1",
    question: "How do I start a conversation with an AI persona?",
    answer:
      "To start chatting, simply browse our directory and click on your favorite persona. Our platform offers instant access to a variety of AI models, from popular anime characters like Luffy to expert AI astrologers, allowing for realistic and engaging real-time conversations.",
  },
  {
    _id: "faq-2",
    question: "Is it really free to chat with celebrities on Converse?",
    answer:
      "Yes, chatting with all personalities in our directory is completely free. We provide a seamless experience where you can interact with digital versions of your favorite stars and fictional icons without any subscription fees or hidden costs.",
  },
  {
    _id: "faq-3",
    question: "Are the AI characters based on real personalities?",
    answer:
      "Our AI personas are carefully modeled after the speech patterns, personality traits, and lore of famous celebrities and fictional characters. While they are AI simulations, they are designed to provide an authentic-feeling interaction based on their real-world or series-specific backgrounds.",
  },
  {
    _id: "faq-4",
    question: "Can I get a personal reading from the AI Astrologer?",
    answer:
      "Yes, our AI Astrologer is specifically fine-tuned to provide insights based on astrological principles. You can ask for daily horoscopes, compatibility checks, or general life advice, and the AI will respond using specialized knowledge within the field of astrology.",
  },
  {
    _id: "faq-5",
    question: "Which new characters are being added to the directory?",
    answer:
      "We are constantly expanding our directory to include trending anime stars, global celebrities, and new expert personas. We prioritize community requests, so if you have a specific character you'd like to see, feel free to reach out to our team.",
  },
];

export const getCelebritiesPageSchema = ({
  personalitiesData,
}: {
  personalitiesData: any;
}) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Explore AI Personas: From Anime Stars to Expert Astrologers",
        description:
          "Browse our directory of AI-modeled personalities. Chat with characters like Luffy and Sasuke, or consult our AI Astrologer.",
        mainEntity: {
          "@type": "ItemList",
          name: "Converse AI Persona Directory",
          itemListElement: personalitiesData.data.map(
            (item: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Person",
                name: item.fullName,
                url: `${baseUrl}/personality/${item.fullName.replaceAll(" ", "-").replaceAll(".", "")}`,
                image: item.imgUrl,
              },
            }),
          ),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: CelebritiesFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
};

export const getPersonalityPageSchema = (personality: any) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}/personality/${personality.fullName.replaceAll(" ", "-").replaceAll(".", "")}#profilepage`,
        url: `${baseUrl}/personality/${personality.fullName.replaceAll(" ", "-").replaceAll(".", "")}`,
        mainEntity: {
          "@type": "Person",
          name: `${personality.fullName} AI`,
          description: personality.heroDescription,
          image: personality.imgUrl,
          // If you have a category like 'Anime' or 'Astrologer' in your data
          knowsAbout: [
            personality.category || "AI Conversation",
            "Persona Roleplay",
          ],
        },
        dateCreated: "2026-02-08T12:00:00Z",
      },
      {
        "@type": "FAQPage",
        mainEntity:
          personality.faq?.map((f: any) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })) || [],
      },
    ],
  };
};

export const getAboutPageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${baseUrl}/about#webpage`,
        "url": `${baseUrl}/about`,
        "name": "About Converse: Transforming Conversations with Intelligent AI",
        "description": "Learn about the mission, features, and the creator behind Converse AI.",
        "mainEntity": { "@id": `${baseUrl}/#organization` }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Converse",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`, // Ensure this path is correct
        "founder": { "@id": `${baseUrl}/#creator` },
        "description": "An intelligent AI chatbot platform designed for meaningful and intuitive digital interactions."
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}/#creator`,
        "name": "Sudhanshu Lohana",
        "jobTitle": "Web Developer and UI/UX Designer",
        "url": `${baseUrl}/about`,
        "nationality": "Indian",
        "sameAs": [
          "https://github.com/Sudhanshu8257"
        ]
      }
    ]
  };
};