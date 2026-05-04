import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VectorStore } from "@langchain/core/vectorstores";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import prisma from '../utils/prisma';

export class RagService {
  private static vectorStore: any;
  
  static async init() {
    if (!this.vectorStore) {
      const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
      this.vectorStore = new MemoryVectorStore(new GoogleGenerativeAIEmbeddings({
        apiKey: apiKey,
        modelName: "gemini-embedding-2"
      }));
    }
  }

  /**
   * Embeds and stores the latest standups into the Vector Store.
   * In a production app, this should be an upsert operation or triggered 
   * automatically on standup creation using a webhook/event.
   */
  static async indexStandups() {
    await this.init();
    
    const standups = await prisma.standup.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50 // take latest 50 standups for context
    });

    if (standups.length === 0) return 0;

    const docs = standups.map(s => {
      const content = `Date: ${s.createdAt.toISOString()}
User ${s.user.name} reported:
Completed: ${s.didToday}
Planning: ${s.doNext}
Blockers: ${s.blockers || 'None'}`;
      
      return new Document({
        pageContent: content,
        metadata: { id: s.id, userId: s.userId, date: s.createdAt.toISOString() }
      });
    });

    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
    
    // We recreate the store for simplicity here. 
    // For pgvector, we would use `.addDocuments()`
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new GoogleGenerativeAIEmbeddings({ apiKey: apiKey, modelName: "gemini-embedding-2" })
    );
    
    return docs.length;
  }

  /**
   * Retrieves relevant standups and generates a project manager summary
   */
  static async generateSummary() {
    await this.indexStandups();
    
    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
    
    const llm = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      modelName: "gemini-3-flash-preview",
      temperature: 0.3
    });

    // Retrieve documents related to "blockers and progress"
    const retriever = this.vectorStore.asRetriever(15);
    const docs: Document[] = await retriever.invoke("blockers progress issues completed");
    
    if (docs.length === 0) {
      return "Not enough standup data available to generate a summary.";
    }

    const context = docs.map(d => d.pageContent).join("\n\n---\n\n");

    const prompt = PromptTemplate.fromTemplate(`
      You are an expert AI Project Manager for a distributed engineering team.
      Below are the recent standup updates from the team.
      
      Please write a concise daily summary formatted in Markdown.
      Include the following sections:
      1. 🚀 Overall Progress (High-level summary of what was achieved)
      2. 🛑 Active Blockers (Any blockers that need immediate attention, mention the user)
      3. 📈 Key Trends & Next Steps (What the team is moving towards)
      
      Team Updates Context:
      {context}
      
      Daily Summary:
    `);

    const formattedPrompt = await prompt.format({ context });
    const response = await (llm as any).invoke(formattedPrompt);
    return response.content.toString();
  }
}
