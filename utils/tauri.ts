export async function downloadSound(url: string, name: string) {
  const { invoke } = await import('@tauri-apps/api');

  if (!url || !name) return;

  try {
    await invoke('download_sound', { url, name });
  } catch (error) {
    console.error(error);
    useToast().add({
      icon: 'i-ph-warning-duotone',
      title: 'Hubo un error al descargar el sonido',
      color: 'red',
    });
  }
}
