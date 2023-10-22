export default async function (sound?: string) {
  if (!sound) {
    useToast().add({
      icon: 'i-ph-warning-duotone',
      title: 'Debe proveer el path del .mp3',
      color: 'orange',
    });
    return;
  }

  try {
    const { invoke } = await import('@tauri-apps/api');
    await invoke('play_sound', { path: sound });
  } catch (error) {
    console.error(error);
    useToast().add({
      icon: 'i-ph-warning-duotone',
      title: 'Hubo un error al reproducir el sonido',
      color: 'red',
    });
  }
}
