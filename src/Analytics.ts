export class Analytics {
  public static trackEvent(
    eventCategory: string,
    eventAction: string,
    eventName?: string | number
  ) {
    //_paq does not exist on window prototype, ignore the TS error
    //@ts-ignore
    window._paq.push(['trackEvent', eventCategory, eventAction, eventName])
  }

  public static trackPageView() {
    //_paq does not exist on window prototype, ignore the TS error
    //@ts-ignore
    window._paq.push(['trackPageView'])
  }

  public static sendPing() {
    //_paq does not exist on window prototype, ignore the TS error
    //@ts-ignore
    window._paq.push(['ping'])
  }
}
