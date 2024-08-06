declare namespace Deno {
  function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'npm:openai' {
  export default class OpenAI {
    audio: {
      transcriptions: {
        create(params: any): Promise<any>;
      };
      speech: {
        create(params: { model: string; voice: string; input: string }): Promise<{
          arrayBuffer(): Promise<ArrayBuffer>;
        }>;
      };
    };
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
  }
  export function toFile(buffer: Uint8Array, name: string, options: { type: string }): Promise<any>;
}
