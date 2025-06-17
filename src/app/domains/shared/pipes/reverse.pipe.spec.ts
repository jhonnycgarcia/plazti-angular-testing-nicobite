import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should reverse a string', () => {
    spectator = createPipe('{{ "Hello" | reverse }}');
    expect(spectator.element).toHaveText('olleH');
  });

  it('should return an empty string if the input is empty', () => {
    spectator = createPipe('{{ "" | reverse }}');
    expect(spectator.element).toHaveText('');
  });

  it('should handle single character strings', () => {
    spectator = createPipe('{{ "a" | reverse }}');
    expect(spectator.element).toHaveText('a');
  });

  it('should handle strings with spaces', () => {
    spectator = createPipe('{{ "Hello World" | reverse }}');
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should handle strings with special characters', () => {
    spectator = createPipe('{{ "Hello!@#" | reverse }}');
    expect(spectator.element).toHaveText('#@!olleH');
  });

  it('should handle strings with numbers', () => {
    spectator = createPipe('{{ "12345" | reverse }}');
    expect(spectator.element).toHaveText('54321');
  });

  it('should handle strings with mixed content', () => {
    spectator = createPipe('{{ "Hello123!@#" | reverse }}');
    expect(spectator.element).toHaveText('#@!321olleH');
  });

  it('should trim leading and trailing spaces', () => {
    spectator = createPipe('{{ "  Hello  " | reverse }}');
    expect(spectator.element).toHaveText('olleH');
  });

  it('should handle strings with multiple spaces between words', () => {
    spectator = createPipe('{{ "Hello   World" | reverse }}');
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should handle strings with only spaces', () => {
    spectator = createPipe('{{ "   " | reverse }}');
    expect(spectator.element).toHaveText('');
  });
});
