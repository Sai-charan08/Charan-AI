import { NextRequest, NextResponse } from 'next/server';
import { Message, WebSource } from '@/types/chat';
import { buildCustomSystemPrompt } from '@/lib/ai/systemPrompt';
import { getAIProvider } from '@/lib/ai/AIProviderFactory';
import { getSearchProvider } from '@/lib/search/SearchProviderFactory';
import { detectUserIntent } from '@/lib/ai/intentDetector';
import { checkUserPromptSafety, sanitizeUntrustedContent } from '@/lib/safety/promptInjectionGuard';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, settings, searchOverride, attachments, stream = true } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage: Message = messages[messages.length - 1];
    let userPrompt = lastMessage.content || '';

    // If file attachments exist, append sanitized content to user prompt context
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const sanitizedFiles = attachments
        .map((f: any) => sanitizeUntrustedContent(f.content, f.name))
        .join('\n\n');
      userPrompt += `\n\n### USER UPLOADED FILES\n${sanitizedFiles}`;
    }

    // 1. Safety Check
    const safetyCheck = checkUserPromptSafety(userPrompt);
    if (!safetyCheck.isSafe) {
      return NextResponse.json({
        content: `${safetyCheck.reason}\n\n${safetyCheck.suggestedAlternative}`,
        intent: 'safety_refusal',
        sources: [],
        isWebSearchUsed: false,
      });
    }

    // 2. Intent Detection
    const intentResult = detectUserIntent(lastMessage.content);
    const isInternalQuery = intentResult.intent === 'identity' || intentResult.intent === 'greeting';
    const shouldSearch =
      searchOverride === true ||
      (searchOverride !== false &&
        !isInternalQuery &&
        (settings?.webSearchMode === 'on' ||
          (settings?.webSearchMode === 'auto' && intentResult.requiresWebSearch)));

    // 3. Fast Web Search Execution (with 800ms timeout race for instant response)
    let sources: WebSource[] = [];
    if (shouldSearch) {
      try {
        const searchProvider = getSearchProvider(settings?.searchProvider);
        const searchPromise = searchProvider.search(lastMessage.content, { maxResults: 5 });
        const timeoutPromise = new Promise<WebSource[]>((resolve) =>
          setTimeout(() => resolve([]), 800)
        );
        sources = await Promise.race([searchPromise, timeoutPromise]);
      } catch (err) {
        console.warn('Web search failed gracefully:', err);
      }
    }

    const processedMessages = [...messages];
    if (attachments && attachments.length > 0) {
      processedMessages[processedMessages.length - 1] = {
        ...lastMessage,
        content: userPrompt,
      };
    }

    const aiProvider = getAIProvider(settings?.aiProvider);
    const customSystemPrompt = buildCustomSystemPrompt(settings);

    // If client requested SSE streaming response (ChatGPT / Gemini style)
    if (stream) {
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          // Send initial metadata chunk
          const metaPayload = JSON.stringify({
            type: 'metadata',
            intent: intentResult.intent,
            sources,
            isWebSearchUsed: sources.length > 0,
          });
          controller.enqueue(encoder.encode(`data: ${metaPayload}\n\n`));

          // Stream text chunks
          try {
            await aiProvider.streamResponse(
              processedMessages,
              {
                modelName: settings?.modelName,
                apiKey: settings?.apiKey,
                temperature: settings?.temperature ?? 0.7,
                systemPrompt: customSystemPrompt,
                sources,
              },
              (chunk: string) => {
                const textPayload = JSON.stringify({ type: 'text', content: chunk });
                controller.enqueue(encoder.encode(`data: ${textPayload}\n\n`));
              }
            );
          } catch (err: any) {
            const errPayload = JSON.stringify({ type: 'error', content: err?.message || 'Streaming error' });
            controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // Standard Non-Streaming JSON Response Fallback
    const aiResponseText = await aiProvider.generateResponse(processedMessages, {
      modelName: settings?.modelName,
      apiKey: settings?.apiKey,
      temperature: settings?.temperature ?? 0.7,
      systemPrompt: customSystemPrompt,
      sources,
    });

    return NextResponse.json({
      content: aiResponseText,
      intent: intentResult.intent,
      sources,
      isWebSearchUsed: sources.length > 0,
    });
  } catch (error: any) {
    console.error('API /chat Route Error:', error);
    return NextResponse.json(
      {
        error: 'I couldn\'t complete that request because the service is temporarily unavailable. Please try again.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
