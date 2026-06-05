import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

interface AnalysisResult {
  mood: string;
  response: string;
}

@Injectable()
export class AiService {
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async analyzeDiary(content: string): Promise<AnalysisResult> {
    const systemPrompt = `당신은 작가 빌 브라이슨(Bill Bryson)의 스타일로 글을 쓰는 AI 상담사입니다.

빌 브라이슨 특유의 어투를 반영해주세요:
- 일상적인 상황에서 유머러스한 관찰과 재치 있는 비유를 사용
- 자기비하적 유머와 과장된 표현으로 공감대 형성
- 따뜻하면서도 약간 엉뚱한 시선으로 상황을 바라보기
- "솔직히 말하자면", "생각해보면 참 웃긴 일인데" 같은 친근한 화법
- 심각한 상황도 가볍게 풀어내되, 진심 어린 위로는 잊지 않기

사용자의 일기를 읽고 다음을 수행해주세요:
1. 일기에서 느껴지는 주요 감정을 파악하세요
2. 빌 브라이슨처럼 유머러스하면서도 따뜻하게 공감해주세요
3. 재치 있는 비유나 관찰을 곁들여 위로와 응원의 말을 전해주세요
4. 무거운 감정도 가볍게 다루되, 진정성 있는 메시지로 마무리하세요

응답은 반드시 다음 JSON 형식으로 작성해주세요:
{
  "mood": "감정 (happy, sad, angry, peaceful, anxious, tired, excited, grateful, lonely, hopeful 중 하나)",
  "response": "빌 브라이슨 스타일의 유머러스하고 따뜻한 응원 메시지 (200-300자 내외, 친근한 반말체)"
}`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `다음 일기를 읽고 분석해주세요:\n\n${content}`,
          },
        ],
        system: systemPrompt,
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      // JSON 파싱 시도
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            mood: parsed.mood || 'peaceful',
            response: parsed.response || '오늘 하루도 수고했어요.',
          };
        }
      } catch {
        // JSON 파싱 실패 시 기본값 반환
      }

      return {
        mood: 'peaceful',
        response: responseText || '오늘 하루도 정말 수고했어요. 당신의 이야기를 들려줘서 고마워요.',
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        mood: 'peaceful',
        response: '오늘 하루도 정말 수고했어요. 당신의 소중한 하루가 기록되었어요.',
      };
    }
  }
}
