export function clearLegacyBrowserCaches() {
  if (typeof window === 'undefined') {
    return
  }

  const clearCaches = async () => {
    if (!('caches' in window)) {
      return
    }

    const keys = await window.caches.keys()
    await Promise.all(keys.map((key) => window.caches.delete(key)))
  }

  const unregisterWorkers = async () => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))
  }

  void Promise.allSettled([clearCaches(), unregisterWorkers()])
}
