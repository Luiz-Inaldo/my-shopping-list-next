describe('playSound Utility Function', () => {
  let playSpy: jest.SpyInstance;
  let playSound: typeof import('@/functions/playSound').playSound;
  let preloadSounds: typeof import('@/functions/playSound').preloadSounds;

  const playedAudio = (call: number) =>
    playSpy.mock.contexts[call] as HTMLAudioElement;

  beforeEach(async () => {
    // O módulo guarda os elementos de áudio em cache, então cada teste
    // precisa de uma instância nova.
    jest.resetModules();
    playSpy = jest
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    ({ playSound, preloadSounds } = await import('@/functions/playSound'));
  });

  afterEach(() => {
    playSpy.mockRestore();
  });

  it('should play the sound file of add_user_new_list', () => {
    playSound('add_user_new_list');

    expect(playSpy).toHaveBeenCalledTimes(1);
    expect(playedAudio(0).src).toContain('/sounds/add-success.wav');
  });

  it('should play the sound file of remove_user_list', () => {
    playSound('remove_user_list');

    expect(playSpy).toHaveBeenCalledTimes(1);
    expect(playedAudio(0).src).toContain('/sounds/delete-crumple.wav');
  });

  it('should restart the same audio element when played twice in a row', () => {
    playSound('add_user_new_list');
    const audio = playedAudio(0);
    audio.currentTime = 5;

    playSound('add_user_new_list');

    expect(playedAudio(1)).toBe(audio);
    expect(audio.currentTime).toBe(0);
  });

  it('should not throw when the browser rejects the playback', async () => {
    playSpy.mockRejectedValue(new Error('NotAllowedError'));

    expect(() => playSound('add_user_new_list')).not.toThrow();

    await Promise.resolve();
  });

  it('should preload the sounds without playing them', () => {
    preloadSounds();

    expect(playSpy).not.toHaveBeenCalled();
  });
});
